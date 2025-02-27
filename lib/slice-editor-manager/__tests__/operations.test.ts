import { Selection } from '@bangle.dev/pm';

import {
  MAX_OPEN_EDITORS,
  PRIMARY_EDITOR_INDEX,
  SECONDARY_EDITOR_INDEX,
} from '@bangle.io/constants';
import { AppState } from '@bangle.io/create-store';
import { createPMNode } from '@bangle.io/test-utils';
import { getScrollParentElement } from '@bangle.io/utils';

import { editorManagerSliceKey } from '../constants';
import { editorManagerSlice } from '../editor-manager-slice';
import {
  didSomeEditorChange,
  forEachEditor,
  getEditor,
  getEditorState,
  getInitialSelection,
  setEditorReady,
  setEditorUnmounted,
  toggleEditing,
} from '../operations';

const getScrollParentElementMock =
  getScrollParentElement as jest.MockedFunction<typeof getScrollParentElement>;

jest.mock('@bangle.io/utils', () => {
  const actual = jest.requireActual('@bangle.io/utils');

  return {
    ...actual,
    getScrollParentElement: jest.fn(),
  };
});

beforeEach(() => {
  getScrollParentElementMock.mockImplementation(() => undefined);
});

describe('operations: forEachEditor', () => {
  test('works', () => {
    let state = AppState.create({ slices: [editorManagerSlice()] });
    const editorA: any = {};
    const editorB: any = {};

    state = state.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: editorA,
        editorId: PRIMARY_EDITOR_INDEX,
      },
    });
    state = state.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: editorB,
        editorId: SECONDARY_EDITOR_INDEX,
      },
    });

    const mockCb = jest.fn();

    forEachEditor(mockCb)(state);

    expect(mockCb).toBeCalledTimes(MAX_OPEN_EDITORS);
    expect(mockCb).nthCalledWith(1, editorA, 0);
    expect(mockCb).nthCalledWith(2, editorB, 1);
    expect(mockCb).nthCalledWith(3, undefined, 2);
    expect(getEditor(PRIMARY_EDITOR_INDEX)(state)).toBe(editorA);
    expect(getEditor(SECONDARY_EDITOR_INDEX)(state)).toBe(editorB);
    expect(getEditor(4)(state)).toBe(undefined);
  });

  test('works 2', () => {
    let state = AppState.create({ slices: [editorManagerSlice()] });
    const editorA: any = {};

    state = state.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: editorA,
        editorId: PRIMARY_EDITOR_INDEX,
      },
    });

    const mockCb = jest.fn();

    forEachEditor(mockCb)(state);

    expect(mockCb).toBeCalledTimes(MAX_OPEN_EDITORS);

    expect(mockCb).nthCalledWith(1, editorA, 0);
    expect(mockCb).nthCalledWith(2, undefined, 1);
  });
});

describe('operations: getEditorState', () => {
  test('works', () => {
    let state = AppState.create({ slices: [editorManagerSlice()] });
    let value = {};
    const editor: any = { view: { state: value } };
    state = state.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor,
        editorId: SECONDARY_EDITOR_INDEX,
      },
    });

    expect(getEditorState(SECONDARY_EDITOR_INDEX)(state)).toBe(value);
    expect(getEditorState(PRIMARY_EDITOR_INDEX)(state)).toBe(undefined);
  });

  test('incorrect editorId', () => {
    let state = AppState.create({ slices: [editorManagerSlice()] });

    expect(() => getEditorState(-1)(state)).toThrowError(
      'editorId is out of range or invalid',
    );
  });
});

describe('setEditorReady', () => {
  let scrollParent = {};
  beforeEach(() => {
    scrollParent = {};
    getScrollParentElementMock.mockImplementation((): any => scrollParent);
  });
  test('does not work on incorrect editorId', () => {
    let state = AppState.create({ slices: [editorManagerSlice()] });

    let mockEditor: any = {};

    const dispatch = jest.fn();
    expect(() => {
      setEditorReady(-1, 'test:one.md', mockEditor)(state, dispatch);
    }).toThrowError('editorId is out of range or invalid');

    expect(scrollParent).toEqual({});
    expect(dispatch).toHaveBeenCalledTimes(0);
  });

  test('works', () => {
    let state = AppState.create({ slices: [editorManagerSlice()] });

    state = state.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:update-scroll-position',
      value: {
        wsPath: 'test:one.md',
        editorId: PRIMARY_EDITOR_INDEX,
        scrollPosition: 9,
      },
    });

    let mockEditor: any = {};

    const dispatch = jest.fn();

    setEditorReady(
      PRIMARY_EDITOR_INDEX,
      'test:one.md',
      mockEditor,
    )(state, dispatch);
    expect(scrollParent).toEqual({
      scrollTop: 9,
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).nthCalledWith(1, {
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: mockEditor,
        editorId: PRIMARY_EDITOR_INDEX,
      },
    });
  });
});

