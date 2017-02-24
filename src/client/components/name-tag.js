import React from "react";

export default function NameTag({firstName, lastName, grade}) {
    return <dl>
        <dt>Name:</dt>
        <dd>{firstName} {lastName}</dd>
        <dt>Grade:</dt>
        <dd>{grade}</dd>
    </dl>;
}
