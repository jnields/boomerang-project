import { createStore } from 'redux';
import { normalize } from 'normalizr';

import reducers from '../../client/reducers';
import { user as userSchema } from '../../client/helpers/schema';

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
  const store = createStore(reducers, initialState);
  store.dispatch({ type: '__INIT_STATE__' });

  const options = {
    title: 'Express',
    lang: 'en',
    bundlePath: '/hot-reload-server/bundle.js',
    markup: '',
    initialState: JSON
      .stringify(initialState)
      .replace(/</g, '\\u003c'),
  };
  return res.render('index', options);
};
