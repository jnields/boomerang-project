import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { normalize } from 'normalizr';

import App from '../../client/containers/app';
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

  const context = {};
  const staticRouter = (
    <Provider store={store}>
      <StaticRouter
        location={req.url}
        context={context}
      >
        <App />
      </StaticRouter>
    </Provider>
    );
  if (context.url) {
    return res.redirect(context.status || 302, context.url);
  }

  const options = {
    title: 'Boomerang Project',
    lang: 'en',
    bundlePath: '/public/build/bundle.js',
    markup: renderToString(staticRouter),
    initialState: JSON
      .stringify(initialState)
      .replace(/</g, '\\u003c'),
  };
  return res.render('index', options);
};
