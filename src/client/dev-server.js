import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import App from './containers/app';
import reducers from './reducers';

window.api = require('./helpers/api').default;

const store = createStore(
  reducers,
  window.INITIAL_STATE,
  applyMiddleware(thunk),
);

window.store = store;
function renderApp(Component) {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    </Provider>,
    document.getElementById('react-root'),
  );
}

renderApp(App);

if (module.hot) {
  module.hot.accept('./reducers', () => {
    try {
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
      // eslint-disable-next-line global-require
      const nextApp = require('./containers/app').default;
      if (nextApp) {
        renderApp(nextApp);
      }
    } catch (e) {
      // ignored
    }
  });
}
