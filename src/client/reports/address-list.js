import React from 'react';
import { arrayOf, string } from 'prop-types';
import Report from './base';
import { user as userShape } from '../helpers/models';
import bs from '../styles/bootstrap';

// function format(value) {
//   if (value == null) return null;
//   switch (value.constructor) {
//     case Date:
//     default: return value;
//   }
// }

function formatAddress(address) {
  if (address == null) return null;
  const lines = [];
  if (address.line1) lines.push(address.line1);
  if (address.line2) lines.push(address.line2);
  let cityLine = '';
  if (address.city) cityLine += address.city;
  if (address.state) {
    cityLine += `${cityLine ? ', ' : ''}${address.state}`;
  }
  if (address.zip) {
    cityLine += `${cityLine ? ' ' : ''}${address.zip}`;
  }
  if (cityLine) lines.push(cityLine);
  return lines.join('\n');
}

export default function AddressListReport({
  title,
  users,
}) {
  return (
    <Report title={title}>
      <h1>WEB Group Leaders</h1>
      <table className={[bs.table, bs.tableHover].join(' ')}>
        <thead>
          <tr>
            <th>Group</th>
            <th>Room #</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{(user.group || {}).name}</td>
              <td>{(user.group || {}).roomNumber}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{formatAddress(user.address)}</td>
              <td>{user.phone}</td>
              <td>{user.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Report>
  );
}

AddressListReport.propTypes = {
  users: arrayOf(userShape).isRequired,
  title: string.isRequired,
};
