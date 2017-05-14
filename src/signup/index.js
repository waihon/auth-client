// The actual container component itself and all of the React godness
// 1) We connect our component to both Redux and Redux Form.
// 2) We create a form that's bound to use Redux Form's handleSubmit.
// 3) When we submit, the values bound to our components are handed to our
//    custom submit function. From here we call our action signupRequest with
//    the values.
// 4) Depending on whether or not our signup request is requesting or
//    successful, we'll show either a link to direct them to the /login page
//    or a reminder to login.
// 5) If we have errors or messages we'll pipe those to some handlers that
//    will iterate over the list of errors messages and return them as a <ul>
//    list for the user to see.
import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Import the helpers... that we'll make here in the next step
import Messages from '../notifications/Messages';
import Errors from '../notifications/Errors';

import signupRequest from './actions';

class Signup extends Component {
  // Pass the correct proptypes in for validation
  static propTypes = {
    // Redux Form
    handleSubmit: PropTypes.func,
    // Action
    signupRequest: PropTypes.func,
    // State
    signup: PropTypes.shape({
      requesting: PropTypes.bool,
      successful: PropTypes.bool,
      messages: PropTypes.array,
      errors: PropTypes.array
    })
  };

  // Redux Form will call this function with the values of our form fields
  // "email" and "password" when the form is submitted.
  // This will in turn call the action.
  submit = (values) => {
    // We could just do signupRequest here with the static proptypes but ESLint
    // doesn't like that very much.
    this.props.signupRequest(values)
  }

  render() {
    // Grab what we need from props. The handleSubmit from Redux Form
    // and the pieces of state from the global state.
    const {
      handleSubmit,
      signup: {
        requesting,
        successful,
        messages,
        errors
      }
    } = this.props

    return (
      <div className="signup">
        { /* Use the Submit handler with our own submit handler */ }
        <form className="widget-form" onSubmit={handleSubmit(this.submit)}>
          <h1>Sign Up</h1>
          <label htmlFor="email">Email</label>
          {
            /*
            The Field component below allows Redux Form to automatically bind
            values to our signup namespace within Redux Form's form state.
            Alongside the typical form input values, we can also pass it a
            custom form component since it accepts a PropType.Node.
            Passing it input just informs Redux Form to use the default input.
            In addition to binding those values, it also hands us a number of
            preoperties on our component's this.props. This includes real time
            updated values like whether or not the form is "dirty" or "touched";
            events for when we "blur" the form; much much more.
            */
          }
          <Field
            name="email"
            type="text"
            id="email"
            className="email"
            label="Email"
            component="input"
          />
          <label htmlFor="password">Password</label>
          <Field
            name="password"
            type="password"
            id="password"
            className="password"
            label="Password"
            component="input"
          />
          <button action="submit">Sign Up</button>
        </form>
        <div className="auth-messages">
          {
            /*
            These are all nothing more than helpers that will show up
            based on the UI states, not worth covering in depth.
            Simply put if there are messages or errors, we show them.
            */
          }
          {!requesting && !!errors.length && (
            <Errors message="Failure to sign up due to:" errors={errors} />
          )}
          {!requesting && !!messages.length && (
            <Messages messages={messages} />
          )}
          {!requesting && successful && (
            <div>
              Signup Successful! <Link to="/login">Click here to log in »</Link>
            </div>
          )}
          { /* Redux Router's <Link> component for quick navigation of routes */ }
          {!requesting && !successful && (
            <Link to="/login">Already a Widgeter? Click here to log in »</Link>
          )}
        </div>
      </div>
    )
  }
}

// Grab only the piece of state we need
const mapStateToProps = state => ({
  signup: state.signup
});

// Connect our component to Redux and attach the 'signup' piece
// of state to our 'props' in the component.
// Also attach the 'signupRequest' action to our 'props' as well.
const connected = connect(mapStateToProps, { signupRequest })(Signup);

// Connect our connected component to Redux Form. It will namespace
// the form we use in the component as 'signup'.
const formed = reduxForm({
  form: 'signup'
})(connected);

// Export our well formed component!
export default formed;
