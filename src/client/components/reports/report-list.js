import React from 'react';
import {
  arrayOf, string, shape,
  number, func,
} from 'prop-types';
import bs from '../../styles/bootstrap';
import styles from '../../styles/report-list';

export default function ReportList({
  title,
  items,
  properties,
  aside,
}) {
  return (
    <div className={styles.default}>
      <table className={bs.table}>
        <thead>
          <tr>
            <th colSpan={properties.length}>
              <h1>{title}</h1>
              {aside ? <aside>{aside}</aside> : null}
            </th>
          </tr>
          <tr>
            {properties.map(prop => <th key={prop.name}>{prop.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              {properties.map(prop => <td key={prop.name}>{prop.getValue(item)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReportList.propTypes = {
  items: arrayOf(shape({ id: number.isRequired })),
  title: string.isRequired,
  properties: arrayOf(shape({
    name: string.isRequired,
    getValue: func.isRequired,
  })).isRequired,
  aside: string,
};
ReportList.defaultProps = { items: null, aside: undefined };
