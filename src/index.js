import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { Router, Route, browserHistory } from 'react-router';

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
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/widgets" components={Widgets} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
