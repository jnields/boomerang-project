import React from 'react';

import { arrayOf } from 'prop-types';
import ReportList from '../report-list';
import { user as userShape } from '../../../helpers/models';

const properties = [
  {
    name: 'Name',
    getValue: student => `${student.firstName} ${student.lastName}`.trim(),
  },
  {
    name: 'E-Mail',
    getValue: student => student.email,
  },
  {
    name: 'Phone',
    getValue: student => student.phone,
  },
  {
    name: 'Group',
    getValue: student => (student.group ? student.group.name : null),
  },
  {
    name: 'Room Number',
    getValue: student => (student.group ? student.group.roomNumber : null),
  },
  {
    name: 'Notes',
    getValue: student => student.notes,
  },
];

export default function Master({ items }) {
  const title = 'WEB Group Leader List';
  return (
    <ReportList
      properties={properties}
      items={items}
      title={title}
    />
  );
}

Master.propTypes = {
  items: arrayOf(userShape).isRequired,
};
