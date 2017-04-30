import React from 'react';
import { user } from '../../helpers/models';

export default function NameTag(props) {
  const {
    student: {
        grade,
        firstName,
        lastName,
        school: { name },
    },
  } = props;
  return (<dl>
    <dt>Name:</dt>
    <dd>{firstName} {lastName}</dd>
    <dt>Grade:</dt>
    <dd>{grade}</dd>
    <dt>School:</dt>
    <dd>{name}</dd>
  </dl>);
}

NameTag.propTypes = { student: user.isRequired };
