import React from "react";
import { renderToString } from "react-dom/server";
import NameTag from "../components/name-tag";

export default function PrintTags(students,school) {
    const print = window.open("", "PRINT");
    print.document.write(renderToString(getTags(students, school)));
    print.document.close(); // necessary for IE >= 10
    print.focus(); // necessary for IE >= 10*/
    print.print();
    print.close();
    return true;
}

function getTags(students, school) {
    return <html>
        <head>
            <style>
            </style>
        </head>
        <body>
            {students.map(student => <NameTag
                key={student.id}
                student={student}
                school={school} />)}
        </body>
    </html>;
}
