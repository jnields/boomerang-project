import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import reducers from './reducers';
import App from './containers/app';

const store = createStore(
    reducers,
    window.INITIAL_STATE,
    applyMiddleware(thunk),
);

delete window.INITIAL_STATE;

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
    document.getElementById('react-root'),
);
