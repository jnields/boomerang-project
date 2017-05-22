import api from './api';

export default function (pathName) {
  const slice = /^\/reports\/([^/]*)\/.*$/.exec(pathName);
  return api.reports[slice[1]];
}
