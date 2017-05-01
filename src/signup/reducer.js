// Managing the piece of state related to this container
import { SIGNUP_REQUESTING, SIGNUP_SUCCESS, SIGNUP_ERROR } from './constants'

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

    // Reset the state and add a body message of success!
    // Remember our successfuly payload returned will be:
    // { "email": "of the new user", "id": "of the user" }
    case SIGNUP_SUCCESS:
      return {
        requesting: false,
        successful: true,
        errors: [],
        messages: [{
          body: `Successfully created account for ${action.response.email}`,
          time: new Date()
        }]
      }

    // Reset the state but with errors!
    // The error payload returned is actually far more detailed, but we'll
    // just stick with the base message for now.
    case SIGNUP_ERROR:
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
      return state
  }
}

export default reducer;
