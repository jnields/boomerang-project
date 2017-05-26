import xhr from 'xhr';
import cf from './config';

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
  students: () => makeRequest('students', users => users.map(mapUser)),
  leaders: () => makeRequest('leaders', users => users.map(mapUser)),
  groups: () => makeRequest('groups', groups => groups.map(group => ({
    ...group,
    users: group.users.map(mapUser),
  }))),
};
