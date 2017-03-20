import React, { PropTypes } from "react";

const { string, number } = PropTypes;
NameTag.propTypes = {
    firstName: string.isRequired,
    lastName: string.isRequired,
    grade: number
};
export default function NameTag({firstName, lastName, grade}) {
    return <dl>
        <dt>Name:</dt>
        <dd>{firstName} {lastName}</dd>
        <dt>Grade:</dt>
        <dd>{grade}</dd>
    </dl>;
}
