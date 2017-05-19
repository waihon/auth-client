// Set up auth checking when a user visits a route that should be protected.

import { setClient } from '../client/actions';

function checkAuthorization(dispatch) {
  // Attempt to grab the token from localStorage
  const storedToken = localStorage.getItem('token');

  // If it exists
  if (storedToken) {
    // Parse it down into an object
    const token = JSON.parse(storedToken);

    // This just all works to compare the total seconds of the created
    // time of the token vs the ttl (time to live) seconds.
    const createdDate = new Date(token.created);
    const created = Math.round(createdDate.getTime() / 1000);
    const ttl = 1209600; // 14 days x 24 hours x 60 minutes x 60 seconds
    const expiry = created + ttl;

    // If the token has expired return false
    if (created > expiry) return false;

    // Otherwise, dispatch the token to our setClient action which will
    // update our Redux State with the token and return true.
    dispatch(setClient(token));
    return true;
  }

  return false;
}

export function checkIndexAuthorization({ dispatch }) {
  // By having a function that returns a function we satisfy 2 goals:
  //
  // 1. Grab access to our Redux Store and thus Dispatch to call actions.
  // 2. Return a function that includes all the proper properties that
  //    React Router expects for us to include and use.
  //    In other words, we're returning a function to React Router in order
  //    to have access to both the helpers from React Router and Redux.
  //
  // nextState - The next "route" we're navigating to in the router
  // replace - A helper to change the route
  // next - What we call when we're done messing around
  //
  return (nextState, replace, next) => {
    // If we pass the authentication check, go to Widgets
    if (checkAuthorization(dispatch)) {
      replace('widgets');
      return next();
    }

    // Otherwise let's take them to login!
    replace('login');
    return next();
  }
}

export function checkWidgetAuthorization({ dispatch, getState }) {
  // Same format - we do this to have the Redux State available.
  // The difference is that this time we also pull in the helper
  // getState which will allow us to...
  // ... get the state.
  return (nextState, replace, next) => {
    // Reference to the 'client' piece of state
    const client = getState().client;

    // Is it defined and does it have a token? Good, go ahead to Widgets
    if (client && client.token) return next();

    // Not set yet? Let's try and set it and if so, go ahead to Widgets
    if (checkAuthorization(dispatch)) return next();

    // Nope? Okay back to login ya go.
    replace('login');
    return next();
  }
}
