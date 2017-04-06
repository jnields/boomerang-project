import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import styles from "../sass/app";
import bs from "../sass/bootstrap";
import NavBar from "../containers/nav-bar";

class App extends Component {

    static get propTypes() {
        return {
            authorized: PropTypes.bool.isRequired,
            children: PropTypes.node
        };
    }

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }

    componentWillMount() {
        if (!this.props.authorized) {
            this.context.router.push("/login");
        }
    }

    render() {
        const classes = [
            styles.app,
            bs.container
        ].join(" ");
        return <div className={classes}>
            <NavBar />
            {this.props.children}
        </div>;
    }
}

export default connect(
    state => {
        return {
            authorized: state.authorization.authorized
        };
    },
    null
)(App);
