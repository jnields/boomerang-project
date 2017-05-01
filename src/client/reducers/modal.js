import { SHOW_MODAL, HIDE_MODAL } from '../actions/types';

const initialState = { shown: false };

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        shown: true,
        title: action.title,
        content: action.content,
      };
    case HIDE_MODAL:
      return {
        ...state,
        shown: false,
      };
    default: return state;
  }
}
