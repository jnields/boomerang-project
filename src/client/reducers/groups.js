import {
  GET_ALL_GROUPS,
  ASSIGN_GROUPS,
  SAVE_GROUP,
  DELETE_GROUP,
  CLOSE_MODAL,
  SELECT_GROUP,
} from '../actions/types';
import {
  PENDING,
  COMPLETE,
  ERROR,
} from '../actions/xhr-statuses';

const initialState = {
  groups: [],
  gettingGroups: false,
  assigningGroups: false,
  selectedGroup: null,
  deleting: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CLOSE_MODAL:
      return { ...state, selectedGroup: null };
    case SELECT_GROUP:
      return { ...state, selectedGroup: action.group };
    case GET_ALL_GROUPS:
      switch (action.status) {
        case PENDING:
          return { ...state, gettingGroups: true };
        case COMPLETE:
          return { ...state, gettingGroups: false, groups: action.result };
        case ERROR:
          return { ...state, gettingGroups: false };
        default:
          throw new TypeError(`unhandled case in switch: ${action.status}`);
      }
    case DELETE_GROUP:
      switch (action.status) {
        case PENDING:
          return { ...state, deleting: true };
        case COMPLETE: {
          const groups = state.groups;
          const ix = groups.indexOf(action.group);
          if (ix !== -1) {
            groups.splice(ix, 1);
          }
          return { ...state, groups, deleting: false };
        }
        case ERROR:
          return { ...state, deleting: false };
        default: throw new TypeError(`unhandled case: ${action.status}`);
      }
    case ASSIGN_GROUPS:
      switch (action.status) {
        case PENDING:
          return { ...state, assigningGroups: true };
        case COMPLETE:
        case ERROR:
          return { ...state, assigningGroups: false };
        default: throw new TypeError(`unhandled case: ${action.status}`);
      }
    case SAVE_GROUP:
      switch (action.status) {
        case PENDING:
          return state;
        case COMPLETE:
          return {
            ...state,
            groups: [...state.groups, action.result],
          };
        case ERROR:
          return state;
        default: throw new TypeError(`unhandled case: ${action.status}`);
      }
    default: return state;
  }
}
