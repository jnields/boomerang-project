import { combineReducers } from 'redux';
import { student, leader, teacher, group, school } from '../helpers/properties';

import {
  SAVE,
  QUERY,
  UPDATE,
  DELETE,
  DELETE_ALL,
  UPLOAD,
  PARSE,
  SELECT_ITEM,
  CLEAR_PARSED,
  EXTRA_LIST_ACTION,
} from '../actions/types';

import { PENDING, COMPLETE, ERROR, UNSENT, CANCELLED } from '../actions/xhr-statuses';

const initialState = {
  saving: false,
  saveError: null,
  querying: true,
  queryError: null,
  updating: false,
  updateError: null,
  deleting: false,
  deleteError: null,
  parsing: false,
  parseError: null,
  uploading: false,
  uploadError: null,
  extraActionPending: false,
  extraActionError: null,
  items: [],
  count: 0,
  selectedItem: null,
  parsedItems: [],
};

const connectionError = '';

const subReducer = (name, params = { $offset: 0, $limit: 10 }, fieldsets, extraActionText) =>
(state = { ...initialState, params, fieldsets, extraActionText }, action) => {
  if (action.name !== name) return state;
  switch (action.type) {
    case SAVE:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            saving: true,
            saveError: null,
          };
        case COMPLETE:
          return {
            ...state,
            saving: false,
          };
        case ERROR:
          return {
            ...state,
            saving: false,
            saveError: action.error,
          };
        case UNSENT:
          return {
            ...state,
            saving: false,
            saveError: connectionError,
          };
        default:
          throw new TypeError(`unhandled status: ${action.status}`);
      }
    case QUERY:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            querying: true,
            queryError: null,
            params: action.params,
            items: action.reset ? [] : state.items,
          };
        case COMPLETE:
          return {
            ...state,
            querying: false,
            items: action.result,
            count: action.count,
            params: action.params,
          };
        case ERROR:
          return {
            ...state,
            querying: false,
            queryError: action.error,
            items: [],
            params: action.params,
          };
        case CANCELLED:
          return { ...state, querying: false };
        case UNSENT:
          return {
            ...state,
            querying: false,
            queryError: connectionError,
            items: [],
            params: action.params,
          };
        default:
          throw new TypeError(`unhandled status: ${action.status}`);
      }
    case UPDATE:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            updating: true,
            updateError: null,
          };
        case COMPLETE:
          return {
            ...state,
            updating: false,
          };
        case ERROR:
          return {
            ...state,
            updating: false,
            updateError: action.error,
          };
        case UNSENT:
          return {
            ...state,
            updating: false,
            updateError: connectionError,
          };
        default:
          throw new TypeError(`unhandled status: ${action.status}`);
      }
    case DELETE_ALL:
      switch (action.status) {
        case PENDING:
          return { ...state, deletingAll: true, deleteAllError: null };
        case COMPLETE:
          return { ...state, items: [], deletingAll: false };
        case ERROR:
          return { ...state, deletingAll: false, deleteAllError: action.error };
        case UNSENT:
          return { ...state, deletingAll: false, deleteAllError: 'UNSENT' };
        default:
          throw new TypeError(`unhandled xhr status: ${action.status}`);
      }
    case DELETE:
      switch (action.status) {
        case PENDING:
          return { ...state, deleting: true };
        case COMPLETE: {
          const items = state.items;
          const ix = items.indexOf(action.id);
          if (ix > -1) items.splice(ix, 1);
          return {
            ...state,
            deleting: false,
            items,
          };
        }
        case ERROR:
          return {
            ...state,
            deleting: false,
            deleteError: action.error,
          };
        case UNSENT:
          return {
            ...state,
            deleting: false,
            deleteError: connectionError,
          };
        default:
          throw new TypeError(`unhandled status: ${action.status}`);
      }
    case SELECT_ITEM:
      return {
        ...state,
        selectedItem: action.item,
      };
    case PARSE:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            parsing: true,
            parsedItems: [],
            parseError: null,
          };
        case COMPLETE:
          return {
            ...state,
            parsing: false,
            parsedItems: action.results,
          };
        case ERROR:
          return {
            ...state,
            parsing: false,
            parseError: action.error,
          };
        default:
          throw new TypeError(`unhandled status: ${action.status}`);
      }
    case UPLOAD:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            uploading: true,
            uploadError: null,
          };
        case COMPLETE:
          return {
            ...state,
            uploading: false,
            parsedItems: [],
          };
        case ERROR:
          return {
            ...state,
            uploading: false,
            uploadError: action.error,
          };
        case UNSENT:
          return {
            ...state,
            uploading: false,
            uploadError: connectionError,
          };
        default:
          throw new TypeError(`unhandled type: ${action.status}`);
      }
    case CLEAR_PARSED:
      return {
        ...state,
        parsedItems: [],
        parseError: null,
        uploadError: null,
      };
    case EXTRA_LIST_ACTION:
      switch (action.status) {
        case PENDING:
          return {
            ...state,
            extraActionPending: true,
            extraActionError: null,
          };
        case COMPLETE:
          return {
            ...state,
            extraActionPending: false,
          };
        case ERROR:
        case UNSENT:
          return {
            ...state,
            extraActionPending: false,
            extraActionError: action.error,
          };
        default:
          throw new TypeError(`unhandled status: ${action.status}`);
      }
    default:
      return state;
  }
};
const paged = { $limit: 10, $offset: 0 };
export default combineReducers({
  schools: subReducer(
    'schools',
    paged,
    school,
  ),
  groups: subReducer(
    'groups',
    paged,
    group,
  ),
  teachers: subReducer(
    'teachers',
    { ...paged, type: 'TEACHER' },
    teacher,
    'Send Activation Emails',
  ),
  students: subReducer(
    'students',
    { ...paged, type: 'STUDENT' },
    student,
    'Assign Students to Groups',
  ),
  leaders: subReducer(
    'leaders',
    { ...paged, type: 'LEADER' },
    leader,
  ),
});
