import React from 'react';
import { arrayOf } from 'prop-types';
import { user as userModel } from '../../helpers/models';

import MailingLabel from './mailing-label';

export default function MailingLabels({ users }) {
  return (
    <div>
      {users.map(user => <MailingLabel user={user} />)}
    </div>
  );
}

MailingLabels.propTypes = { users: arrayOf(userModel).isRequired };
