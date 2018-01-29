import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { string } from 'prop-types';

export default function PermanentRedirect({ from, to }) {
    // eslint-disable-next-line react/display-name
  return (<Route
    render={({ staticContext }) => {
      if (staticContext) {
        // eslint-disable-next-line no-param-reassign
        staticContext.status = 301;
      }
      return <Redirect {...{ from, to }} />;
    }}
  />);
}

PermanentRedirect.propTypes = {
  from: string.isRequired,
  to: string.isRequired,
};
