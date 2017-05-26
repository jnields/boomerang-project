import React from 'react';
import PropTypes from 'prop-types';

export default function PasswordResetTemplate({ host, authMechanism }) {
  const resetId = Buffer.from(authMechanism.resetId, 'base64').toString('hex');
  const resetLink = `http://${host}/reset/${resetId}`;
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
        please visit the following link:
      </p>
      <a href={resetLink}>{resetLink}</a>
      <p>
        If this was a mistake, simply ignore this e-mail.
      </p>
      <footer>
        Thanks,
        Your friends at the Boomerang Project
      </footer>
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
    resetId: string.isRequired,
    user: shape({
      firstName: string,
      lastName: string,
    }).isRequired,
  }).isRequired,
};
