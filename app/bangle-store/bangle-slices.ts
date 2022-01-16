import {
  ApplicationStore,
  Slice,
  SliceSideEffect,
} from '@bangle.io/create-store';
import { extensionRegistrySlice } from '@bangle.io/extension-registry';
import {
  EditorManagerAction,
  editorManagerSlice,
} from '@bangle.io/slice-editor-manager';
import {
  pageLifeCycleTransitionedTo,
  pageSlice,
  PageSliceAction,
} from '@bangle.io/slice-page';
import { UiContextAction, uiSlice } from '@bangle.io/slice-ui';
import type { WorkspaceSliceAction } from '@bangle.io/slice-workspace';
import { workspaceSlice } from '@bangle.io/slice-workspace';
import { workspacesSlice } from '@bangle.io/slice-workspaces-manager';
import { naukarProxy } from '@bangle.io/worker-naukar-proxy';
import { workerSetupSlices } from '@bangle.io/worker-setup';

import { e2eHelpers } from './e2e-helpers';
import { historySlice } from './slices/history-slice';
import { pageLifeCycleSlice } from './slices/page-lifecycle-slice';

export type BangleActionTypes =
  | UiContextAction
  | PageSliceAction
  | EditorManagerAction
  | WorkspaceSliceAction;

export type BangleSliceTypes = ReturnType<typeof bangleStateSlices>;

export function bangleStateSlices({
  onUpdate,
  onPageInactive,
  extensionSlices,
}: {
  onUpdate?: (store: ApplicationStore) => void;
  onPageInactive: (store: ApplicationStore) => void;
  extensionSlices: Slice<any>[];
}) {
  const pageBlock = [pageSlice(), historySlice(), pageLifeCycleSlice()];

  return [
    ...pageBlock,
    ...workerSetupSlices(),
    workspacesSlice(),
    extensionRegistrySlice(),
    workspaceSlice(),
    uiSlice(),
    editorManagerSlice(),

    ...extensionSlices,

    e2eHelpers(),
    // keep this at the end
    new Slice({
      sideEffect: [
        flushNaukarEffect,

        () => {
          return {
            deferredUpdate(store) {
              onUpdate?.(store);
            },
          };
        },

        // monitor page life cycle
        () => {
          return {
            update(store, prevState) {
              const didChange = pageLifeCycleTransitionedTo(
                ['passive', 'terminated', 'hidden'],
                prevState,
              )(store.state);

              if (didChange) {
                onPageInactive(store);
              }
            },
          };
        },
      ],
    }),
  ];
}

// TODO this can move to the worker's store
export const flushNaukarEffect: SliceSideEffect<any, any> = () => {
  return {
    update: (store, prevState) => {
      if (pageLifeCycleTransitionedTo('active', prevState)(store.state)) {
        naukarProxy.current.resetManager();
        return;
      }

      const pageTransitionedToInactive = pageLifeCycleTransitionedTo(
        ['passive', 'terminated', 'frozen', 'hidden'],
        prevState,
      )(store.state);

      if (pageTransitionedToInactive) {
        naukarProxy.current.flushDisk();
        return;
      }
    },
  };
};
