import { createRef, useCallback, useEffect, useState } from 'react';
import { keybindingsHelper } from './keybinding-helper';

/**
 * Catches unhandled sync and async error
 */
export function useCatchError(callback) {
  useEffect(() => {
    const errorHandler = async (errorEvent) => {
      let error = errorEvent.error;
      if (errorEvent.promise) {
        try {
          await errorEvent.promise;
        } catch (promiseError) {
          error = promiseError;
        }
      }

      if (!error) {
        return;
      }

      callback(error);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, [callback]);
}

export function useWatchClickOutside(onClickOutside, onClickInside) {
  const ref = createRef();
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current) {
        return;
      }
      if (ref.current.contains(e.target)) {
        onClickInside();
        return;
      }
      onClickOutside();
      return;
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [ref, onClickOutside, onClickInside]);

  return ref;
}

/**
 * Example usage:
 *
 * useKeybindings(() => {
 *   return {
 *     'Mod-P': () => { return true }, // true if you want to handle the event equivalent to preventDefault
 *     'Ctrl-A': () => {...}
 *   }
 * })
 *
 * @param {Function} cb
 * @param {Array} deps
 */
export function useKeybindings(cb, deps) {
  // Using a callback to get a memoized version of bindings
  // which is only invalidated if deps change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoCb = useCallback(cb, deps);
  useEffect(() => {
    const keyHandler = keybindingsHelper(memoCb());
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('keydown', keyHandler);
    };
  }, [memoCb]);
}
