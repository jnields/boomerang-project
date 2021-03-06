import React from 'react';
import { arrayOf } from 'prop-types';
import joinLeaders from '../join-leaders';
import ReportList from '../report-list';
import { group as groupShape } from '../../../helpers/models';
import alphaNum from '../../../helpers/alpha-num-sort';
import alpha from '../../../helpers/user-alpha-sort';

const properties = [
  {
    name: 'Name',
    getValue: student => `${student.firstName || ''} ${student.lastName || ''}`.trim(),
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
    name: 'First Language',
    getValue: student => student.firstLanguage,
  },
  {
    name: 'Language Needs',
    getValue: student => student.languageNeeds,
  },
  {
    name: 'Notes',
    getValue: student => student.notes,
  },
];

export default function Master({ items }) {
  const groups = items.sort((g1, g2) => alphaNum(g1.name, g2.name)).map(group => ({
    ...group,
    students: group.users.filter(ur => ur.type === 'STUDENT').sort(alpha),
    leaders: group.users.filter(ur => ur.type === 'LEADER').sort(alpha),
  }));

  return (
    <div>
      {groups.length === 0 ? <h1>No Groups Listed</h1> : null}
      {groups.map(group => (
        <ReportList
          key={group.id}
          properties={properties}
          items={group.students}
          title={`WEB Group Report: Group ${group.name}`}
          aside={`Leaders: ${joinLeaders(group.leaders)}`}
        />
      ))}
    </div>
  );
}

Master.propTypes = {
  items: arrayOf(groupShape).isRequired,
};
