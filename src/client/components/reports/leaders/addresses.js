import React from 'react';
import { arrayOf } from 'prop-types';
import AddressList from '../address-list';
import { user as userShape } from '../../../helpers/models';

export default function Addresses({ items }) {
  const title = 'WEB Group Leader Address List';
  return <AddressList users={items} title={title} />;
}

Addresses.propTypes = {
  items: arrayOf(userShape).isRequired,
};
