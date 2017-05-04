import { normalize } from 'normalizr';
import { user as userSchema } from '../../client/helpers/schema';

const proxyPort = process.env.PROXY_PORT || 35612;

export default (req, res) => {
  const user = req.user ? req.user.toJSON() : null;
  const normalized = user
    ? normalize(user, userSchema)
    : ({ entities: {}, result: null });
  const initialState = {
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
    bundlePath: `http://localhost:${proxyPort}/hot-reload-server/bundle.js`,
    markup: '',
    initialState: JSON
      .stringify(initialState)
      .replace(/</g, '\\u003c'),
  };
  return res.render('index', options);
};
