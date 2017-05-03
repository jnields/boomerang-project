import React from 'react';
import { arrayOf, number, func } from 'prop-types';

import Paginator from './paginator';
import TeacherForm from '../containers/teacher-form';

import {
  teacher as teacherProperties,
} from '../helpers/properties';
import bs from '../styles/bootstrap';
import styles from '../styles/helpers';
import { school } from '../helpers/models';

export default function TeacherList(props) {
  const {
      itemCount,
      offset,
      teachers,
      pageLength,
      goToPage,
      showModal,
    } = props;
  const pagination = itemCount <= pageLength
      ? null
      : (
        <Paginator
          length={5}
          currentPage={1 + (offset / pageLength)}
          totalPages={Math.ceil(itemCount / pageLength)}
          goToPage={goToPage}
        />
      );

  const teacherContent = teachers.length === 0
      ? <h2>No Teachers Listed</h2>
      : (
        <div>
          <div className={styles.scrollBox}>
            <table
              className={[
                bs.table,
                bs.tableHover,
              ].join(' ')}
            >
              <thead>
                <tr>
                  {teacherProperties.map(prop => (
                    <th key={prop.name}>{prop.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teachers.map(item => (
                  <tr key={item.id} className={styles.pointer}>
                    {teacherProperties.map(prop => (
                      <td key={prop.name}>{item[prop.name]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination}
        </div>
      );
  return (
    <div className={bs.row}>
      <div className={bs.colSm12}>
        {teacherContent}
      </div>
      <div className={bs.colSm12}>
        <button
          className={[
            bs.btn,
            bs.btnDefault,
          ].join(' ')}
          onClick={() => showModal({
            title: 'Add Teacher',
            content: <TeacherForm />,
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
    </div>
  );
}

TeacherList.propTypes = {
  pageLength: number.isRequired,
  teachers: arrayOf(school).isRequired,
  itemCount: number.isRequired,
  offset: number.isRequired,
  goToPage: func.isRequired,
  showModal: func.isRequired,
};
