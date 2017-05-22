import xhr from 'xhr';
import cf from './config';

const config = { ...cf, timeout: 30000 };

function makeRequest(slice) {
  return new Promise((resolve, reject) => {
    xhr.get(
      `/api/reports/${slice}`,
      config,
      (error, response) => {
        if (error) {
          return reject(error);
        }
        if (response
            && response.body
            && response.body.results
            && Array.isArray(response.body.results)
        ) {
          return resolve({
            ...response,
            body: {
              ...response.body,
              results: response.body.results.map(user => ({
                ...user,
                dob: user.dob ? new Date(user.dob) : null,
              })),
            },
          });
        }
        return resolve(response);
      },
    );
  });
}

export default {
  students: () => makeRequest('students'),
  leaders: () => makeRequest('leaders'),
  groups: () => makeRequest('groups'),
};
