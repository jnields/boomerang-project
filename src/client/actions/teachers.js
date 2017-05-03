import { normalize } from 'normalizr';
import { user as userSchema } from '../helpers/schema';
import { closeModal } from './modal';
import api from '../helpers/api';

import {
  SELECT_TEACHER,
  QUERY_TEACHERS,
  SAVE_TEACHER,
  DELETE_TEACHER,
  VALIDATE_EMAIL,
} from './types';

import {
  PENDING,
  COMPLETE,
  ERROR,
} from './xhr-statuses';

let abort;
export const query = params => (dispatch) => {
  if (params == null || params.constructor !== Object) {
    throw new TypeError('must supply arguments');
  }
  if (abort) abort(true);

  const type = QUERY_TEACHERS;

  dispatch({ type, status: PENDING, query: params });

  return api.users.query(
    params,
    new Promise((resolve) => {
      abort = resolve;
    }),
  ).then(
    (response) => {
      if (response === undefined) return undefined;
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
      const normalized = normalize(results, [userSchema]);
      return dispatch({
        type,
        status: COMPLETE,
        response,
        count,
        ...normalized,
      });
    },
    (error) => {
      abort = null;
      dispatch({
        type,
        status: ERROR,
        error,
      });
    },
  );
};

export const goToPage = page => (dispatch, getState) => {
  const state = getState();
  const params = state.teachers.query;
  return query({
    ...params,
    $offset: params.$limit * (page - 1),
  })(dispatch);
};

export const requery =
() =>
(dispatch, getState) =>
query(getState().teachers.query)(dispatch);

export const selectTeacher = teacher => (dispatch) => {
  const type = SELECT_TEACHER;
  dispatch({ type, teacher });
};

export const deleteTeacher = teacher => (dispatch) => {
  const type = DELETE_TEACHER;
  dispatch({ type, teacher });
  return api.users.delete(teacher.id).then(
    (response) => {
      if (response.statusCode < 400) {
        return dispatch({
          type,
          status: COMPLETE,
          entities: {
            users: { [teacher.id]: undefined },
          },
        });
      }
      return dispatch({
        type,
        status: COMPLETE,
        response,
      });
    },
    error => dispatch({ type, status: ERROR, error }),
  );
};

function getTeacher(values, school) {
  return {
    ...values,
    schoolId: school,
    type: 'TEACHER',
  };
}

export const validateEmail = status => ({ type: VALIDATE_EMAIL, status });

export const saveTeacher = values => (dispatch, getState) => {
  const school = getState().schools.selectedSchool;
  const type = SAVE_TEACHER;
  dispatch({ type, status: PENDING, values });
  return api.users.post(getTeacher(values, school)).then(
    (response) => {
      if (response.statusCode < 400) {
        dispatch({
          type,
          status: COMPLETE,
          response,
          ...normalize(
            response.body,
            userSchema,
          ),
        });
        return api.auth.patch(response.body.id, { password: values.password });
      }
      return dispatch({ type, response, status: COMPLETE });
    },
    error => dispatch({ type, status: ERROR, error }),
  );
};

export const handleSubmit = values => (dispatch, getState) => {
  saveTeacher(values)(dispatch, getState).then(
    () => requery()(dispatch, getState)
      .then(() => dispatch(closeModal())),
  );
};
