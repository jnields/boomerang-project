import api from '../helpers/api';
import { user as userSchema } from '../helpers/schema';
import { student as fieldsets } from '../helpers/properties';

import * as listActions from './list';

const config = {
  name: 'students',
  schema: userSchema,
  schemaName: 'users',
  post: api.users.post,
  query: api.users.query,
  put: api.users.put,
  del: api.users.del,
  fieldsets,
};

async function getStudent(item) {
  return { ...item, type: 'STUDENT' };
}

export const selectItem = listActions.selectItem.bind(null, config);
export const clearParsed = listActions.clearParsed.bind(null, config);
export const query = listActions.query.bind(null, config);

export const save =
item =>
dispatch =>
dispatch(listActions.save(config, getStudent(item)));

export const upload =
items =>
dispatch =>
dispatch(listActions.upload(config, items.map(getStudent)));

export const update = listActions.update.bind(null, config);
export const del = listActions.del.bind(null, config);
export const parse = listActions.parse.bind(null, config);
export { showModal, closeModal } from './modal';

//
// export const saveStudent = values => async (dispatch) => {
//   return api.users.post(getUser(values)(dispatch)).then(
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
// export const updateStudent = values =>
// async (dispatch, getState) => {
//   const oldGroup = denormalize(
//     values.id,
//     user,
//     getState().entities,
//   ).group;
//   const patch = await getUser(values, oldGroup)(dispatch);
//   const type = UPDATE_STUDENT;
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
// export const handleSubmit = values => async (dispatch) => {
//   if (values.id) {
//     await dispatch(updateStudent(values));
//   } else {
//     await dispatch(saveStudent(values));
//     await dispatch(requery());
//   }
//   return dispatch(closeModal());
// };
//
// export const deleteStudent = () => (dispatch, getState) => {
//   const type = DELETE_STUDENT;
//   const student = getState().students.selectedStudent;
//   dispatch({
//     type,
//     status: PENDING,
//   });
//   return api.users.delete(student).then(
//     (response) => {
//       if (response.statusCode < 400) {
//         dispatch({
//           type,
//           status: COMPLETE,
//           student,
//           entities: { users: { [student]: undefined } }, // delete user from entities
//         });
//         dispatch(closeModal());
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
// const properties = [
//   ...studentProperties,
//   ...addressProperties,
// ].map(prop => ({ ...prop, validate: null }));
//
// export const parseFile = e => (dispatch) => {
//   const worker = new LoadXlsxWorker();
//   const type = PARSE_STUDENT_FILE;
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
//   const type = SAVE_UPLOADED_STUDENTS;
//   dispatch({ type, users, status: PENDING });
//   return api.users.post(users).then(
//     (response) => {
//       if (response.statusCode < 400) {
//         dispatch({
//           type,
//           status: COMPLETE,
//           ...normalize(
//             response.body,
//             [user],
//           ),
//         });
//       } else {
//         return dispatch({ type, response, status: COMPLETE });
//       }
//       return dispatch(requery());
//     },
//     error => dispatch({ type, error, status: ERROR }),
//   );
// };
