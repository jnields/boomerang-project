import xhr from 'xhr';
import config from './config';
import handleAbort from './handle-abort';

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export default {
  del: (id, abort) => new Promise((resolve, reject) => {
    if (typeof id !== 'number') {
      throw new TypeError('id must be of type number');
    }
    let cancel;
    const req = xhr.del(
      `/api/addresses/${id}`,
      config,
      (error, response) => {
        cancel = null;
        if (error) {
          return reject(error);
        }
        return resolve(response);
      },
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
  patch: (id, patch, abort) => new Promise((resolve, reject) => {
    if (typeof id !== 'number') {
      throw new TypeError('id must be of type number');
    }
    if (!isObject(patch)) {
      throw new TypeError('patch must be plain object');
    }
    let cancel;
    const req = xhr.patch(
      `/api/addresses/${id}`,
      {
        ...config,
        body: patch,
      },
      (error, response) => {
        cancel = null;
        if (error) {
          return reject(error);
        }
        return resolve(response);
      },
    );
    cancel = req.abort.bind(req);
    handleAbort({ abort, cancel, resolve });
  }),
};
