import { normalize } from 'normalizr';
import { group as groupSchema } from '../helpers/schema';
import api from '../helpers/api';
import { CREATE_GROUP } from '../actions/types';

const groupMap = {};
export default name => (dispatch) => {
  if (name == null) return null;
  groupMap[name] = Promise.resolve(groupMap[name]).then(
    value => value || api.groups.query({ name, $limit: 1 }).then(
      (queryResponse) => {
        const { results, count } = queryResponse.body;
        if (count) {
          const normalized = normalize(results[0], groupSchema);
          dispatch({ type: CREATE_GROUP, ...normalized });
          return results[0].id;
        }
        return api.groups.post({ name }).then(
          (response) => {
            const normalized = normalize(response.body, groupSchema);
            dispatch({ type: CREATE_GROUP, ...normalized });
            return normalized.result;
          },
      );
      },
    ),
  );
  return groupMap[name];
};
