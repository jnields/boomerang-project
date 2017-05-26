import { normalize, denormalize } from 'normalizr';
import { group as groupSchema, user as userSchema } from '../helpers/schema';
import api from '../helpers/api';
import { GET, SAVE, DELETE } from '../actions/types';
import { COMPLETE, PENDING, ERROR } from '../actions/xhr-statuses';

const deleteOld =
(oldGroup, userId) =>
async (dispatch) => {
  if (oldGroup == null) return false;
  const type = DELETE;
  const name = 'groups';
  const {
    body: { count },
  } = await api.users.query({
    id: { $ne: userId },
    group: {
      name: oldGroup.name,
    },
    $limit: 1,
  });
  if (count) return false;
  const id = oldGroup.id;
  dispatch({ type, name, status: PENDING, id });
  try {
    const response = await api.groups.del(oldGroup.id);
    dispatch({ type, name, status: COMPLETE, id, response });
  } catch (error) {
    dispatch({ type, name, status: ERROR, error });
  }
  return true;
};

const saveNew =
group =>
async (dispatch) => {
  if (!group || !group.name) return null;
  const {
    body: {
      count,
      results,
    },
  } = await api.groups.query({ name: group.name, $limit: 1 });
  if (count) {
    const normalized = normalize(results[0], groupSchema);
    dispatch({
      type: GET,
      name: 'groups',
      status: COMPLETE,
      ...normalized,
    });
    return results[0].id;
  }
  const { body } = await api.groups.post({ name: group.name });
  const normalized = normalize(body, groupSchema);
  dispatch({
    type: SAVE,
    status: COMPLETE,
    name: 'groups',
    ...normalized,
  });
  return normalized.result;
};


const queue = {};
function waitInQueue(name, cb) {
  queue[name] = Promise.resolve(queue[name]).then(() => cb());
  return queue[name];
}

const getOrCreateGroup = (group, oldGroup, userId) =>
dispatch =>
waitInQueue(name, async () => {
  const [/* deleted */, result] = await Promise.all([
    dispatch(deleteOld(oldGroup, userId)),
    dispatch(saveNew(group, dispatch)),
  ]);
  return result;
});

export default (item, type, id) =>
async (dispatch, getState) => {
  let oldGroup;
  if (id) {
    oldGroup = denormalize(
      id,
      userSchema,
      getState().entities,
    ).group;
  }
  const result = { ...item, type };
  result.groupId = await dispatch(getOrCreateGroup(item.group, oldGroup, id));
  delete result.group;
  return result;
};
