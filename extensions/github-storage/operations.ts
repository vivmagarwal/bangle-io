import { notification, workspace } from '@bangle.io/api';
import { SEVERITY } from '@bangle.io/constants';
import { pMap } from '@bangle.io/p-map';
import {
  isEntryDeleted,
  isEntryModified,
  isEntryNew,
} from '@bangle.io/remote-file-sync';

import {
  getGithubSyncLockWrapper,
  ghSliceKey,
  notify,
  OPERATION_SHOW_CONFLICT_DIALOG,
} from './common';
import { getGhToken, updateGhToken } from './database';
import { fileEntryManager } from './file-entry-manager';
import type { GithubConfig } from './github-api-helpers';
import { serialGetRepoTree } from './github-api-helpers';
import {
  discardLocalEntryChanges,
  duplicateAndResetToRemote,
  getConflicts,
  githubSync,
  optimizeDatabase,
} from './github-sync';
import { readGhWorkspaceMetadata } from './helpers';

const getGhConfig = async (
  wsName: string,
): Promise<GithubConfig | undefined> => {
  const ghMetadata = await readGhWorkspaceMetadata(wsName);
  const githubToken = await getGhToken();

  if (!ghMetadata || !githubToken) {
    return undefined;
  }

  const ghConfig = { ...ghMetadata, repoName: wsName, githubToken };

  return ghConfig;
};

export function syncRunner(
  wsName: string,
  abort: AbortSignal,
  notifyVerbose = false,
) {
  async function syncRunGuard(
    store: ReturnType<typeof ghSliceKey.getStore>,
    notifyVerbose: boolean,
  ) {
    const { githubWsName } = ghSliceKey.getSliceStateAsserted(store.state);

    if (githubWsName !== wsName) {
      notify(store, 'Not a Github workspace', SEVERITY.WARNING);

      return false;
    }

    const ghConfig = await getGhConfig(wsName);

    if (!ghConfig) {
      return false;
    }

    if (ghSliceKey.getSliceStateAsserted(store.state).isSyncing) {
      notifyVerbose &&
        notify(store, 'Github sync already in progress', SEVERITY.INFO);

      return false;
    }

    try {
      const { lockAcquired, result } = await getGithubSyncLockWrapper(
        wsName,
        async () => {
          store.dispatch({
            name: 'action::@bangle.io/github-storage:UPDATE_SYNC_STATE',
            value: {
              isSyncing: true,
            },
          });

          const result = await runSync(store, ghConfig);

          return result;
        },
      );

      if (!lockAcquired) {
        notifyVerbose &&
          notify(store, 'Github sync already in progress', SEVERITY.INFO);

        console.warn('Github sync: lock not acquired');

        return false;
      }

      if (
        result !== false &&
        result.status === 'merge-conflict' &&
        notifyVerbose
      ) {
        notification.notificationSliceKey.callOp(
          store.state,
          store.dispatch,
          notification.showNotification({
            severity: SEVERITY.ERROR,
            title: 'Github sync failed',
            uid: 'sync notification-' + Math.random(),
            content:
              'Syncing failed due to merge conflicts. Please resolve the issues and try again.',
            transient: false,
            buttons: [
              {
                operation: OPERATION_SHOW_CONFLICT_DIALOG,
                title: 'Resolve Conflicts',
                dismissOnClick: true,
              },
            ],
          }),
        );
      }

      return result;
    } catch (error) {
      console.error(error);
      notify(
        store,
        'Github sync failed',
        SEVERITY.ERROR,
        error instanceof Error ? error.message : 'Unknown error',
      );

      return false;
    } finally {
      store.dispatch({
        name: 'action::@bangle.io/github-storage:UPDATE_SYNC_STATE',
        value: {
          isSyncing: false,
        },
      });
    }
  }

  async function runSync(
    store: ReturnType<typeof ghSliceKey.getStore>,
    config: GithubConfig,
  ) {
    const { wsName: currentWsName } =
      workspace.workspaceSliceKey.getSliceStateAsserted(store.state);

    if (currentWsName !== wsName) {
      return false;
    }

    return githubSync({
      wsName,
      config,
      abortSignal: abort,
    });
  }

  return ghSliceKey.asyncOp(async (_, __, store) => {
    const result = await syncRunGuard(store, notifyVerbose);

    if (result === false) {
      console.debug('gh-sync returned false');
    } else {
      workspace.workspaceSliceKey.callOp(
        store.state,
        store.dispatch,
        workspace.refreshWsPaths(),
      );

      const { count: changeCount } = result;

      if (result.status === 'merge-conflict') {
        setConflictedWsPaths(result.conflict)(store.state, store.dispatch);

        return;
      }

      if (typeof changeCount === 'number') {
        if (changeCount === 0) {
          notifyVerbose &&
            notify(store, 'Github sync completed', SEVERITY.INFO);
        }
        if (changeCount > 0) {
          notify(
            store,
            'Github sync completed',
            SEVERITY.INFO,
            `Synced ${changeCount} file${changeCount === 1 ? '' : 's'}`,
          );
        }
      }
    }
  });
}

