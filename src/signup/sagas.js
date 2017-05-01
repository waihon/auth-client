// Sagas to watch for API-related calls
// 1) Waits until it "sees" the SIGNUP_REQUESTING action dispatched.
// 2) Calls the signupFlow() with the action received.
// 3) signupFlow() then run in a generator stepping through each call in a
//    non-blocking synchronous looking style.
import { call, put, takeLatest } from 'redux-saga/effects';
import { handleApiErrors } from '../lib/api-errors';
import { SIGNUP_REQUESTING, SIGNUP_SUCCESS, SIGNUP_ERROR } from './constants';

// The URL derived from our .env file.
const signupUrl = `${process.env.REACT_APP_API_URL}/api/Clients`;

function signupApi(email, password) {
  // Call to the "fetch". This is a "native" function for browsers that's
  // conveniently polifilled in create-react-app if not available.
  return fetch(signupUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  }).then(handleApiErrors)
    .then(response => response.json())
    .then(json => json)
    .catch((error) => { throw error })
}

// This will be run when the SIGNUP_REQUESTING action is found by the watcher.
function* signupFlow(action) {
  try {
    const { email, password } = action

    // Pulls "calls" to our signupApi with our email and password from our
    // diaptched signup action, and will pause here until the API async
    // function is complete.
    const response = yield call(signupApi, email, password);

    // When the above API call has completed it will "put" or dispatch,
    // an action of type SIGNUP_SUCCESS with the successful response.
    yield put({ type: SIGNUP_SUCCESS, response });
  } catch (error) {
    // If the API call fails, it will "put" the SIGNUP_ERROR into the dispatch
    // along with the error.
    yield put({ type: SIGNUP_ERROR, error });
  }
}

// Watches for the SIGNUP_REQUESTING action type. When it gets it, it will call
// signupFlow() with the action we dispatched.
function* signupWatcher() {
  // takeLatest() takes the latest call of that action and runs it.
  // If we're to use takeEvery, it would take every single one of the actions
  // and kick off a new task to handle it concurrently!
  yield takeLatest(SIGNUP_REQUESTING, signupFlow);
}

export default signupWatcher;
