import xhr from 'xhr';
import cf from './config';
import alpha from '../user-alpha-sort';

const config = { ...cf, timeout: 30000 };

function makeRequest(slice, transform) {
  return new Promise((resolve, reject) => {
    xhr.get(
      `/api/reports/${slice}`,
      config,
      (error, response) => {
        if (error) {
          return reject(error);
        }
        return resolve({
          ...response,
          body: transform(response.body),
        });
      },
    );
  });
}

const mapUser = user => ({
  ...user,
  dob: user.dob && !isNaN(new Date(user.dob))
    ? new Date(user.dob)
    : null,
});

export default {
  students: () => makeRequest('groups', groups => groups.reduce(
    (students, group) => [
      ...students,
      ...group.users
        .filter(ur => ur.type === 'STUDENT')
        .map(ur => mapUser({
          ...ur,
          group: {
            ...group,
            leaders: group.users.filter(u => u.type === 'LEADER'),
          },
        })),
    ],
    [],
  ).sort(alpha)),
  leaders: () => makeRequest('leaders', users => users.map(mapUser)),
  groups: () => makeRequest('groups', groups => groups.map(group => ({
    ...group,
    users: group.users.map(mapUser),
  }))),
};
