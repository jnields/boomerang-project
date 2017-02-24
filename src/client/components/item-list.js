import React, { PropTypes } from "react";
import bs from "../sass/bootstrap";

const printIcon = [
    bs.glyphicon,
    bs.glyphiconPrint
].join(" ");
ItemList.propTypes = {
    print: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    type: PropTypes.string.isRequired
};
export default function ItemList({ items, type, print }) {
    const isStudent = type === "students";
    const studentHeaders = isStudent
        ? [
            <td>Grade</td>,
            <td>Leader</td>
        ]
        : null;
    return <div>
        <table>
            <thead>
                <tr>
                    <td>First Name</td>
                    <td>Last Name</td>
                    <td>Username</td>
                    <td>email</td>
                    <td>DOB</td>
                    <td>Gender</td>
                    <td>Age</td>
                    { studentHeaders }
                </tr>
            </thead>
            <tbody>
                {items.map((item, ix) => {
                    const studentItems = isStudent
                        ? [
                            <td>{item.grade}</td>,
                            <td>{item.isLeader}</td>
                        ]
                        : null;
                    return <tr key={ix}>
                        <td>{item.user.firstName}</td>
                        <td>{item.user.lastName}</td>
                        <td>{item.user.username}</td>
                        <td>{item.user.email}</td>
                        <td>{item.user.dob}</td>
                        <td>{item.user.gender}</td>
                        <td>{item.user.age}</td>
                        {studentItems}
                    </tr>;
                })}
            </tbody>
        </table>
        <span className={printIcon} onClick={print}></span>
    </div>;
}
