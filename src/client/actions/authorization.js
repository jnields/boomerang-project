import { normalize } from 'normalizr';
import {
  LOG_IN,
  LOG_OUT,
  REQUEST_RESET,
  RESET_PASSWORD,
  RESET_AUTH,
} from './types';
import {
  COMPLETE,
  PENDING,
  ERROR,
  UNSENT,
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
  return api.auth.logIn(username, password).then(
    (response) => {
      if (response.statusCode < 400) {
        return dispatch({
          type: LOG_IN,
          status: COMPLETE,
          response,
          ...normalize(response.body, schemas.user),
        });
      }
      return dispatch({
        type: LOG_IN,
        status: ERROR,
        response,
      });
    },
    error => dispatch({ type: LOG_IN, error, status: UNSENT }),
  );
};

export const requestReset = username => async (dispatch) => {
  const type = REQUEST_RESET;
  dispatch({ type, status: PENDING, username });
  try {
    const { statusCode, body } = await api.auth.requestReset(username);
    if (statusCode < 400) {
      return dispatch({ type, status: COMPLETE });
    }
    return dispatch({ type, status: ERROR, statusCode, body });
  } catch (error) {
    return dispatch({ type, status: UNSENT, error });
  }
};

export const resetAuth = () => ({ type: RESET_AUTH });

export const resetPassword = ({ password, resetId }) => async (dispatch) => {
  const type = RESET_PASSWORD;
  dispatch({ type, status: PENDING });
  try {
    const response = await api.auth.reset({ password, resetId });
    if (response.statusCode < 400) {
      return dispatch({
        type,
        status: COMPLETE,
        response,
        ...normalize(response.body, schemas.user),
      });
    }
    return dispatch({
      type,
      status: ERROR,
      response,
      ...normalize(response.body, schemas.user),
    });
  } catch (error) {
    return dispatch({ type, status: UNSENT, error });
  }
};
