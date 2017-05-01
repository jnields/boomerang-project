import React, { Component } from 'react';
import { arrayOf, number, func } from 'prop-types';

import Paginator from './paginator';
import StudentForm from '../containers/student-form';

import {
  student as studentProperties,
  address as addressProperties,
} from '../helpers/properties';
import bs from '../styles/bootstrap';
import styles from '../styles/helpers';
import { user } from '../helpers/models';

export default class StudentTab extends Component {

  componentDidMount() {
    this.props.goToPage(1);
  }

  render() {
    const {
      itemCount,
      offset,
      students,
      pageLength,
      goToPage,
      showModal,
    } = this.props;
    const pagination = {
      length: 5,
      currentPage: 1 + (offset / pageLength),
      totalPages: Math.ceil(itemCount / pageLength),
      goToPage,
    };

    const studentContent = students.length === 0
      ? (
        <div className={bs.colLg6}>
          <h2>No Students Listed</h2>
        </div>
      )
      : (
        <div className={bs.colLg6}>
          <div className={styles.scrollBox}>
            <table
              className={[
                bs.table,
                bs.tableHover,
              ].join(' ')}
            >
              <thead>
                <tr>
                  {studentProperties.map(prop => (
                    <th key={prop.name}>{prop.header}</th>
                    ))}
                  {addressProperties.map(prop => (
                    <th key={prop.name}>{prop.header}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {students.map(item => (
                  <tr key={item.id} className={styles.pointer}>
                    {studentProperties.map(prop => (
                      <td key={prop.name}>{item[prop.name]}</td>
                      ))}
                    {addressProperties.map(prop => (
                      <td key={prop.name}>{(item.address || {})[prop.name]}</td>
                      ))}
                  </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className={[bs.textCenter].join(' ')}>
            <Paginator {...pagination} />
          </div>
        </div>
      );
    return (
      <div className={bs.row}>
        {studentContent}
        <button
          className={[
            bs.btn,
            bs.btnDefault,
          ].join(' ')}
          onClick={() => showModal({
            title: 'Add Student',
            content: <StudentForm />,
          })}
        >
          <span
            className={[
              bs.glyphicon,
              bs.glyphiconPlus,
            ].join(' ')}
          />
        </button>
      </div>
    );
  }
}

StudentTab.propTypes = {
  pageLength: number.isRequired,
  students: arrayOf(user).isRequired,
  itemCount: number.isRequired,
  offset: number.isRequired,
  goToPage: func.isRequired,
  showModal: func.isRequired,
};
