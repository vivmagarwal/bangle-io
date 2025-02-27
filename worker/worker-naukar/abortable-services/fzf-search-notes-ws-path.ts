import type { FzfOptions } from '@bangle.io/fzf-search';
import { byLengthAsc, byStartAsc, Fzf } from '@bangle.io/fzf-search';
import { assertSignal } from '@bangle.io/utils';
import { resolvePath } from '@bangle.io/ws-path';

export function fzfSearchNoteWsPaths(
  getNoteWsPaths: () => undefined | string[],
) {
  return async (
    abortSignal: AbortSignal,
    wsName: string,
    query: string,
    limit: number = 128,
  ) => {
    const wsPaths = getNoteWsPaths();

    assertSignal(abortSignal);

    if (!wsPaths || wsPaths.length === 0) {
      return [];
    }

    const options: FzfOptions = {
      limit: limit,
      selector: (item) => resolvePath(item, true).filePath,
      fuzzy: query.length <= 4 ? 'v1' : 'v2',
      tiebreakers: [byLengthAsc, byStartAsc],
    };

    const fzf = new Fzf(wsPaths, options);

    const result = fzf.find(query);

    return result;
  };
}
