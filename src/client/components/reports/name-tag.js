import React from 'react';
import { user as userShape } from '../../helpers/models';
import s from '../../styles/name-tag';

const year = new Date().getFullYear();

export default function NameTag({ user }) {
  return (
    <div className={s.default}>
      {/* img */}
      <span className={s.orientation}>
        {`${year}`}
        <strong>WEB</strong>
        Group Orientation
      </span>
      <span className={s.name}>
        {`${user.firstName} ${user.lastName}`.trim()}
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
NameTag.propTypes = { user: userShape.isRequired };
