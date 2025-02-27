import { Node } from '@bangle.dev/pm';

import type { ExtensionRegistry } from '@bangle.io/extension-registry';
import { removeExtension, resolvePath } from '@bangle.io/ws-path';

export function defaultDoc(
  wsPath: string,
  extensionRegistry: ExtensionRegistry,
) {
  return Node.fromJSON(extensionRegistry.specRegistry.schema, {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: {
          level: 1,
        },
        content: [
          {
            type: 'text',
            text: removeExtension(resolvePath(wsPath).fileName),
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello world!',
          },
        ],
      },
    ],
  });
}
