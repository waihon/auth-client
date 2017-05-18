// Constants for reducers and actions
// For a token-based API, logging in and logging out are just the presence
// of the access token that allows access to the API.
// Therefore the "spirit" of LOGOUT, LOGIN_EXISTING and realy the raw idea
// of LOGIN are embodied by both our CLIENT_SET and CLIENT_UNSET actions
// we've already set up in Signup branch.
export const LOGIN_REQUESTING = 'LOGIN_REQUESTING';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
