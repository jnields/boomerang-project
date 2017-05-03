import React from 'react';
import { normalize } from 'normalizr';
import {
  SAVE_STUDENT,
  DELETE_STUDENT,
  QUERY_STUDENTS,
  PARSE_STUDENT_FILE,
  SAVE_UPLOADED_STUDENTS,
  CLEAR_UPLOADED_STUDENTS,
  SELECT_STUDENT,
  UPDATE_STUDENT,
} from './types';
import { PENDING, COMPLETE, ERROR } from './xhr-statuses';
import StudentForm from '../containers/student-form';
import getOrCreateGroup from './get-or-create-group';
import { showModal, closeModal } from './modal';
import api from '../helpers/api';
import { user } from '../helpers/schema';
import LoadXlsxWorker from '../workers/load-xlsx';
import {
  student as studentProperties,
  address as addressProperties,
} from '../helpers/properties';

export const getValues = student => (!student ? null : studentProperties.reduce(
  (values, userProp) => ({
    ...values,
    [userProp.name]: student[userProp.name],
  }),
  addressProperties.reduce(
    (values, addressProp) => ({
      ...values,
      [addressProp.name]: (student.address || {})[addressProp.name],
    }),
    {
      id: student.id,
      groupName: (student.group || {}).name,
    },
  ),
));

export const clearUploaded = () => ({ type: CLEAR_UPLOADED_STUDENTS });
export const selectStudent = student => (dispatch) => {
  dispatch({
    type: SELECT_STUDENT,
    student: (student || {}).id,
  });
  dispatch(showModal({
    title: 'Edit Student',
    content: <StudentForm />,
  }));
};

const getUser = values => async dispatch => studentProperties.reduce(
  (acc, prop) => ({
    ...acc,
    [prop.name]: values[prop.name],
  }),
  {
    groupId: await getOrCreateGroup(values.groupName)(dispatch),
    type: 'STUDENT',
    address: addressProperties.reduce(
      (acc, prop) => ({
        ...acc,
        [prop.name]: values[prop.name],
      }),
      {},
    ),
  },
);

let abort;
export const query = params => (dispatch) => {
  if (params == null || params.constructor !== Object) {
    throw new TypeError('must supply arguments');
  }
  if (abort) abort(true);

  const type = QUERY_STUDENTS;

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
      const normalized = normalize(results, [user]);
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

export const requery =
() =>
(dispatch, getState) =>
query(getState().students.query)(dispatch);

export const saveStudent = values => async (dispatch) => {
  const type = SAVE_STUDENT;
  dispatch({ type, status: PENDING });
  const ur = await getUser(values)(dispatch);
  return api.users.post(ur).then(
    (response) => {
      if (response.statusCode < 400) {
        const normalized = normalize(
          response.body,
          user,
        );
        return dispatch({
          type,
          status: COMPLETE,
          response,
          ...normalized,
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

export const updateStudent = values => async (dispatch) => {
  const patch = await getUser(values)(dispatch);
  const type = UPDATE_STUDENT;
  const id = values.id;
  console.log('updating ', id, patch);
  dispatch({ type, status: PENDING, id, patch });
  return api.users.patch(id, patch).then(
    (response) => {
      if (response.statusCode < 400) {
        return dispatch({
          type,
          response,
          status: COMPLETE,
          ...normalize(
            response.body,
            user,
          ),
        });
      }
      return dispatch({ type, status: COMPLETE, response });
    },
    error => dispatch({ type, error, status: ERROR }),
  );
};

export const handleSubmit = values => async (dispatch) => {
  if (values.id) {
    await dispatch(updateStudent(values));
  } else {
    await dispatch(saveStudent(values));
  }
  await dispatch(requery());
  return dispatch(closeModal());
};

export const goToPage = page => (dispatch, getState) => {
  const state = getState();
  const params = state.students.query;
  return query({
    ...params,
    $offset: params.$limit * (page - 1),
  })(dispatch);
};

export const deleteStudent = () => (dispatch, getState) => {
  const type = DELETE_STUDENT;
  const student = getState().students.selectedStudent;
  dispatch({
    type,
    status: PENDING,
  });
  return api.users.delete(student).then(
    (response) => {
      if (response.statusCode < 400) {
        dispatch({
          type,
          status: COMPLETE,
          student,
          entities: { users: { [student]: undefined } }, // delete user from entities
        });
        dispatch(closeModal());
      } else {
        dispatch({ type, response, status: COMPLETE });
      }
      requery(dispatch, getState).then(
        () => dispatch(closeModal()),
      );
    },
    error => dispatch({ type, status: ERROR, error }),
  );
};

const properties = [
  ...studentProperties,
  ...addressProperties,
].map(prop => ({ ...prop, validate: null }));

export const parseFile = e => (dispatch) => {
  const worker = new LoadXlsxWorker();
  const type = PARSE_STUDENT_FILE;
  worker.onmessage = ({ data: { results, error } }) => {
    if (error) {
      dispatch({ type, status: ERROR, error });
    } else {
      dispatch({ type, status: COMPLETE, results });
    }
  };
  dispatch({ type, status: PENDING });
  worker.postMessage({
    files: e.target.files,
    properties,
  });
};

export const saveUploaded = arr => async (dispatch) => {
  const users = await Promise.all(arr.map(values => getUser(values)(dispatch)));
  const type = SAVE_UPLOADED_STUDENTS;
  dispatch({ type, users, status: PENDING });
  return api.users.post(users).then(
    (response) => {
      if (response.statusCode < 400) {
        dispatch({
          type,
          status: COMPLETE,
          ...normalize(
            response.body,
            [user],
          ),
        });
      } else {
        return dispatch({ type, response, status: COMPLETE });
      }
      return dispatch(requery());
    },
    error => dispatch({ type, error, status: ERROR }),
  );
};
