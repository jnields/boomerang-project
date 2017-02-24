import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import styles from "../sass/app";
import bs from "../sass/bootstrap";
import ExcelParser from "../containers/excel-parser";
import StudentList from "../containers/student-list";
import { Link } from "react-router";
import { logOut } from "../actions";

class App extends Component {

    static get contextTypes() {
        return {
            router: PropTypes.func.isRequired
        };
    }

    componentDidMount() {
        if (!localStorage.getItem("user")) {
            this.context.router.push("/login");
        }
    }
    render() {
        const classes = [
            styles.app,
            bs.container
        ].join(" ");
        return <div className={classes}>
            <ExcelParser />
            <StudentList />
            <Link class={styles.logOut}
                onClick={this.props.logOut}
                to="/login"/>
        </div>;
    }
}

export default connect(null, { logOut })(App);
