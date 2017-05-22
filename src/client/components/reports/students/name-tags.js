import React from 'react';
import { arrayOf } from 'prop-types';
import NameTagList from '../name-tag-list';
import { user as userShape } from '../../../helpers/models';

export default function Students({ items }) {
  const title = 'WEB Student Name Tags';
  return <NameTagList users={items} title={title} />;
}

Students.propTypes = {
  items: arrayOf(userShape).isRequired,
};