describe('getInitialSelection', () => {
  test('returns selection at docs end if out of range', () => {
    const pmNodeLong = createPMNode(
      [],
      `# hello world
      really long really long really long really long
      really long really long really long really long
      really long really long really long really long
      `.trim(),
    );
    const pmNodeShort = createPMNode(
      [],
      `# hello world
        `.trim(),
    );

    let state = AppState.create({ slices: [editorManagerSlice()] });

    state = state.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:update-initial-selection-json',
      value: {
        wsPath: 'test:one.md',
        editorId: PRIMARY_EDITOR_INDEX,
        selectionJson: Selection.atEnd(pmNodeLong).toJSON(),
      },
    });

    const selection = getInitialSelection(
      PRIMARY_EDITOR_INDEX,
      'test:one.md',
      pmNodeShort,
    )(state);

    expect(selection?.toJSON()).not.toEqual(
      Selection.atEnd(pmNodeLong).toJSON(),
    );
    expect(selection?.toJSON()).toEqual(Selection.atEnd(pmNodeShort).toJSON());
  });
});

describe('setEditorUnmounted', () => {
  test('works 1', () => {
    let state = AppState.create({ slices: [editorManagerSlice()] });
    const editorA: any = {};

    let stateA = state.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: editorA,
        editorId: PRIMARY_EDITOR_INDEX,
      },
    });

    const dispatch = jest.fn();

    setEditorUnmounted(PRIMARY_EDITOR_INDEX, editorA)(stateA, dispatch);

    expect(dispatch).toBeCalledTimes(1);
    expect(dispatch).nthCalledWith(1, {
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: undefined,
        editorId: PRIMARY_EDITOR_INDEX,
      },
    });
  });

  test('does not unset if editor instance do not match', () => {
    let state = AppState.create({ slices: [editorManagerSlice()] });
    const editorA: any = {};
    const editorB: any = {};

    let stateA = state.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: editorA,
        editorId: PRIMARY_EDITOR_INDEX,
      },
    });

    const dispatch = jest.fn();

    setEditorUnmounted(PRIMARY_EDITOR_INDEX, editorB)(stateA, dispatch);

    expect(dispatch).toBeCalledTimes(0);
  });
});

describe('didSomeEditorChange', () => {
  test('works 1', () => {
    let state = AppState.create({ slices: [editorManagerSlice()] });
    const editorA: any = {};
    const editorB: any = {};

    let stateA = state.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: editorA,
        editorId: PRIMARY_EDITOR_INDEX,
      },
    });
    let stateB = stateA.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: editorB,
        editorId: SECONDARY_EDITOR_INDEX,
      },
    });

    expect(didSomeEditorChange(stateA)(stateB)).toBe(true);
    expect(didSomeEditorChange(stateA)(stateA)).toBe(false);
  });

  test('works 2', () => {
    let state = AppState.create({ slices: [editorManagerSlice()] });
    const editorA: any = {};
    const editorB: any = {};

    let stateA = state.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: editorA,
        editorId: PRIMARY_EDITOR_INDEX,
      },
    });
    let stateB = stateA.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: editorB,
        editorId: PRIMARY_EDITOR_INDEX,
      },
    });

    let stateC = stateB.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: editorA,
        editorId: PRIMARY_EDITOR_INDEX,
      },
    });

    expect(didSomeEditorChange(stateB)(stateC)).toBe(true);
    expect(didSomeEditorChange(stateA)(stateC)).toBe(false);
  });

  test('works 3', () => {
    let state = AppState.create({ slices: [editorManagerSlice()] });

    let stateA = state.applyAction({
      name: 'action::@bangle.io/slice-editor-manager:set-editor',
      value: {
        editor: undefined,
        editorId: PRIMARY_EDITOR_INDEX,
      },
    });

    expect(didSomeEditorChange(state)(stateA)).toBe(false);
    expect(didSomeEditorChange(stateA)(state)).toBe(false);
  });
});

describe('toggleEditing', () => {
  test('toggling editing works', async () => {
    let state = AppState.create({ slices: [editorManagerSlice()] });

    expect(
      editorManagerSliceKey.getSliceStateAsserted(state).editingAllowed,
    ).toBe(false);

    let newState = await new Promise<typeof state>((resolve) => {
      toggleEditing()(state, (action) => {
        resolve(state.applyAction(action));
      });
    });

    expect(
      editorManagerSliceKey.getSliceStateAsserted(newState).editingAllowed,
    ).toBe(true);
  });
});
