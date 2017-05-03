import React, { Component } from 'react';
import { arrayOf, number, func } from 'prop-types';

import Paginator from './paginator';
import SchoolForm from '../containers/school-form';

import {
  school as schoolProperties,
  address as addressProperties,
} from '../helpers/properties';
import bs from '../styles/bootstrap';
import styles from '../styles/helpers';
import { school } from '../helpers/models';

export default class SchoolList extends Component {

  componentDidMount() {
    this.props.goToPage(1);
  }

  render() {
    const {
      itemCount,
      offset,
      schools,
      pageLength,
      goToPage,
      showModal,
      selectSchool,
    } = this.props;
    const pagination = itemCount <= pageLength
      ? null
      : (
        <div className={[bs.textCenter].join(' ')}>
          <Paginator
            length={5}
            currentPage={1 + (offset / pageLength)}
            totalPages={Math.ceil(itemCount / pageLength)}
            goToPage={goToPage}
          />
        </div>
      );

    const schoolContent = schools.length === 0
      ? <h2>No Schools Listed</h2>
      : (
        <div>
          <h2>Schools</h2>
          <div className={styles.scrollBox}>
            <table
              className={[
                bs.table,
                bs.tableHover,
              ].join(' ')}
            >
              <thead>
                <tr>
                  {schoolProperties.map(prop => (
                    <th key={prop.name}>{prop.header}</th>
                  ))}
                  {addressProperties.map(prop => (
                    <th key={prop.name}>{prop.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schools.map(item => (
                  // eslint-disable-next-line
                  <tr key={item.id} className={styles.pointer} onClick={() => selectSchool(item)}>
                    {schoolProperties.map(prop => (
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
          {pagination}
        </div>
      );
    return (
      <div className={bs.row}>
        <div className={bs.colSm12}>
          {schoolContent}
        </div>
        <div className={bs.colSm12}>
          <button
            className={[
              bs.btn,
              bs.btnDefault,
            ].join(' ')}
            onClick={() => showModal({
              title: 'Add School',
              content: <SchoolForm />,
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
}

SchoolList.propTypes = {
  pageLength: number.isRequired,
  schools: arrayOf(school).isRequired,
  itemCount: number.isRequired,
  offset: number.isRequired,
  goToPage: func.isRequired,
  showModal: func.isRequired,
  selectSchool: func.isRequired,
};
