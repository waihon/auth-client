// All of the actions that our container dispatches
import { LOGIN_REQUESTING } from './constants';

// In order to perform an action of type LOGIN_REQUESTING
// we need an email and password
const loginRequest = function loginRequest({ email, password }) {
  return {
    type: LOGIN_REQUESTING,
    email,
    password
  }
}

export default loginRequest;
