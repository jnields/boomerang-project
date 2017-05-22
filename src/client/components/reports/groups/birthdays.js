import React from 'react';
import { arrayOf } from 'prop-types';
import alpha from './alpha';
import joinLeaders from '../join-leaders';
import ReportList from '../report-list';
import { group as groupShape } from '../../../helpers/models';

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
    name: 'Phone',
    getValue: student => student.phone,
  },
  {
    name: 'E-Mail',
    getValue: student => student.email,
  },
  {
    name: 'Birthday',
    getValue: student => (
      student.dob && !isNaN(student.dob)
        ? student.dob.toLocaleString()
        : null
      ),
  },
];

export default function Birthdays({ items }) {
  const groups = items.map(group => ({
    ...group,
    students: group.users.filter(ur => ur.type === 'STUDENT').sort(alpha),
    leaders: group.users.filter(ur => ur.type === 'LEADER').sort(alpha),
  }));

  return (
    <div>
      {groups.map(group => (
        <ReportList
          key={group.id}
          properties={properties}
          items={group.students}
          title={`WEB Group Birthday Report: Group ${group.name}`}
          aside={`Leaders: ${joinLeaders(group.leaders)}`}
        />
      ))}
    </div>
  );
}

Birthdays.propTypes = {
  items: arrayOf(groupShape).isRequired,
};
