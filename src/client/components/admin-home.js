import React from 'react';

import SchoolList from '../containers/school-list';
import TeacherList from '../containers/teacher-list';

import bs from '../styles/bootstrap';
import { school } from '../helpers/models';

export default function AdminHome({ selectedSchool }) {
  const selectedSchoolContent = selectedSchool == null ? null
      : (
        <div className={bs.colLg6}>
          <h2>Teachers at {selectedSchool.name}</h2>
          <TeacherList />
        </div>
      );
  return (
    <div className={bs.row}>
      <div className={bs.colLg6}>
        <SchoolList />
      </div>
      {selectedSchoolContent}
    </div>
  );
}

AdminHome.propTypes = {
  selectedSchool: school,
};
AdminHome.defaultProps = {
  selectedSchool: null,
};
