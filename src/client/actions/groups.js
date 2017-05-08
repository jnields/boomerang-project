import api from '../helpers/api';
import { group as groupSchema } from '../helpers/schema';
import { group as fieldsets } from '../helpers/properties';

import * as listActions from './list';

const config = {
  name: 'groups',
  schema: groupSchema,
  schemaName: 'groups',
  post: api.groups.post,
  query: api.groups.query,
  patch: api.groups.patch,
  del: api.groups.del,
  fieldsets,
};

export const selectItem = listActions.selectItem.bind(null, config);
export const clearParsed = listActions.clearParsed.bind(null, config);
export const query = listActions.query.bind(null, config);
export const save = listActions.save.bind(null, config);
export const upload = listActions.upload.bind(null, config);
export const update = listActions.update.bind(null, config);
export const del = listActions.del.bind(null, config);
export const parse = listActions.parse.bind(null, config);
export { showModal, closeModal } from './modal';

// import React from 'react';
// import { normalize } from 'normalizr';
// import {
//   GET_ALL_GROUPS,
//   ASSIGN_GROUPS,
//   SAVE_GROUP,
//   SELECT_GROUP,
//   UPDATE_GROUP,
//   DELETE_GROUP,
// } from './types';
// import {
//   PENDING, COMPLETE, ERROR,
// } from './xhr-statuses';
// import api from '../helpers/api';
// import { group as groupSchema } from '../helpers/schema';
// import GroupForm from '../containers/group-form';
// import { showModal, closeModal } from './modal';
// import { group as groupProps } from '../helpers/properties';
//

// export const selectGroup = group => (dispatch) => {
//   dispatch({ type: SELECT_GROUP, group: (group || {}).id });
//   dispatch(showModal({
//     title: 'Edit Group',
//     content: <GroupForm />,
//   }));
// };
//
// export const getValues = group => (!group ? null : (groupProps.reduce(
//   (values, groupProp) => ({
//     ...values,
//     [groupProp.name]: group[groupProp.name],
//   }),
//   { id: group.id },
// )));
//
// export const getAllGroups = () => (dispatch) => {
//   const type = GET_ALL_GROUPS;
//   dispatch({ type, status: PENDING });
//   api.groups.query({ $limit: 100000 }).then(
//     (response) => {
//       const { statusCode, body: { count = 0, results = [] } } = response;
//       if (statusCode < 400) {
//         return dispatch({
//           type,
//           status: COMPLETE,
//           response,
//           count,
//           ...normalize(results, [groupSchema]),
//         });
//       }
//       return dispatch({ type, status: COMPLETE, response });
//     },
//     error => dispatch({ type, error, status: ERROR }),
//   );
// };
//
// export const assignGroups = () => (dispatch) => {
//   const type = ASSIGN_GROUPS;
//   dispatch({ type, status: PENDING });
// };
//
// function getGroup(values) {
//   return { ...values };
// }
//
// const saveGroup = values => (dispatch) => {
//   const type = SAVE_GROUP;
//   dispatch({ type, status: PENDING });
//   return api.groups.post(getGroup(values)).then(
//     (response) => {
//       if (response.statusCode < 400) {
//         return dispatch({
//           type,
//           status: COMPLETE,
//           ...normalize(
//             response.body,
//             groupSchema,
//           ),
//         });
//       }
//       return dispatch({ type, status: COMPLETE, response });
//     },
//     error => dispatch({ type, error, status: ERROR }),
//   );
// };
//
// export const updateGroup = values => (dispatch) => {
//   const type = UPDATE_GROUP;
//
//   const patch = { ...values };
//   delete patch.id;
//   const id = values.id;
//
//   dispatch({ type, status: PENDING, id, patch });
//
//   return api.groups.patch(id, patch).then(
//     (response) => {
//       if (response.statusCode < 400) {
//         return dispatch({
//           type,
//           response,
//           status: COMPLETE,
//           ...normalize(
//             response.body,
//             groupSchema,
//           ),
//         });
//       }
//       return dispatch({ type, status: COMPLETE, response });
//     },
//     error => dispatch({ type, error, status: ERROR }),
//   );
// };
//
// export const handleSubmit =
// values =>
// (dispatch, getState) =>
// (values.id
//     ? updateGroup(values)(dispatch, getState)
//     : saveGroup(values)(dispatch, getState)
// ).then(() => dispatch(closeModal()));
//
// export const deleteGroup = () => (dispatch, getState) => {
//   const type = DELETE_GROUP;
//   const group = getState().groups.selectedGroup;
//   dispatch({
//     type,
//     group,
//     status: PENDING,
//   });
//   return api.groups.delete(group).then(
//     (response) => {
//       if (response.statusCode < 400) {
//         dispatch({
//           type,
//           status: COMPLETE,
//           group,
//           entities: { users: { [group]: undefined } }, // delete user from entities
//         });
//         dispatch(closeModal());
//       } else {
//         dispatch({ type, response, status: COMPLETE });
//       }
//       dispatch(closeModal());
//     },
//     error => dispatch({ type, status: ERROR, error }),
//   );
// };
