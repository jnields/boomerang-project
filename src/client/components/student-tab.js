import React from 'react';
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

export default function StudentTab(props) {
  const {
    itemCount,
    offset,
    students,
    pageLength,
    goToPage,
  } = props;
  const pagination = {
    length: pageLength,
    currentPage: 1 + (offset / pageLength),
    totalPages: Math.ceil(itemCount / pageLength),
    goToPage,
  };
  return (
    <div className={bs.row}>
      <div
        className={[
          bs.colLg6,
          styles.scrollBox,
        ].join(' ')}
      >
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
      <div className={[bs.colLg12, bs.textCenter].join(' ')}>
        <Paginator {...pagination} />
      </div>
      <div className={bs.colLg6}>
        <StudentForm />
      </div>
    </div>
  );
}

StudentTab.propTypes = {
  pageLength: number.isRequired,
  students: arrayOf(user).isRequired,
  itemCount: number.isRequired,
  offset: number.isRequired,
  goToPage: func.isRequired,
};
