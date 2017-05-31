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
  students: async () => {
    const [withGroup, withoutGroup] = await Promise.all([
      makeRequest('groups', groups => groups.reduce(
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
      )),
      new Promise((resolve, reject) => {
        xhr.get(
          '/api/users?group=\u0000&$limit=10000&type=STUDENT',
          config,
          (error, response) => {
            if (error) return reject(error);
            const { results } = response.body;
            return resolve({
              ...response,
              body: results.map(mapUser),
            });
          },
        );
      }),
    ]);
    return {
      statusCode: Math.max(withGroup.statusCode, withoutGroup.statusCode),
      body: [
        ...withGroup.body,
        ...withoutGroup.body,
      ].sort(alpha),
    };
  },
  leaders: () => makeRequest('leaders', users => users.map(mapUser)),
  groups: () => makeRequest('groups', groups => groups.map(group => ({
    ...group,
    users: group.users.map(mapUser),
  }))),
};
