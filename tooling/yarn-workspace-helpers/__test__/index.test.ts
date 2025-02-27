import path from 'path';

import { YarnWorkspaceHelpers } from '../index';

const ROOT_DIR_PATH = path.resolve(__dirname, '..', '..', '..');
const ws = new YarnWorkspaceHelpers({ rootDir: ROOT_DIR_PATH });
test('lists packages', async () => {
  const result = await Promise.all(
    Array.from(ws.packages).map(async ([_, pkg]) => {
      return [pkg.name, await pkg.toJSON()];
    }),
  );

  expect([...result].sort()).toMatchInlineSnapshot(`
    [
      [
        "@bangle.io/abortable-worker",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/abortable-worker",
          "name": "@bangle.io/abortable-worker",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/activitybar",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "app/activitybar",
          "name": "@bangle.io/activitybar",
          "type": "app",
        },
      ],
      [
        "@bangle.io/api",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/api",
          "name": "@bangle.io/api",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/app-entry",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "app/app-entry",
          "name": "@bangle.io/app-entry",
          "type": "app",
        },
      ],
      [
        "@bangle.io/baby-fs",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/baby-fs",
          "name": "@bangle.io/baby-fs",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/bangle-store",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "app/bangle-store",
          "name": "@bangle.io/bangle-store",
          "type": "app",
        },
      ],
      [
        "@bangle.io/bangle-store-context",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/bangle-store-context",
          "name": "@bangle.io/bangle-store-context",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/base-error",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/base-error",
          "name": "@bangle.io/base-error",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/browser-nativefs-storage",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/browser-nativefs-storage",
          "name": "@bangle.io/browser-nativefs-storage",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/browser-privatefs-storage",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/browser-privatefs-storage",
          "name": "@bangle.io/browser-privatefs-storage",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/browser-storage",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/browser-storage",
          "name": "@bangle.io/browser-storage",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/config",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/config",
          "name": "@bangle.io/config",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/constants",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/constants",
          "name": "@bangle.io/constants",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/contextual-ui-components",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/contextual-ui-components",
          "name": "@bangle.io/contextual-ui-components",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/core-editor",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/core-editor",
          "name": "@bangle.io/core-editor",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/core-extension",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/core-extension",
          "name": "@bangle.io/core-extension",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/core-palettes",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/core-palettes",
          "name": "@bangle.io/core-palettes",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/core-theme",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/core-theme",
          "name": "@bangle.io/core-theme",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/create-store",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/create-store",
          "name": "@bangle.io/create-store",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/css-vars",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/css-vars",
          "name": "@bangle.io/css-vars",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/db-app",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/db-app",
          "name": "@bangle.io/db-app",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/db-key-val",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/db-key-val",
          "name": "@bangle.io/db-key-val",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/e2e-types",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/e2e-types",
          "name": "@bangle.io/e2e-types",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/editor",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/editor",
          "name": "@bangle.io/editor",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/editor-common",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/editor-common",
          "name": "@bangle.io/editor-common",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/editor-container",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "app/editor-container",
          "name": "@bangle.io/editor-container",
          "type": "app",
        },
      ],
      [
        "@bangle.io/env-vars",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": true,
          "isWorktree": false,
          "location": "tooling/env-vars",
          "name": "@bangle.io/env-vars",
          "type": "tooling",
        },
      ],
      [
        "@bangle.io/example-extension",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/example-extension",
          "name": "@bangle.io/example-extension",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/extension-registry",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/extension-registry",
          "name": "@bangle.io/extension-registry",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/extract-css-vars",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": true,
          "isWorktree": false,
          "location": "tooling/extract-css-vars",
          "name": "@bangle.io/extract-css-vars",
          "type": "tooling",
        },
      ],
      [
        "@bangle.io/fzf-search",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/fzf-search",
          "name": "@bangle.io/fzf-search",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/git-file-sha",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/git-file-sha",
          "name": "@bangle.io/git-file-sha",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/github-storage",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/github-storage",
          "name": "@bangle.io/github-storage",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/history",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/history",
          "name": "@bangle.io/history",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/image-extension",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/image-extension",
          "name": "@bangle.io/image-extension",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/independent-e2e-tests-server",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": true,
          "isWorktree": false,
          "location": "tooling/independent-e2e-tests-server",
          "name": "@bangle.io/independent-e2e-tests-server",
          "type": "tooling",
        },
      ],
      [
        "@bangle.io/inline-backlink",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/inline-backlink",
          "name": "@bangle.io/inline-backlink",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/inline-command-palette",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/inline-command-palette",
          "name": "@bangle.io/inline-command-palette",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/inline-emoji",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/inline-emoji",
          "name": "@bangle.io/inline-emoji",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/inline-palette",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/inline-palette",
          "name": "@bangle.io/inline-palette",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/is-abort-error",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/is-abort-error",
          "name": "@bangle.io/is-abort-error",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/jsdom-env",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/jsdom-env",
          "name": "@bangle.io/jsdom-env",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/markdown",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/markdown",
          "name": "@bangle.io/markdown",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/mini-js-utils",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/mini-js-utils",
          "name": "@bangle.io/mini-js-utils",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/note-browser",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/note-browser",
          "name": "@bangle.io/note-browser",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/note-outline",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/note-outline",
          "name": "@bangle.io/note-outline",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/note-sidebar",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "app/note-sidebar",
          "name": "@bangle.io/note-sidebar",
          "type": "app",
        },
      ],
      [
        "@bangle.io/note-tags",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/note-tags",
          "name": "@bangle.io/note-tags",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/object-uid",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/object-uid",
          "name": "@bangle.io/object-uid",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/p-map",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/p-map",
          "name": "@bangle.io/p-map",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/playwright-e2e",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": true,
          "isWorktree": false,
          "location": "tooling/playwright-e2e",
          "name": "@bangle.io/playwright-e2e",
          "type": "tooling",
        },
      ],
      [
        "@bangle.io/pm-manual-paste",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/pm-manual-paste",
          "name": "@bangle.io/pm-manual-paste",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/pm-plugins",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/pm-plugins",
          "name": "@bangle.io/pm-plugins",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/remote-file-sync",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/remote-file-sync",
          "name": "@bangle.io/remote-file-sync",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/scripts",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": true,
          "isWorktree": false,
          "location": "tooling/_scripts",
          "name": "@bangle.io/scripts",
          "type": "tooling",
        },
      ],
      [
        "@bangle.io/search-notes",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "extensions/search-notes",
          "name": "@bangle.io/search-notes",
          "type": "extensions",
        },
      ],
      [
        "@bangle.io/search-pm-node",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/search-pm-node",
          "name": "@bangle.io/search-pm-node",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/shared",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "app/shared",
          "name": "@bangle.io/shared",
          "type": "app",
        },
      ],
      [
        "@bangle.io/shared-types",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/shared-types",
          "name": "@bangle.io/shared-types",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/slice-editor-collab-comms",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/slice-editor-collab-comms",
          "name": "@bangle.io/slice-editor-collab-comms",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/slice-editor-manager",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/slice-editor-manager",
          "name": "@bangle.io/slice-editor-manager",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/slice-notification",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/slice-notification",
          "name": "@bangle.io/slice-notification",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/slice-page",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/slice-page",
          "name": "@bangle.io/slice-page",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/slice-storage-provider",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/slice-storage-provider",
          "name": "@bangle.io/slice-storage-provider",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/slice-ui",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/slice-ui",
          "name": "@bangle.io/slice-ui",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/slice-workspace",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/slice-workspace",
          "name": "@bangle.io/slice-workspace",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/slice-workspace-opened-doc-info",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/slice-workspace-opened-doc-info",
          "name": "@bangle.io/slice-workspace-opened-doc-info",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/storage",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/storage",
          "name": "@bangle.io/storage",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/store-sync",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/store-sync",
          "name": "@bangle.io/store-sync",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/storybook",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": true,
          "isWorktree": false,
          "location": "tooling/storybook",
          "name": "@bangle.io/storybook",
          "type": "tooling",
        },
      ],
      [
        "@bangle.io/style",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "app/style",
          "name": "@bangle.io/style",
          "type": "app",
        },
      ],
      [
        "@bangle.io/test-utils",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/test-utils",
          "name": "@bangle.io/test-utils",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/tri-state",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/tri-state",
          "name": "@bangle.io/tri-state",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/ui-components",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/ui-components",
          "name": "@bangle.io/ui-components",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/ui-dhancha",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/ui-dhancha",
          "name": "@bangle.io/ui-dhancha",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/ui-theme",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/ui-theme",
          "name": "@bangle.io/ui-theme",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/uno-preset-bangle",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": true,
          "isWorktree": false,
          "location": "tooling/uno-preset-bangle",
          "name": "@bangle.io/uno-preset-bangle",
          "type": "tooling",
        },
      ],
      [
        "@bangle.io/utils",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/utils",
          "name": "@bangle.io/utils",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/weak-cache",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "js-lib/weak-cache",
          "name": "@bangle.io/weak-cache",
          "type": "js-lib",
        },
      ],
      [
        "@bangle.io/worker-editor",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "worker/worker-editor",
          "name": "@bangle.io/worker-editor",
          "type": "worker",
        },
      ],
      [
        "@bangle.io/worker-naukar",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "worker/worker-naukar",
          "name": "@bangle.io/worker-naukar",
          "type": "worker",
        },
      ],
      [
        "@bangle.io/worker-naukar-proxy",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "app/worker-naukar-proxy",
          "name": "@bangle.io/worker-naukar-proxy",
          "type": "app",
        },
      ],
      [
        "@bangle.io/worker-setup",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "app/worker-setup",
          "name": "@bangle.io/worker-setup",
          "type": "app",
        },
      ],
      [
        "@bangle.io/workspace-info",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/workspace-info",
          "name": "@bangle.io/workspace-info",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/workspace-sidebar",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "app/workspace-sidebar",
          "name": "@bangle.io/workspace-sidebar",
          "type": "app",
        },
      ],
      [
        "@bangle.io/ws-path",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": false,
          "location": "lib/ws-path",
          "name": "@bangle.io/ws-path",
          "type": "lib",
        },
      ],
      [
        "@bangle.io/yarn-workspace-helpers",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": true,
          "isWorktree": false,
          "location": "tooling/yarn-workspace-helpers",
          "name": "@bangle.io/yarn-workspace-helpers",
          "type": "tooling",
        },
      ],
      [
        "app",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": true,
          "location": "app",
          "name": "app",
          "type": "app",
        },
      ],
      [
        "bangle-io",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": true,
          "location": ".",
          "name": "bangle-io",
          "type": ".",
        },
      ],
      [
        "extensions",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": true,
          "location": "extensions",
          "name": "extensions",
          "type": "extensions",
        },
      ],
      [
        "js-lib",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": true,
          "location": "js-lib",
          "name": "js-lib",
          "type": "js-lib",
        },
      ],
      [
        "lib",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": true,
          "location": "lib",
          "name": "lib",
          "type": "lib",
        },
      ],
      [
        "tooling",
        {
          "hasCSSFiles": true,
          "isToolingWorkspace": false,
          "isWorktree": true,
          "location": "tooling",
          "name": "tooling",
          "type": "tooling",
        },
      ],
      [
        "worker",
        {
          "hasCSSFiles": false,
          "isToolingWorkspace": false,
          "isWorktree": true,
          "location": "worker",
          "name": "worker",
          "type": "worker",
        },
      ],
    ]
  `);
});
