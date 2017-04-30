import React from 'react';
import {
  arrayOf,
  string,
} from 'prop-types';

import { user } from '../../helpers/models';

export default function UserList() {
  return <div />;
}

UserList.propTypes = {
  fields: arrayOf(string).isRequired,
  users: arrayOf(user).isRequired,
};
