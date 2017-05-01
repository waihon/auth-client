// All of the actions that our container dispatches
import { SIGNUP_REQUESTING } from './constants';

// We're going to let our sagas deal with success, error, and promises.
// When we dispatch this action, it will be picked up by our sagas, which
// will handle the API, and dispatch actions with the correct data from here.
// This allow us to keep our actions "pure" (which the React community absolutely
// loves saying).
// This differs from Thunks, where we instead turn our actions into this long
// drawn out promise chain.
const signupRequest = function signupRequest({ email, password }) {
  return {
    type: SIGNUP_REQUESTING,
    email,
    password
  }
};

export default signupRequest;
