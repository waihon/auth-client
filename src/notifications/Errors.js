// Components that will help us display error notifications without having
// to repead ourselves.
// We could just reuse the Messages for errors, but this is here just in case
// we need to handle the display of errors differently.
import React, { PropTypes } from 'react';

// Iterate over each error object and print them in an unordered list
const Errors = (props) => {
  const { errors } = props;
  return (
    <div>
      <ul>
        {errors.map(error => (
          <li key={error.time}>{error.body}</li>
        ))}
      </ul>
    </div>
  )
}

Errors.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.string,
      time: PropTypes.date
    })
  )
}

export default Errors;
