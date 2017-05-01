import { normalize } from 'normalizr';
import { initialize } from 'redux-form';
import { user } from '../helpers/schema';
import api from '../helpers/api';

import {
  SELECT_TAB,
  SELECT_ITEM,
  QUERY_USERS,
} from './types';

import {
  PENDING,
  COMPLETE,
  ERROR,
} from './xhr-statuses';

export const selectTab = tab => ({
  type: SELECT_TAB,
  tab,
});

export const selectItem = ({ item, form }) => (dispatch) => {
  dispatch(initialize(form, item));
  dispatch({ type: SELECT_ITEM, item });
};

let abort;
export const query = params => (dispatch) => {
  if (params == null || params.constructor !== Object) {
    throw new TypeError('must supply arguments');
  }
  if (abort) abort(true);

  dispatch({
    type: QUERY_USERS,
    status: PENDING,
    query: params,
  });
  api.users.query(
    params,
    new Promise((resolve) => {
      abort = resolve;
    }),
  ).then(
    (response) => {
      abort = null;
      const { results = [], count = 0 } = (response.body || {});
      if (response.statusCode < 400) {
        if (count > 0 && results.length === 0) {
          const $offset = count - (count % params.$limit);
          return query({
            ...params,
            $offset,
          })(dispatch);
        }
      }
      const normalized = normalize(results, [user]);
      return dispatch({
        type: QUERY_USERS,
        status: COMPLETE,
        response,
        ...normalized,
      });
    },
    (error) => {
      abort = null;
      dispatch({
        type: QUERY_USERS,
        status: ERROR,
        error,
      });
    },
  );
};

export const goToPage = page => (dispatch, getState) => {
  const state = getState();
  const tab = state.tabs.meta[state.tabs.selected];
  return query({
    ...tab.query,
    $offset: tab.query.$limit * (page - 1),
  })(dispatch);
};
