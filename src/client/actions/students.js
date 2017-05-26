import { normalize } from 'normalizr';
import * as listActions from './list';
import { ASSIGN_GROUPS } from './types';
import { PENDING, COMPLETE, ERROR, UNSENT } from './xhr-statuses';

import api from '../helpers/api';
import { user as userSchema } from '../helpers/schema';
import { student as fieldsets } from '../helpers/properties';
import getUsers from './get-users';
import getUser from './get-user';

const config = {
  name: 'students',
  schema: userSchema,
  schemaName: 'users',
  post: api.users.post,
  query: api.users.query,
  patch: api.users.patch,
  del: api.users.del,
  fieldsets,
};

export const selectItem = listActions.selectItem.bind(null, config);
export const clearParsed = listActions.clearParsed.bind(null, config);
export const query = listActions.query.bind(null, config);

export const save =
item =>
dispatch => dispatch(listActions.save(config, dispatch(getUser(item, 'STUDENT'))));

export const upload =
items =>
dispatch => dispatch(listActions.upload(config, getUsers(items, 'STUDENT')));

export const update =
(id, patch) =>
dispatch =>
dispatch(listActions.update(config, id, dispatch(getUser(patch, 'STUDENT', id))));

export const assignGroups =
() =>
async (dispatch) => {
  const type = ASSIGN_GROUPS;
  dispatch({ type, name: 'students', status: PENDING });
  const [
    groupResponse,
    studentResponse,
  ] = await Promise.all([
    api.reports.groups(),
    api.reports.students({ $order: 'gender' }),
  ]);
  const allGroups = [...groupResponse.body];
  const allStudents = [...studentResponse.body];
  const patches = [];
  for (
    let i = 0, group = allGroups[i], student = allStudents.pop();
    group && student;
    i = (i + 1) === allGroups.length ? 0 : i + 1, group = allGroups[i], student = allStudents.pop()
  ) {
    patches.push({ id: student.id, groupId: group.id });
  }
  try {
    const response = await api.users.patchAll(patches);
    if (response.statusCode < 400) {
      const normalized = normalize(
        response.body,
        [userSchema],
      );
      return dispatch({ type, name: 'students', status: COMPLETE, ...normalized });
    }
    return dispatch({ type, name: 'students', status: ERROR });
  } catch (error) {
    return dispatch({ type, name: 'students', error, status: UNSENT });
  }
};

export const del =
(...args) =>
dispatch => dispatch(listActions.del(config, ...args));

export const parse = listActions.parse.bind(null, config);
export { showModal, closeModal } from './modal';
