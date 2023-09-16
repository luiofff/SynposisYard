export const UPDATE_EDITOR_STATE = 'UPDATE_EDITOR_STATE';

export function updateEditorState(editorState) {
  return {
    type: UPDATE_EDITOR_STATE,
    payload: editorState
  };
}
