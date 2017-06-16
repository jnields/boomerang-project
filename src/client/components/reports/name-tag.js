import React from 'react';
import { string } from 'prop-types';
import { user as userShape } from '../../helpers/models';
import s from '../../styles/name-tag';
import logo from '../../../assets/logo.png';

const year = new Date().getFullYear();

export default function NameTag({ user, className }) {
  return (
    <div className={className}>
      <img className={s.logo} src={logo} alt="Boomerang Project" />
      <span className={s.orientation}>
        {`${year} `}<strong>WEB</strong>{' Group'}<br />
        {`Orientation ${user.type === 'LEADER' ? 'Leader' : ''}`}
      </span>
      <span className={s.name}>
        <span className={s.first}>
          {user.firstName}
        </span>
        <span className={s.last}>
          {user.lastName}
        </span>
      </span>
      {user.group == null
        ? null
        : [
          <span key={1} className={s.group}>
            Group {user.group.name}
          </span>,
          <span key={2} className={s.room}>
            Room {user.group.roomNumber}
          </span>,
        ]}
    </div>
  );
}
NameTag.propTypes = {
  user: userShape.isRequired,
  className: string,
};
NameTag.defaultProps = { className: s.default };
