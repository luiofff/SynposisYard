import { UPDATE_EDITOR_STATE } from './actions';

export function updateEditorState(editorState) {
  const rawContent = convertToRaw(editorState.getCurrentContent());
  return {
    type: UPDATE_EDITOR_STATE,
    payload: rawContent
  };
}

// Редуктор
function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_EDITOR_STATE:
      return {
        ...state,
        editorState: action.payload
      };
    default:
      return state;
  }
}

export default reducer;
