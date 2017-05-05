import api from '../helpers/api';
import { user as userSchema } from '../helpers/schema';
import { leader as fieldsets } from '../helpers/properties';

import * as listActions from './list';

const config = {
  name: 'leaders',
  schema: userSchema,
  schemaName: 'users',
  post: api.users.post,
  query: api.users.query,
  put: api.users.put,
  del: api.users.del,
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

// export const clearParsed = () => ({ type: CLEAR_UPLOADED_LEADERS });
//
// export const getValues = leader => (leader == null ? null : userProps.reduce(
//   (values, userProp) => ({
//     ...values,
//     [userProp.name]: leader[userProp.name],
//   }),
//   addressProps.reduce(
//     (values, addressProp) => ({
//       ...values,
//       [addressProp.name]: (leader.address || {})[addressProp.name],
//     }),
//     {
//       id: leader.id,
//       groupName: (leader.group || {}).name,
//     },
//   ),
// ));
//
// export const selectLeader = leader => (dispatch) => {
//   dispatch({
//     type: SELECT_LEADER,
//     leader: (leader || {}).id,
//   });
//   dispatch(showModal({
//     title: 'Edit Leader',
//     content: <LeaderForm />,
//   }));
// };
//
// const getUser = (values, oldGroup) => async dispatch => userProps.reduce(
//   (acc, prop) => ({
//     ...acc,
//     [prop.name]: values[prop.name],
//   }),
//   {
//     groupId: await getOrCreateGroup(
//       values.groupName,
//       oldGroup,
//       values.id,
//     )(dispatch),
//     type: 'LEADER',
//     address: addressProps.reduce(
//       (acc, prop) => ({
//         ...acc,
//         [prop.name]: values[prop.name],
//       }),
//       {},
//     ),
//   },
// );
//
// export const saveLeader = values => async (dispatch) => {
//   const type = SAVE_LEADER;
//   dispatch({ type, status: PENDING });
//   const leader = await getUser(values)(dispatch);
//   return api.users.post(leader).then(
//     (response) => {
//       if (response.statusCode < 400) {
//         const normalized = normalize(
//           response.body,
//           user,
//         );
//         return dispatch({
//           type,
//           status: COMPLETE,
//           response,
//           ...normalized,
//         });
//       }
//       return dispatch({
//         type,
//         status: COMPLETE,
//         response,
//       });
//     },
//     error => dispatch({ type, status: ERROR, error }),
//   );
// };
//
//
// let abort;
// export const query = params => (dispatch) => {
//   if (params == null || params.constructor !== Object) {
//     throw new TypeError('must supply arguments');
//   }
//   if (abort) abort(true);
//
//   const type = QUERY_LEADERS;
//
//   dispatch({ type, status: PENDING, query: params });
//
//   return api.users.query(
//     params,
//     new Promise((resolve) => {
//       abort = resolve;
//     }),
//   ).then(
//     (response) => {
//       if (response === undefined) return undefined;
//       abort = null;
//       const { results = [], count = 0 } = (response.body || {});
//       if (response.statusCode < 400) {
//         if (count > 0 && results.length === 0) {
//           const $offset = count - (count % params.$limit);
//           return query({
//             ...params,
//             $offset,
//           })(dispatch);
//         }
//       }
//       const normalized = normalize(results, [user]);
//       return dispatch({
//         type,
//         status: COMPLETE,
//         response,
//         count,
//         ...normalized,
//       });
//     },
//     (error) => {
//       abort = null;
//       dispatch({
//         type,
//         status: ERROR,
//         error,
//       });
//     },
//   );
// };
//
// export const goToPage = page => (dispatch, getState) => {
//   const state = getState();
//   const params = state.leaders.query;
//   return query({
//     ...params,
//     $offset: params.$limit * (page - 1),
//   })(dispatch);
// };
//
// function requery(dispatch, getState) {
//   return dispatch(query(getState().leaders.query));
// }
//
// export const deleteLeader = () => (dispatch, getState) => {
//   const type = DELETE_LEADER;
//   const leader = getState().leaders.selectedLeader;
//   dispatch({
//     type,
//     leader,
//     status: PENDING,
//   });
//   return api.users.delete(leader).then(
//     (response) => {
//       if (response.statusCode < 400) {
//         dispatch({
//           type,
//           status: COMPLETE,
//           leader,
//           entities: { users: { [leader]: undefined } }, // delete user from entities
//         });
//       } else {
//         dispatch({ type, response, status: COMPLETE });
//       }
//       requery(dispatch, getState).then(
//         () => dispatch(closeModal()),
//       );
//     },
//     error => dispatch({ type, status: ERROR, error }),
//   );
// };
//
// export const updateLeader = values => async (dispatch, getState) => {
//   const oldGroup = denormalize(
//     values.id,
//     user,
//     getState().entities,
//   ).group;
//   const patch = await getUser(values, oldGroup)(dispatch);
//   const type = UPDATE_LEADER;
//   const id = values.id;
//   dispatch({ type, status: PENDING, id, patch });
//   return api.users.patch(id, patch).then(
//     (response) => {
//       if (response.statusCode < 400) {
//         return dispatch({
//           type,
//           response,
//           status: COMPLETE,
//           ...normalize(
//             response.body,
//             user,
//           ),
//         });
//       }
//       return dispatch({ type, status: COMPLETE, response });
//     },
//     error => dispatch({ type, error, status: ERROR }),
//   );
// };
//
// export const handleSubmit = values =>
// async (dispatch, getState) => {
//   if (values.id) {
//     await updateLeader(values)(dispatch, getState);
//   } else {
//     await saveLeader(values)(dispatch, getState);
//     await requery(dispatch, getState);
//   }
//   dispatch(closeModal());
// };
//
// const properties = [
//   ...userProps,
//   ...addressProps,
// ].map(prop => ({ ...prop, validate: null }));
//
// export const parseFile = e => (dispatch) => {
//   const worker = new LoadXlsxWorker();
//   const type = PARSE_LEADER_FILE;
//   worker.onmessage = ({ data: { results, error } }) => {
//     if (error) {
//       dispatch({ type, status: ERROR, error });
//     } else {
//       dispatch({ type, status: COMPLETE, results });
//     }
//   };
//   dispatch({ type, status: PENDING });
//   worker.postMessage({
//     files: e.target.files,
//     properties,
//   });
// };
//
// export const saveUploaded = arr => async (dispatch) => {
//   const users = await Promise.all(arr.map(values => getUser(values)(dispatch)));
//   const type = SAVE_UPLOADED_LEADERS;
//   dispatch({ type, users, status: PENDING });
//   return api.users.post(users).then(
//     (response) => {
//       if (response.statusCode < 400) {
//         return dispatch({
//           type,
//           status: COMPLETE,
//           ...normalize(
//             response.body,
//             [user],
//           ),
//         });
//       }
//       return dispatch({ type, response, status: COMPLETE });
//     },
//     error => dispatch({ type, error, status: ERROR }),
//   );
// };
