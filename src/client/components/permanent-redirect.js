import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function PermanentRedirect({ from, to }) {
    // eslint-disable-next-line react/display-name
  return (<Route
    render={({ staticContext }) => {
      // eslint-disable-next-line
      if (staticContext) { staticContext.status = 301; }
      return <Redirect {... { from, to }} />;
    }}
  />);
}

const { string } = PropTypes;
PermanentRedirect.propTypes = {
  from: string.isRequired,
  to: string.isRequired,
};
