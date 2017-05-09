import React, { Component } from 'react';
import { func, shape } from 'prop-types';

import SchoolList from '../containers/school-list';
import TeacherList from '../containers/teacher-list';

import bs from '../styles/bootstrap';
import { school } from '../helpers/models';

export default class AdminHome extends Component {
  static get propTypes() {
    return {
      selectedSchool: school,
      queryTeachers: func.isRequired,
      teacherParams: shape({}).isRequired,
    };
  }
  static get defaultProps() {
    return { selectedSchool: null };
  }

  componentWillReceiveProps({ selectedSchool: nextSchool }) {
    const { selectedSchool } = this.props;
    if (nextSchool && nextSchool.id !== (selectedSchool || {}).id) {
      this.props.queryTeachers(
        {
          ...this.props.teacherParams,
          school: { id: nextSchool.id },
          $offset: 0,
        },
        true,
      );
    }
  }

  render() {
    const { selectedSchool } = this.props;

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
          <h2>Schools</h2>
          <aside>(double click to edit)</aside>
          <SchoolList />
        </div>
        {selectedSchoolContent}
      </div>
    );
  }
}
