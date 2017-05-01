import React from 'react';
import { arrayOf, number, func } from 'prop-types';

import Paginator from './paginator';
import LeaderForm from '../containers/leader-form';

import {
  leader as leaderProperties,
  address as addressProperties,
} from '../helpers/properties';
import bs from '../styles/bootstrap';
import styles from '../styles/helpers';
import { user } from '../helpers/models';

export default function LeaderTab(props) {
  const {
    itemCount,
    offset,
    leaders,
    pageLength,
    goToPage,
  } = props;
  const pagination = {
    length: 5,
    currentPage: 1 + (offset / pageLength),
    totalPages: Math.ceil(itemCount / pageLength),
    goToPage,
  };
  return (
    <div className={bs.row}>
      <div className={bs.colLg6}>
        <table
          className={[
            bs.table,
            bs.tableHover,
            styles.scrollBox,
          ].join(' ')}
        >
          <thead>
            <tr>
              {leaderProperties.map(prop => (
                <th key={prop.name}>{prop.header}</th>
              ))}
              {addressProperties.map(prop => (
                <th key={prop.name}>{prop.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaders.map(item => (
              <tr key={item.id} className={styles.pointer}>
                {leaderProperties.map(prop => (
                  <td key={prop.name}>{item[prop.name]}</td>
                ))}
                {addressProperties.map(prop => (
                  <td key={prop.name}>{(item.address || {})[prop.name]}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={leaderProperties.length + addressProperties.length}>
                <Paginator {...pagination} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className={bs.colLg6}>
        <LeaderForm />
      </div>
    </div>
  );
}

LeaderTab.propTypes = {
  pageLength: number.isRequired,
  leaders: arrayOf(user).isRequired,
  itemCount: number.isRequired,
  offset: number.isRequired,
  goToPage: func.isRequired,
};
