// This saga will watch for LOGIN_REQUESTING action and begin the login process.
// In addition to that basic watcher, we're also going to watch for a
// LOGIN_ERROR and a CLIENT_UNSET as well. We're going to do all of that in just
// one generator function.
// take - Pause, wait for a particular action, and pull from that actions' payload
// fork - Spin up another process that will deal with handling a particulr
//        task in the background.
// cancel - Cancel a particular task spinned up by fork.
// call - Call a function and  pause until the function returns.
// put - Dispatch an action to Redux. This is non-blocking.
// cancelled - Tell whether a particular forked task was cancelled
import { take, fork, cancel, call, put, cancelled } from 'redux-saga/effects';

// We'll use this function to redirect to different routes based on cases.
import { browserHistory } from 'react-router';

// Helper for API errors
import { handleApiErrors } from '../lib/api-errors';

// Our login constants
import { LOGIN_REQUESTING, LOGIN_SUCCESS, LOGIN_ERROR } from './constants';

// So that we can modify our Client piece of state
import { setClient, unsetClient } from '../client/actions';

import { CLIENT_UNSET } from '../client/constants';

// Different Login endpoint. The API URL is derived from .env file.
// create-react-app recognizes only those environment variables that were
// prefixed with REACT_APP_.
const loginUrl = `${process.env.REACT_APP_API_URL}/api/Clients/login`;

function loginApi(email, password) {
  return fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then(handleApiErrors)
    .then(response => response.json())
    .then(json => json)
    .catch((error) => { throw error })
}

function* logout() {
  // Dispatches the CLIENT_UNSET action
  yield put(unsetClient());

  // Remove our token
  localStorage.removeItem('token');

  // Redirect to the /login screen
  browserHistory.push('/login');
}

function* loginFlow(email, password) {
  let token;
  try {
    // Try to call our loginApi() functiion. Redux Saga will pause here
    // until we either are successful or receive an error.
    token = yield call(loginApi, email, password);

    // Inform Redux to set our client token, this is non blocking so...
    yield put(setClient(token))

    // ... also inform Redux that our login was successful
    yield put({ type: LOGIN_SUCCESS });

    // Set a stringified version of our token to localstorage on our domain.
    localStorage.setItem('token', JSON.stringify(token));

    // Redirect them to Widgets!
    browserHistory.push('/widgets');
  } catch (error) {
    // Error? Send it to Redux
    yield put({ type: LOGIN_ERROR, error });
  } finally {
    // No matter what, if our 'forked' task was cancelled we will then
    // just redirect them to login
    if (yield cancelled()) {
      browserHistory.push('/login');
    }
  }

  // Return the token for health and wealth
  return token;
}

// Our watcher (saga). It will watch for many things.
function* loginWatcher() {
  // Generators halt execution until their next step is ready/occurring.
  // So it's not like this loop is firing in the background 1000 times a second.
  // Instead, it says, "okay, true === true", and hits the first step...
  while (true) {
    // ... and in this first step it sees a yield statement with 'take' which
    // pauses the loop. It will sit here and WAIT for this action.
    //
    // yield take(ACTION) just says, when our generator sees the ACTION
    // it will pull from that ACTION's payload that we send up, its
    // email and password. ONLY when this happen will the loop moves forward...
    const { email, password } = yield take(LOGIN_REQUESTING);

    // ... and pass the email and and pwssword to our loginFlow() function.
    // The fork() method spins up another "process" that will deal with
    // handling the loginFlow's execution in the background!
    // Think, "fork another process".
    //
    // It also passes back to us, a reference to this forked task which is
    // stored in our const task here. We can use this to manage the task.
    //
    // However, fork() does not block our loop. It's in the background
    // therefore as soon as our loop executes this it moves forward...
    const task = yield fork(loginFlow, email, password);

    // ... and begins looking for either CLIENT_UNSET or LOGIN_ERROR!
    // That's right, it gets to here and stops and begins watching
    // for these tasks only. Why wouldn't it watch for login any more?
    // During the life cycle of this generator, the user will login once
    // and all we need to watch for is either logging out, or a login error.
    // The moment it does grab either of these though it will once again
    // move forward...
    const action = yield take([CLIENT_UNSET, LOGIN_ERROR]);

    // ... if, for whatever reason, we decide to logout during this process,
    // cancelthe current action. i.e. the user is being logged in, they get
    // impatient and start hammering the logout button. This would result in
    // the above statement seeing the CLIENT_UNSET action, and down here,
    // knowing that we should cancel the forked 'task' that was trying to
    // log them in. It will do so and move forward...
    if (action.type === CLIENT_UNSET) yield cancel(task);

    // .. finally we'll just log them out. This will unset the client's
    // access token... -> follow this back up to the top of the while loop
    yield call(logout);
  }
}

export default loginWatcher;
