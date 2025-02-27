/**
 * @jest-environment @bangle.io/jsdom-env
 */
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import {
  createBasicTestStore,
  setupMockWorkspaceWithNotes,
  TestStoreProvider,
  waitForExpect,
} from '@bangle.io/test-utils';
import type { RecencyRecords } from '@bangle.io/utils';
import { useRecencyMonitor } from '@bangle.io/utils';

import { workspaceSliceKey } from '../common';
import { getOpenedWsPaths, updateOpenedWsPaths } from '../operations';
import { useRecentlyUsedWsPaths } from '../use-recently-used-ws-paths';

jest.mock('@bangle.io/utils', () => {
  const actual = jest.requireActual('@bangle.io/utils');

  return {
    ...actual,
    useRecencyMonitor: jest.fn(),
    safeRequestIdleCallback: jest.fn((cb) => {
      Promise.resolve().then(() => {
        cb();
      });
    }),
  };
});

test('returns wsPaths correctly', async () => {
  let records: RecencyRecords = [{ key: 'test-ws:note1.md', timestamps: [1] }],
    updateRecord = jest.fn();
  (useRecencyMonitor as any).mockImplementation(() => {
    return { records, updateRecord };
  });

  const { store, dispatchSpy } = createBasicTestStore({});
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestStoreProvider bangleStore={store} bangleStoreChanged={0}>
      {children}
    </TestStoreProvider>
  );

  await setupMockWorkspaceWithNotes(store, 'test-ws', [
    ['test-ws:note1.md', 'i am note'],
  ]);

  expect(
    workspaceSliceKey
      .getSliceStateAsserted(store.state)
      .openedWsPaths.toArray(),
  ).toMatchInlineSnapshot(`
    [
      "test-ws:note1.md",
      null,
      null,
      null,
    ]
  `);

  renderHook(() => useRecentlyUsedWsPaths(), { wrapper });

  expect(dispatchSpy).toBeCalledWith({
    id: expect.any(String),
    name: 'action::@bangle.io/slice-workspace:update-recently-used-ws-paths',
    value: {
      recentlyUsedWsPaths: ['test-ws:note1.md'],
      wsName: 'test-ws',
    },
  });
});

test('removes non existent wsPaths', async () => {
  let records: RecencyRecords = [{ key: 'test-ws:note2.md', timestamps: [1] }],
    updateRecord = jest.fn();
  (useRecencyMonitor as any).mockImplementation(() => {
    return { records, updateRecord };
  });

  const { store, dispatchSpy } = createBasicTestStore({});
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestStoreProvider bangleStore={store} bangleStoreChanged={0}>
      {children}
    </TestStoreProvider>
  );

  await setupMockWorkspaceWithNotes(store, 'test-ws', [
    ['test-ws:note1.md', 'i am note'],
  ]);

  renderHook(() => useRecentlyUsedWsPaths(), { wrapper });

  expect(dispatchSpy).toBeCalledWith({
    id: expect.any(String),
    name: 'action::@bangle.io/slice-workspace:update-recently-used-ws-paths',
    value: {
      recentlyUsedWsPaths: [],
      wsName: 'test-ws',
    },
  });
});

test('works when no wsName', async () => {
  let records: RecencyRecords = [],
    updateRecord = jest.fn();
  (useRecencyMonitor as any).mockImplementation(() => {
    return { records, updateRecord };
  });

  const { store, dispatchSpy } = createBasicTestStore({});
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestStoreProvider bangleStore={store} bangleStoreChanged={0}>
      {children}
    </TestStoreProvider>
  );

  renderHook(() => useRecentlyUsedWsPaths(), { wrapper });

  expect(updateRecord).toHaveBeenCalledTimes(0);
  expect(dispatchSpy).toBeCalledTimes(0);
});

test('updates the newly opened ws path only', async () => {
  let records: RecencyRecords = [],
    updateRecord = jest.fn();

  (useRecencyMonitor as any).mockImplementation(() => {
    return { records, updateRecord };
  });

  let bangleStoreChanged = 0;

  const { store } = createBasicTestStore({});
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestStoreProvider
      bangleStore={store}
      bangleStoreChanged={bangleStoreChanged}
    >
      {children}
    </TestStoreProvider>
  );

  const { createTestNote } = await setupMockWorkspaceWithNotes(
    store,
    'test-ws',
    [['test-ws:note1.md', 'i am note']],
  );

  const { rerender } = renderHook(() => useRecentlyUsedWsPaths(), { wrapper });

  expect(updateRecord).lastCalledWith('test-ws:note1.md');

  await createTestNote('test-ws:note2.md', 'second note', false);

  await updateOpenedWsPaths((opened) =>
    opened.updateByIndex(1, 'test-ws:note2.md'),
  )(store.state, store.dispatch);

  await waitForExpect(() => {
    expect(getOpenedWsPaths()(store.state).toArray()).toEqual([
      'test-ws:note1.md',
      'test-ws:note2.md',
      null,
      null,
    ]);
  });

  bangleStoreChanged++;
  rerender();

  expect(updateRecord).lastCalledWith('test-ws:note2.md');
});
