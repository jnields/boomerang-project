import { normalize } from 'normalizr';
import { SAVE_USER, DELETE_USER } from './types';
import { PENDING, COMPLETE, ERROR } from './xhr-statuses';
import api from '../helpers/api';
import { user } from '../helpers/schema';

function getUser(values) {
  return {
    ...values,
    type: 'STUDENT',
  };
}

export const saveStudent = values => (dispatch) => {
  dispatch({ type: SAVE_USER, status: PENDING });
  return api.users.post(getUser(values)).then(
    (response) => {
      if (response.statusCode < 400) {
        const normalized = normalize(
          response.body,
          user,
        );
        return dispatch({
          type: SAVE_USER,
          status: COMPLETE,
          response,
          ...normalized,
        });
      }
      return dispatch({
        type: SAVE_USER,
        status: COMPLETE,
        response,
      });
    },
    error => dispatch({ type: SAVE_USER, status: ERROR, error }),
  );
};

export const deleteStudent = student => (dispatch) => {
  dispatch({
    type: DELETE_USER,
    user: student,
    status: PENDING,
  });
  return api.users.delete(student.id).then(
    (response) => {
      if (response.statusCode < 400) {
        return dispatch({
          type: DELETE_USER,
          status: COMPLETE,
          entities: { users: { [student.id]: undefined } }, // delete user from entities
        });
      }
      return dispatch({ type: DELETE_USER, response, status: COMPLETE });
    },
    error => dispatch({ type: DELETE_USER, status: ERROR, error }),
  );
};
