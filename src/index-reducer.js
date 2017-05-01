// Central hub for all our reducers
// Whenever we set up a reducer, we'll make sure to include it in this file.
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

// In order for redux-form to work, it needs its reducer injected into the
// global state.
const IndexReducer = combineReducers({
  form
});

export default IndexReducer;
