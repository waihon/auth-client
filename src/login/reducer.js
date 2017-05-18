// Managing the piece of state related to this container
import { LOGIN_REQUESTING, LOGIN_SUCCESS, LOGIN_ERROR } from './constants';

const initialState = {
  requesting: false,
  successful: false,
  messages: [],
  errors: []
}

const reducer = function loginReducer(state = initialState, action) {
  switch (action.type) {
    // Set the requesting flag and append a message to be shown.
    case LOGIN_REQUESTING:
      return {
        requesting: true,
        successful: false,
        messages: [{ body: 'Logging in...', time: new Date() }],
        errors: []
      }

    // If successful then reset the login state.
    case LOGIN_SUCCESS:
      return {
        requesting: false,
        successful: true,
        messages: [],
        errors: []
      }

    // Append the error returned from our API, set the success and
    // requesting flags to fasle.
    case LOGIN_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date()
        }])
      }

    default:
      return state;
  }
}

export default reducer;
