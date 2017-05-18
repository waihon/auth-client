// Central hub for all our reducers
// Whenever we set up a reducer, we'll make sure to include it in this file.
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import client from './client/reducer';
import signup from './signup/reducer';
import login from './login/reducer';

// In order for redux-form to work, it needs its reducer injected into the
// global state.
const IndexReducer = combineReducers({
  client,
  signup,
  login,
  form
});

export default IndexReducer;
