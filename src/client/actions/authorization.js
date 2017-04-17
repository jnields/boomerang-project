import { normalize } from 'normalizr';
import {
  LOG_IN,
  LOG_OUT,
} from './types';
import {
  COMPLETE,
  PENDING,
  ERROR,
} from './xhr-statuses';

import * as schemas from '../helpers/schema';
import api from '../helpers/api';

export const logOut = () => (dispatch) => {
  dispatch({ type: LOG_OUT });
  api.auth.logOut();
};

export const logIn = (username, password) => (dispatch) => {
  dispatch({
    type: LOG_IN,
    status: PENDING,
    username,
    password,
  });
  api.auth.logIn(username, password).then(
    (response) => {
      if (response.statusCode >= 400) {
        return dispatch({ type: LOG_IN, status: COMPLETE, response });
      }
      return dispatch({
        ...normalize(response.body, schemas.user),
        type: LOG_IN,
        status: COMPLETE,
        response,
      });
    },
    error => dispatch({ type: LOG_IN, error, status: ERROR }),
  );
};
