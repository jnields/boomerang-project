import api from './api';

const prod = process.env.NODE_ENV === 'production';
const render = prod
  ? require('./server').default
  : require('./dev-server').default;

export default Promise.resolve(api).then(resolvedApi => ({
  '/api': resolvedApi,
  '/': render,
}));
