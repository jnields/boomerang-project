import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { normalize } from 'normalizr';

import App from '../../client/containers/app';
import api from './api';
import reducers from '../../client/reducers';
import { user as userSchema } from '../../client/helpers/schema';

const env = process.env.NODE_ENV || 'development';

export default Promise.resolve(api).then(resolvedApi => ({
  '/api': resolvedApi,
  '/': (req, res) => {
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
      title: 'Express',
      lang: 'en',
      initialState: JSON
        .stringify(initialState)
        .replace(/</g, '\\u003c'),
    };

    if (env === 'development') {
      options.bundlePath = '/hot-reload-server/bundle.js';
      options.markup = '';
    } else {
      options.bundlePath = '/public/build/bundle.js';
      options.markup = renderToString(staticRouter);
    }
    return res.render('index', options);
  },
}));