export function setConflictedWsPaths(conflictedWsPaths: string[]) {
  return ghSliceKey.op((state, dispatch) => {
    dispatch({
      name: 'action::@bangle.io/github-storage:SET_CONFLICTED_WS_PATHS',
      value: {
        conflictedWsPaths,
      },
    });
  });
}

export function discardLocalChanges(wsName: string) {
  return ghSliceKey.asyncOp(async (_, __, store) => {
    const { isSyncing } = ghSliceKey.getSliceStateAsserted(store.state);

    if (isSyncing) {
      notify(
        store,
        'Cannot discard local changes',
        SEVERITY.INFO,
        'A sync is already in progress, please wait for it to finish.',
      );

      return false;
    }

    const { lockAcquired, result } = await getGithubSyncLockWrapper(
      wsName,
      async () => {
        const allEntries = await fileEntryManager.listAllEntries(wsName);

        const result = await pMap(
          allEntries.filter((entry) => {
            return (
              isEntryModified(entry) ||
              isEntryNew(entry) ||
              isEntryDeleted(entry)
            );
          }),
          async (entry) => {
            return discardLocalEntryChanges(entry.uid);
          },
          {
            concurrency: 10,
            abortSignal: new AbortController().signal,
          },
        );

        return result.every((r) => r);
      },
    );

    if (!lockAcquired) {
      notify(
        store,
        'Cannot discard local changes',
        SEVERITY.INFO,
        'A sync is already in progress, please wait for it to finish.',
      );

      return false;
    }

    if (!result) {
      notify(
        store,
        'Failed to discard local changes',
        SEVERITY.INFO,
        'Failed to discard local changes. Please try again.',
      );

      return false;
    }

    return true;
  });
}

export const updateGithubToken = (
  wsName: string,
  token: string | undefined,
  showNotification = false,
) => {
  return ghSliceKey.asyncOp(async (_, __, store) => {
    if (ghSliceKey.getSliceStateAsserted(store.state).githubWsName === wsName) {
      await updateGhToken(token);

      if (showNotification) {
        notify(store, 'Github token successfully updated', SEVERITY.SUCCESS);
      }

      return true;
    }

    if (showNotification) {
      notify(
        store,
        'Github token not updated',
        SEVERITY.ERROR,
        'Please open a Github workspace before updating the token.',
      );
    }

    return false;
  });
};

