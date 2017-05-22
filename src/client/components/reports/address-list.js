import React from 'react';
import { arrayOf, string, shape } from 'prop-types';
import formatAddress from './format-address';
import ReportList from './report-list';

const properties = [
  {
    name: 'Name',
    getValue: student => `${student.firstName} ${student.lastName}`.trim(),
  },
  {
    name: 'Address',
    getValue: student => formatAddress(student.address),
  },
  {
    name: 'Phone',
    getValue: student => student.phone,
  },
  {
    name: 'Notes',
    getValue: student => student.notes,
  },
];

export default function AddressList({ users, title }) {
  return (
    <ReportList
      properties={properties}
      items={users}
      title={title}
    />
  );
}

AddressList.propTypes = {
  users: arrayOf(shape({})).isRequired,
  title: string.isRequired,
};
