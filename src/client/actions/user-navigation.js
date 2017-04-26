import { normalize } from 'normalizr';
import { user } from '../helpers/schema';
import api from '../helpers/api';
import {
  SELECT_TAB,
  QUERY,
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

let abort;
export const query = ({ page = 1, size = 10, params }) => (dispatch) => {
  if (abort) abort(true);

  dispatch({
    type: QUERY,
    status: PENDING,
    params,
  });

  const translated = {
    ...params,
    $limit: size,
    $offset: ((page - 1) * size) || 0,
  };

  api.users.query(
    translated,
    new Promise((resolve) => {
      abort = resolve;
    }),
  ).then(
    (response) => {
      abort = null;
      const { results = [], count = 0 } = (response.body || {});
      if (response.statusCode < 400) {
        if (count > 0 && results.length === 0) {
          const newPage = Math.ceil(results.length / size);
          return query({
            page: newPage,
            size,
            params,
          })(dispatch);
        }
      }
      const normalized = normalize(results, user);
      return dispatch({
        type: QUERY,
        status: COMPLETE,
        response,
        ...normalized,
      });
    },
    (error) => {
      abort = null;
      dispatch({
        type: QUERY,
        status: ERROR,
        error,
      });
    },
  );
};
