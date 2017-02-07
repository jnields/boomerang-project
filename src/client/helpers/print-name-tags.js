import React from "react";
import ReactDOM from "react-dom";
import NameTag from "../components/name-tag";

export function PrintTags(students) {
    const print = window.open("", "PRINT", "height=400,width=600");
    print.document.write(ReactDOM.renderToString(getTags(students)));
    print.document.close(); // necessary for IE >= 10
    print.focus(); // necessary for IE >= 10*/
    print.print();
    print.close();
    return true;
}

function getTags(students) {
    return <html>
        <head></head>
        <body>
            {students.map(student => <NameTag student={student} />)}
        </body>
    </html>;
}
