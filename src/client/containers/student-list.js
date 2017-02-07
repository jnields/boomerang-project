import React from "react";
import { connect } from "react-redux";
import bs from "../sass/bootstrap";

const printIcon = [
    bs.glyphicon,
    bs.glyphiconPrint
].join(" ");

function StudentList({ students }) {
    return <div>
        <table>
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Grade</td>
                    <td>Age</td>
                    <td>Gender</td>
                </tr>
            </thead>
            <tbody>
                {students.map((student, ix) => {
                    return <tr key={ix}>
                        <td>{student.name}</td>
                        <td>{student.grade}</td>
                        <td>{student.age}</td>
                        <td>{student.gender}</td>
                    </tr>;
                })}
            </tbody>
        </table>
        <span className={printIcon}></span>
    </div>;
}

function mapStateToProps(state) {
    return {
        students: state.students.unsavedItems || []
    };
}
export default connect(mapStateToProps, null)(StudentList);
