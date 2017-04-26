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
    // eslint-disable-next-line global-require
    store.replaceReducer(require('./reducers').default);
  });
  module.hot.accept('./containers/app', () => {
    // eslint-disable-next-line global-require
    renderApp(require('./containers/app').default);
  });
}
