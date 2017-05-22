import { normalize, denormalize } from 'normalizr';
import * as listActions from './list';
import getOrCreateGroup from './get-or-create-group';
import { ASSIGN_GROUPS } from './types';
import { PENDING, COMPLETE, ERROR, UNSENT } from './xhr-statuses';

import api from '../helpers/api';
import { user as userSchema } from '../helpers/schema';
import { student as fieldsets } from '../helpers/properties';


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

const getStudent =
(item, id) =>
async (dispatch, getState) => {
  let oldGroup;
  if (id) {
    oldGroup = denormalize(
      id,
      userSchema,
      getState().entities,
    ).group;
  }
  const result = { ...item, type: 'STUDENT' };
  result.groupId = await dispatch(getOrCreateGroup(item.groupName, oldGroup, id));
  delete result.groupName;
  return result;
};

const getStudents =
items =>
async (dispatch) => {
  const groups = {};
  items.forEach(({ groupName }) => {
    groups[groupName] = groups[groupName] || dispatch(getOrCreateGroup(groupName));
  });
  return items.map(async (item) => {
    const result = { ...item, type: 'STUDENT' };
    result.groupId = await groups[item.groupName];
    delete result.groupName;
    return result;
  });
};


export const selectItem = listActions.selectItem.bind(null, config);
export const clearParsed = listActions.clearParsed.bind(null, config);
export const query = listActions.query.bind(null, config);

export const save =
item =>
dispatch =>
dispatch(listActions.save(config, dispatch(getStudent(item))));

export const upload =
items =>
dispatch =>
dispatch(listActions.upload(config, dispatch(getStudents(items))));

export const update =
(id, patch) =>
dispatch =>
dispatch(listActions.update(config, id, dispatch(getStudent(patch, id))));

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
      dispatch({ type, name: 'students', status: COMPLETE, ...normalized });
    } else {
      dispatch({ type, name: 'students', status: ERROR });
    }
  } catch (error) {
    dispatch({ type, name: 'students', error, status: UNSENT });
  }
};

export const del = listActions.del.bind(null, config);
export const parse = listActions.parse.bind(null, config);
export { showModal, closeModal } from './modal';
