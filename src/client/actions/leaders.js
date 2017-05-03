import React from 'react';
import { normalize } from 'normalizr';
import {
  SAVE_LEADER,
  DELETE_LEADER,
  QUERY_LEADERS,
  PARSE_LEADER_FILE,
  SAVE_UPLOADED_LEADERS,
  SELECT_LEADER,
  CLEAR_UPLOADED_LEADERS,
  UPDATE_LEADER,
} from './types';

import { PENDING, COMPLETE, ERROR } from './xhr-statuses';
import api from '../helpers/api';
import { user } from '../helpers/schema';
import LeaderForm from '../containers/leader-form';
import { showModal, closeModal } from './modal';
import LoadXlsxWorker from '../workers/load-xlsx';
import { leader as userProps, address as addressProps } from '../helpers/properties';
import getOrCreateGroup from './get-or-create-group';

export const clearUploaded = () => ({ type: CLEAR_UPLOADED_LEADERS });

export const getValues = leader => (leader == null ? null : userProps.reduce(
  (values, userProp) => ({
    ...values,
    [userProp.name]: leader[userProp.name],
  }),
  addressProps.reduce(
    (values, addressProp) => ({
      ...values,
      [addressProp.name]: (leader.address || {})[addressProp.name],
    }),
    {
      id: leader.id,
      groupName: (leader.group || {}).name,
    },
  ),
));

export const selectLeader = leader => (dispatch) => {
  dispatch({
    type: SELECT_LEADER,
    leader: (leader || {}).id,
  });
  dispatch(showModal({
    title: 'Edit Leader',
    content: <LeaderForm />,
  }));
};

const getUser = values => async dispatch => userProps.reduce(
  (acc, prop) => ({
    ...acc,
    [prop.name]: values[prop.name],
  }),
  {
    groupId: await getOrCreateGroup(values.groupName)(dispatch),
    type: 'LEADER',
    address: addressProps.reduce(
      (acc, prop) => ({
        ...acc,
        [prop.name]: values[prop.name],
      }),
      {},
    ),
  },
);

export const saveLeader = values => async (dispatch) => {
  const type = SAVE_LEADER;
  dispatch({ type, status: PENDING });
  const leader = await getUser(values)(dispatch);
  return api.users.post(leader).then(
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


let abort;
export const query = params => (dispatch) => {
  if (params == null || params.constructor !== Object) {
    throw new TypeError('must supply arguments');
  }
  if (abort) abort(true);

  const type = QUERY_LEADERS;

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

export const goToPage = page => (dispatch, getState) => {
  const state = getState();
  const params = state.leaders.query;
  return query({
    ...params,
    $offset: params.$limit * (page - 1),
  })(dispatch);
};

function requery(dispatch, getState) {
  return dispatch(query(getState().leaders.query));
}

export const deleteLeader = () => (dispatch, getState) => {
  const type = DELETE_LEADER;
  const leader = getState().leaders.selectedLeader;
  dispatch({
    type,
    leader,
    status: PENDING,
  });
  return api.users.delete(leader).then(
    (response) => {
      if (response.statusCode < 400) {
        dispatch({
          type,
          status: COMPLETE,
          leader,
          entities: { users: { [leader]: undefined } }, // delete user from entities
        });
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

export const updateLeader = values => async (dispatch) => {
  const patch = await getUser(values)(dispatch);
  const type = UPDATE_LEADER;
  const id = values.id;
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

export const handleSubmit = values =>
(dispatch, getState) =>
(values.id
  ? updateLeader(values)(dispatch, getState)
  : saveLeader(values)(dispatch, getState)
).then(
  () => requery(dispatch, getState).then(
    () => dispatch(closeModal()),
  ),
);

const properties = [
  ...userProps,
  ...addressProps,
].map(prop => ({ ...prop, validate: null }));

export const parseFile = e => (dispatch) => {
  const worker = new LoadXlsxWorker();
  const type = PARSE_LEADER_FILE;
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
  const type = SAVE_UPLOADED_LEADERS;
  dispatch({ type, users, status: PENDING });
  return api.users.post(users).then(
    (response) => {
      if (response.statusCode < 400) {
        return dispatch({
          type,
          status: COMPLETE,
          ...normalize(
            response.body,
            [user],
          ),
        });
      }
      return dispatch({ type, response, status: COMPLETE });
    },
    error => dispatch({ type, error, status: ERROR }),
  );
};
