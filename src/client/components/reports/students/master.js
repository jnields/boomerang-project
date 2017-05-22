import React from 'react';
import { arrayOf } from 'prop-types';
import joinLeaders from '../join-leaders';
import ReportList from '../report-list';
import { user as userShape } from '../../../helpers/models';

const properties = [
  {
    name: 'Name',
    getValue: student => `${student.firstName} ${student.lastName}`.trim(),
  },
  {
    name: 'Gender',
    getValue: student => student.gender,
  },
  {
    name: 'Group',
    getValue: student => (student.group ? student.group.name : null),
  },
  {
    name: 'Room',
    getValue: student => (student.group ? student.group.roomNumber : null),
  },
  {
    name: 'Group Leaders',
    getValue: student => (
      student.group
        ? joinLeaders(student.group.leaders)
        : null
    ),
  },
  {
    name: 'Language Needs',
    getValue: student => student.languageNeeds || 'None listed',
  },
  {
    name: 'Attended Orientation',
    getValue: (student) => {
      if (student.oriented == null) return null;
      return student.oriented ? 'Y' : 'N';
    },
  },
  {
    name: 'Notes',
    getValue: student => student.notes,
  },
];

export default function Master(props) {
  const title = 'WEB Student List';
  return (
    <ReportList
      properties={properties}
      items={props.items}
      title={title}
    />
  );
}

Master.propTypes = {
  items: arrayOf(userShape).isRequired,
};
