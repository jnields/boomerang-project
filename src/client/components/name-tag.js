import React, { PropTypes } from "react";

const { shape, string, number } = PropTypes;
NameTag.propTypes = {
    student: shape({
        user: shape({
            firstName: string,
            lastName: string
        }),
        grade: number
    }).isRequired,
    school: shape({
        name: string
    }).isRequired
};
export default function NameTag(props) {
    const {
        school: {
            name
        },
        student: {
            grade,
            user
        }
    } = props;
    const { firstName, lastName } = user || {};
    return <dl>
        <dt>Name:</dt>
        <dd>{firstName} {lastName}</dd>
        <dt>Grade:</dt>
        <dd>{grade}</dd>
        <dt>School:</dt>
        <dd>{name}</dd>
    </dl>;
}
