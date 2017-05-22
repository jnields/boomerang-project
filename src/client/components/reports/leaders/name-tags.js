import React from 'react';
import { arrayOf } from 'prop-types';
import NameTagList from '../name-tag-list';
import { user as userShape } from '../../../helpers/models';

export default function Leaders({ items }) {
  const title = 'WEB Group Leader Name Tags';
  return <NameTagList users={items} title={title} />;
}

Leaders.propTypes = {
  items: arrayOf(userShape).isRequired,
};