export function manuallyResolveConflict(wsName: string) {
  return ghSliceKey.asyncOp(async (_, __, store) => {
    const config = await getGhConfig(wsName);

    if (!config) {
      return false;
    }

    const { conflictedWsPaths } = ghSliceKey.getSliceStateAsserted(store.state);

    try {
      const { lockAcquired, result } = await getGithubSyncLockWrapper(
        wsName,
        async () => {
          let result: Array<
            Awaited<ReturnType<typeof duplicateAndResetToRemote>>
          > = [];

          for (const cWsPath of conflictedWsPaths) {
            result.push(
              await duplicateAndResetToRemote({
                config,
                wsPath: cWsPath,
                abortSignal: new AbortController().signal,
              }),
            );
          }

          return result;
        },
      );

      if (!lockAcquired || result.some((r) => r == null)) {
        if (!lockAcquired) {
          console.warn('cannot manually resolve conflict, lock not acquired');
        }

        notify(
          store,
          'Unable to resolve conflict',
          SEVERITY.ERROR,
          'Please close any other Bangle tab and try again.',
        );

        return false;
      } else if (result) {
        store.dispatch({
          name: 'action::@bangle.io/github-storage:SET_CONFLICTED_WS_PATHS',
          value: {
            conflictedWsPaths: [],
          },
        });

        workspace.workspaceSliceKey.callOp(
          store.state,
          store.dispatch,
          workspace.refreshWsPaths(),
        );

        notify(
          store,
          'Manual Conflict Resolution',
          SEVERITY.SUCCESS,
          'Successfully created copies of the the conflicted files. Please resolve the conflicts manually and then sync again.',
        );

        const firstConflictedWsPath = result.find((r) => Boolean(r));

        if (firstConflictedWsPath) {
          // open the first conflicted file for easier manual conflict resolution
          workspace.workspaceSliceKey.callOp(
            store.state,
            store.dispatch,
            workspace.updateOpenedWsPaths((openedWsPaths) =>
              openedWsPaths
                .updatePrimaryWsPath(firstConflictedWsPath.remoteContentWsPath)
                .updateSecondaryWsPath(
                  firstConflictedWsPath.localContentWsPath,
                ),
            ),
          );
        }

        return true;
      }

      return false;
    } catch (e) {
      console.error(e);
      notify(
        store,
        'Unable to resolve conflict',
        SEVERITY.ERROR,
        'Something went wrong, please reload and try again.',
      );

      return false;
    }
  });
}

export function checkForConflicts(wsName: string) {
  return ghSliceKey.asyncOp(async (_, __, store) => {
    const config = await getGhConfig(wsName);

    if (!config) {
      return false;
    }

    const conflicts = await getConflicts({ wsName, config });

    const { wsName: currentWsName } =
      workspace.workspaceSliceKey.getSliceStateAsserted(store.state);

    if (currentWsName === wsName) {
      const { conflictedWsPaths } = ghSliceKey.getSliceStateAsserted(
        store.state,
      );

      if (
        conflicts.length > 0 ||
        (conflictedWsPaths.length > 0 && conflicts.length === 0)
      ) {
        store.dispatch({
          name: 'action::@bangle.io/github-storage:SET_CONFLICTED_WS_PATHS',
          value: {
            conflictedWsPaths: conflicts,
          },
        });
      }
    }

    return true;
  });
}

export function optimizeDatabaseOperation(
  pruneUnused: boolean = true,
  abortSignal = new AbortController().signal,
) {
  return ghSliceKey.asyncOp(async (_, __, store) => {
    const { githubWsName } = ghSliceKey.getSliceStateAsserted(store.state);

    if (!githubWsName) {
      return false;
    }

    const config = await getGhConfig(githubWsName);

    if (!config) {
      return false;
    }

    const tree = await serialGetRepoTree({
      wsName: githubWsName,
      config,
      abortSignal,
    });

    const { lockAcquired, result } = await getGithubSyncLockWrapper(
      githubWsName,
      async () => {
        const {
          openedWsPaths,
          wsName: currentWsName,
          recentlyUsedWsPaths,
        } = workspace.workspaceSliceKey.getSliceStateAsserted(store.state);

        if (currentWsName !== githubWsName) {
          return false;
        }

        const retainedWsPaths = new Set(
          [...openedWsPaths.toArray(), ...(recentlyUsedWsPaths || [])].filter(
            (r): r is string => typeof r === 'string',
          ),
        );

        return optimizeDatabase({
          tree,
          abortSignal,
          config,
          retainedWsPaths,
          wsName: githubWsName,
          pruneUnused,
        });
      },
    );

    if (!lockAcquired || !result) {
      !lockAcquired &&
        console.debug('cannot cleanup ws paths, lock not acquired');

      return false;
    }

    return true;
  });
}
