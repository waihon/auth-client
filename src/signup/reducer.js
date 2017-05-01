// Managing the piece of state related to this container
import { SIGNUP_REQUESTING } from './constants'

const initialState = {
  requesting: false, // We've initiated a request to sign up
  successful: false, // The request has returned successfully
  messages: [],      // An array of general messages to show the user
  errors: []         // An array of error messages just in case there's more than 1
}

const reducer = function signupReducer(state = initialState, action) {
  switch (action.type) {
    case SIGNUP_REQUESTING:
      return {
        requesting: true,
        successful: false,
        messages: [{ body: 'Signing up...', time: new Date() }],
        errors: []
      }

    default:
      return state
  }
}

export default reducer;
