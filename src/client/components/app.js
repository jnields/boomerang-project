import React, { Component } from "react";
import styles from "../sass/app";
import bs from "../sass/bootstrap";
import ExcelParser from "../containers/excel-parser";
import StudentList from "../containers/student-list";

export default class App extends Component {
    render() {
        const classes = [
            styles.app,
            bs.container
        ].join(" ");
        return <div className={classes}>
            <ExcelParser />
            <StudentList />
        </div>;
    }
}
