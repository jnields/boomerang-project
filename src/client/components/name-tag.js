import React from 'react';
import PropTypes from 'prop-types';

const { shape, string, number } = PropTypes;
export default function NameTag(props) {
  const {
    school: {
        name,
    },
    student: {
        grade,
        user,
    },
  } = props;
  const { firstName, lastName } = user || {};
  return (<dl>
    <dt>Name:</dt>
    <dd>{firstName} {lastName}</dd>
    <dt>Grade:</dt>
    <dd>{grade}</dd>
    <dt>School:</dt>
    <dd>{name}</dd>
  </dl>);
}

NameTag.propTypes = {
  student: shape({
    firstName: string,
    lastName: string,
    grade: number,
  }).isRequired,
  school: shape({
    name: string,
  }).isRequired,
};
