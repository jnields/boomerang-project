import React from 'react';

import { user as userShape } from '../../helpers/models';

function formatAddress(address) {
  const {
    line1,
    line2,
    line3,
    city,
    state,
    zip,
    country,
  } = address;
  return <div />;
}

export default function MailingLabel({ user }) {
  const {
    firstName,
    middleName,
    lastName,
    address,
  } = user;

  return (
    <div>
    </div>
  );
}

MailingLabel.propTypes = { user: userShape.isRequired };
