import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// Authorization helpers
import {
  checkIndexAuthorization,
  checkWidgetAuthorization
} from './lib/check-auth';

// Import all of our components
import App from './App';
import Login from './login';
import Signup from './signup';
import Widgets from './widgets';
import './index.css';

// Import the index reducer and sagas
import IndexReducer from './index-reducer';
import IndexSagas from './index-sagas.js';

// Set up the middleware to watch between the reducers and the actions
const sagaMiddleware = createSagaMiddleware();

// Redux DevTools - completely optional, but this is necessary for it to
// work properly with redux-saga. Otherwise you'd just do:
// const store = createStore(
//   IndexReducer,
//   applyMiddleware(sagaMiddleware)
// );

/*eslist-disable */
const composeSetup = process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
/*eslint-enable */

const store = createStore(
  IndexReducer,
  // Allows Redux DevTools to watch sagas
  composeSetup(applyMiddleware(sagaMiddleware))
);

// Begin our index sagas
sagaMiddleware.run(IndexSagas)

// Set up the top level router component for our React Router
// Rendering components as the children of our App component,
// based on routes.
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} >
        {/*
          IndexRoute allows us to referene the above top-level "/" path.
          If we were to put our check directly on the "/" path, the check
          would get run on every nested route. Instead we only wat it on
          the "/" one.
          We pass store to below authorization helpers so they can intereact
          with our state and actions via dispatch.
        */}
        <IndexRoute onEnter={checkIndexAuthorization(store)} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route onEnter={checkWidgetAuthorization(store)} path="/widgets" components={Widgets} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
