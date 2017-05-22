import { normalize } from 'normalizr';
import { user as userSchema } from '../../client/helpers/schema';

const prod = process.env.NODE_ENV === 'production';
const bundlePort = prod
  ? process.env.BOOMERANG_PORT
  : process.env.PROXY_PORT;

export default (req, res) => {
  const user = req.user ? req.user.toJSON() : null;
  const normalized = user
    ? normalize(user, userSchema)
    : ({ entities: {}, result: null });
  const initialState = {
    ...res.initialState,
    entities: normalized.entities,
    authorization: {
      loggingIn: false,
      logInFailed: false,
      logInUnsent: false,
      user: normalized.result,
    },
  };

  const options = {
    title: 'Express',
    lang: 'en',
    bundlePath: `http://localhost:${bundlePort}/hot-reload-server/bundle.js`,
    markup: '',
    initialState: JSON
      .stringify(initialState)
      .replace(/</g, '\\u003c'),
  };
  return res.render('index', options);
};
