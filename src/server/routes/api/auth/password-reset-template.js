import React from 'react';
import PropTypes from 'prop-types';

export default function PasswordResetTemplate({ host, authMechanism }) {
  const resetLink =
        `${host}/login/reset?sid=${authMechanism.sessionId}`;
  return (<html lang="en">
    <head>
      <style />
    </head>
    <body>
      <header />
      <h1>Boomerang Project Password Reset</h1>
      <p>
        Somebody recently requested that your password for
        boomerang-project.com be reset. To choose a new one,
        please click this button.
      </p>
      <a href={resetLink}>Reset password</a>
      <p>
                If this was a mistake, simply ignore this e-mail.
            </p>
      <footer />
    </body>
  </html>);
}
const {
    shape,
    string,
} = PropTypes;
PasswordResetTemplate.propTypes = {
  host: string.isRequired,
  authMechanism: shape({
    sessionId: string.isRequired,
    user: shape({
      firstName: string,
      lastName: string,
    }).isRequired,
  }).isRequired,
};
