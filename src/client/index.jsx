/* eslint-env commonjs */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import window from 'window-or-global';

import App from './containers/app';
import reducers from './reducers';
import api from './helpers/api';


const store = createStore(
  reducers,
  window.INITIAL_STATE,
  applyMiddleware(thunk),
);


const renderApp = (Component) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    </Provider>,
    window.document.getElementById('react-root'),
  );
};
renderApp(App);

if (process.env.NODE_ENV !== 'production' && module.hot) {
  window.api = api;
  window.store = store;

  module.hot.accept('./reducers', () => {
    try {
      delete require.cache[require.resolve('./reducers')];
      // eslint-disable-next-line global-require
      const nextReducer = require('./reducers').default;
      if (nextReducer) {
        store.replaceReducer(nextReducer);
      }
    } catch (e) {
      // ignored
    }
  });
  module.hot.accept('./containers/app', () => {
    try {
      delete require.cache[require.resolve('./containers/app')];
      // eslint-disable-next-line global-require
      const nextApp = require('./containers/app').default;
      if (nextApp) {
        renderApp(nextApp);
      }
    } catch (e) {
      // ignored
    }
  });
} else {
  delete window.INITIAL_STATE;
}
