import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import styles from "../sass/app";
import bs from "../sass/bootstrap";
import { Link } from "react-router";
import { logOut } from "../actions/authorization";

class App extends Component {

    static get propTypes() {
        return {
            logOut: PropTypes.func.isRequired,
            authorized: PropTypes.bool.isRequired,
            children: PropTypes.node
        };
    }

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }

    componentDidMount() {
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
            <Link className={styles.logOut}
                onClick={this.props.logOut}
                to="/login"/>
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
    { logOut }
)(App);
