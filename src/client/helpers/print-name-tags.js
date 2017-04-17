import React from 'react';
import PropTypes from 'prop-types';
import { renderToString } from 'react-dom/server';
import NameTag from '../components/name-tag';
import { Student, School } from '../helpers/models';

function TagList({ students, school }) {
  return (<html lang="en-US">
    <head>
      <style />
    </head>
    <body>
      {students.map(student => <NameTag
        key={student.id}
        student={student}
        school={school}
      />)}
    </body>
  </html>);
}
const {
  arrayOf,
  instanceOf,
} = PropTypes;
TagList.propTypes = {
  students: arrayOf(
    instanceOf(Student),
  ).isRequired,
  school: instanceOf(School).isRequired,
};

export default function PrintTags(students, school) {
  const print = window.open('', 'PRINT');
  print.document.write(
    renderToString(
      <TagList students={students} school={school} />,
    ),
  );
  print.document.close(); // necessary for IE >= 10
  print.focus(); // necessary for IE >= 10*/
  print.print();
  print.close();
  return true;
}
