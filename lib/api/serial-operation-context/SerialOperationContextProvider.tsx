import React, { createContext, useCallback, useMemo, useState } from 'react';

import { useBangleStoreContext } from '@bangle.io/bangle-store-context';
import { useExtensionRegistryContext } from '@bangle.io/extension-registry';
import type { DispatchSerialOperationType } from '@bangle.io/shared-types';
import { uiSliceKey } from '@bangle.io/slice-ui';
import { useKeybindings } from '@bangle.io/utils';

const LOG = true;
let log = LOG ? console.debug.bind(console, 'SerialOperationCotext') : () => {};

export const SerialOperationContext = createContext<SerialOperationContextType>(
  {
    dispatchSerialOperation: () => {},
  },
);

export interface SerialOperationContextType {
  dispatchSerialOperation: DispatchSerialOperationType;
}

export function SerialOperationContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const bangleStore = useBangleStoreContext();
  const extensionRegistry = useExtensionRegistryContext();

  const operationNameSet = useMemo(() => {
    return new Set(
      extensionRegistry.getRegisteredOperations().map((r) => r.name),
    );
  }, [extensionRegistry]);

  const [operationHandlers] = useState(() => {
    return extensionRegistry.getOperationHandlers().map((r) => r());
  });

  const dispatchSerialOperation = useCallback<
    SerialOperationContextType['dispatchSerialOperation']
  >(
    (operation) => {
      const { name, value, ...others } = operation;
      log(name, value);

      (window as any).Sentry?.addBreadcrumb?.({
        type: 'operation',
        message: name,
        timestamp: Date.now(),
      });

      if (!name) {
        throw new Error('Operation must have a name');
      }

      if (!operationNameSet.has(name)) {
        throw new Error('Unknown operation ' + name);
      }
      if (Object.keys(others).length > 0) {
        throw new Error(
          'Unknown keys in operation : ' + Object.keys(others).join(','),
        );
      }

      for (const handler of operationHandlers) {
        let result = handler.handle({ name, value }, value, bangleStore);

        if (result) {
          return;
        }
      }

      // Converting to array so that we have a fixed operation handlers for the current operation
      // because there are cases which add or remove handler (react hooks) resulting in double execution
      for (const handler of Array.from(
        extensionRegistry.getSerialOperationHandlers(),
      )) {
        handler(operation);
      }
    },
    [extensionRegistry, operationNameSet, operationHandlers, bangleStore],
  );

  const value = useMemo(() => {
    const val: SerialOperationContextType = {
      dispatchSerialOperation,
    };

    return val;
  }, [dispatchSerialOperation]);

  useKeybindings(() => {
    const operations = extensionRegistry.getRegisteredOperations();
    const keys = Object.fromEntries(
      operations
        .filter((r) => r.keybinding)
        .map((r) => [
          r.keybinding,
          () => {
            const { dialogName } = uiSliceKey.getSliceStateAsserted(
              bangleStore.state,
            );

            // DONOT listen for keys if we are in a dialog
            if (!dialogName) {
              dispatchSerialOperation({
                name: r.name,
              });
            } else {
              console.debug('Ignoring keybinding', r.name, r.keybinding);
            }

            return true;
          },
        ]),
    );

    return keys;
  }, [extensionRegistry, bangleStore, dispatchSerialOperation]);

  return (
    <SerialOperationContext.Provider value={value}>
      {children}
    </SerialOperationContext.Provider>
  );
}
