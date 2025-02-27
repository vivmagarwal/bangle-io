import { workspace } from '@bangle.io/api';
import { getExtension } from '@bangle.io/ws-path';

import type { GithubWsMetadata } from './common';
import { GITHUB_STORAGE_PROVIDER_NAME } from './common';

export async function readGhWorkspaceMetadata(
  wsName: string,
): Promise<GithubWsMetadata | undefined> {
  return workspace.readWorkspaceMetadata(wsName, {
    type: GITHUB_STORAGE_PROVIDER_NAME,
  }) as Promise<GithubWsMetadata | undefined>;
}

/**
 * Returns a new unique wsPath for the given wsPath following
 * postfixed with `-conflict-<number>`.
 *
 * @param wsPath
 * @returns
 */
export function getNonConflictName(wsPath: string): string {
  const ext = getExtension(wsPath) || '';

  let pathWithoutExt = wsPath.slice(0, -1 * ext.length);

  if (/-conflict-\d+$/.test(pathWithoutExt)) {
    pathWithoutExt = pathWithoutExt.slice(
      0,
      -1 *
        pathWithoutExt.slice(pathWithoutExt.lastIndexOf('-conflict-')).length,
    );
  }

  const rNumber = Date.now();

  return pathWithoutExt + `-conflict-${rNumber}` + ext;
}
