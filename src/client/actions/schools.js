import api from '../helpers/api';
import { school as schoolSchema } from '../helpers/schema';
import { school as properties } from '../helpers/properties';

import * as listActions from './list';

const config = {
  name: 'schools',
  schema: schoolSchema,
  schemaName: 'schools',
  post: api.schools.post,
  query: api.schools.query,
  put: api.schools.put,
  del: api.schools.del,
  properties,
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


// import { normalize } from 'normalizr';
// import { school as schoolSchema } from '../helpers/schema';
// import { closeModal } from './modal';
// import api from '../helpers/api';
// import { query as teacherQuery } from './teachers';
//
// import {
//   SELECT_SCHOOL,
//   QUERY_SCHOOLS,
//   SAVE_SCHOOL,
//   DELETE_SCHOOL,
// } from './types';
//
// import {
//   PENDING,
//   COMPLETE,
//   ERROR,
// } from './xhr-statuses';
//
// // export const selectItem = ({ item, form }) => (dispatch) => {
// //   dispatch(initialize(form, item));
// //   dispatch({ type: SELECT_ITEM, item });
// // };
//
// let abort;
// export const query = params => (dispatch) => {
//   if (params == null || params.constructor !== Object) {
//     throw new TypeError('must supply arguments');
//   }
//   if (abort) abort(true);
//
//   dispatch({
//     type: QUERY_SCHOOLS,
//     status: PENDING,
//     query: params,
//   });
//   return api.schools.query(
//     params,
//     new Promise((resolve) => {
//       abort = resolve;
//     }),
//   ).then(
//     (response) => {
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
//       const normalized = normalize(results, [schoolSchema]);
//       return dispatch({
//         type: QUERY_SCHOOLS,
//         status: COMPLETE,
//         response,
//         ...normalized,
//       });
//     },
//     (error) => {
//       abort = null;
//       dispatch({
//         type: QUERY_SCHOOLS,
//         status: ERROR,
//         error,
//       });
//     },
//   );
// };
//
// export const goToPage = page => (dispatch, getState) => {
//   const state = getState();
//   const params = state.schools.query;
//   return query({
//     ...params,
//     $offset: params.$limit * (page - 1),
//   })(dispatch);
// };
//
// function getSchool(values) {
//   return {
//     name: values.name,
//     address: {
//       ...values,
//       name: undefined,
//     },
//   };
// }
//
// export const deleteSchool = school => (dispatch) => {
//   dispatch({
//     type: DELETE_SCHOOL,
//     school,
//     status: PENDING,
//   });
//   return api.schools.delete(school.id).then(
//     (response) => {
//       if (response.statusCode < 400) {
//         return dispatch({
//           type: DELETE_SCHOOL,
//           status: COMPLETE,
//           entities: { schools: { [school.id]: undefined } },
//         });
//       }
//       return dispatch({ type: DELETE_SCHOOL, response, status: COMPLETE });
//     },
//     error => dispatch({ type: DELETE_SCHOOL, status: ERROR, error }),
//   );
// };
//
// export const requery =
// () =>
// (dispatch, getState) =>
// query(getState().schools.query)(dispatch);
//
// export const saveSchool = values => (dispatch) => {
//   dispatch({ type: SAVE_SCHOOL, status: PENDING });
//   return api.schools.post(getSchool(values)).then(
//     (response) => {
//       if (response.statusCode < 400) {
//         const normalized = normalize(
//           response.body,
//           schoolSchema,
//         );
//         return dispatch({
//           type: SAVE_SCHOOL,
//           status: COMPLETE,
//           response,
//           ...normalized,
//         });
//       }
//       return dispatch({
//         type: SAVE_SCHOOL,
//         status: COMPLETE,
//         response,
//       });
//     },
//     error => dispatch({ type: SAVE_SCHOOL, status: ERROR, error }),
//   );
// };
//
//
// export const onSubmit =
// values =>
// (dispatch, getState) =>
// saveSchool(values)(dispatch, getState).then(
//   () => requery()(dispatch, getState).then(() => dispatch(closeModal())),
// );
//
// export const selectSchool = school => (dispatch, getState) => {
//   dispatch({
//     type: SELECT_SCHOOL,
//     ...normalize(school, schoolSchema),
//   });
//   const initialQuery = getState().teachers;
//   return dispatch(teacherQuery({
//     ...initialQuery.query,
//     $offset: 0,
//     school: { id: school.id },
//   }));
// };
