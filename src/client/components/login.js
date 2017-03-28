import React, { PropTypes, Component } from "react";
import bs from "../sass/bootstrap";
import styles from "../sass/login";
import createGuid from "../helpers/create-guid";

export default class Login extends Component {

    static get propTypes() {
        return {
            authorize: PropTypes.func.isRequired,
            authorized: PropTypes.bool.isRequired,
            authorizing: PropTypes.bool.isRequired,
            invalidAttempt: PropTypes.bool.isRequired
        };
    }

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.authorized && nextProps.authorized) {
            this.context.router.push("/");
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const { username, password } = this.state;
        this.props.authorize({ username, password });
    }

    getError() {
        if (this.props.invalidAttempt)
            return <div className={[bs.textDanger, bs.helpBlock].join(" ")}>
                Invalid username or password
            </div>;
        return null;
    }

    render() {
        const unId = createGuid(),
            pwId = createGuid();

        return <div className={styles.default}>
            <h2>Please Log in to Contine</h2>
            <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className={styles.formGroup}>
                        <label className={[bs.controlLabel].join(" ")} htmlFor={unId}>
                            Username:
                        </label>
                        <input id={unId}
                            className={[bs.formControl,bs.colSm10].join(" ")}
                            type="text"
                            onChange={({ target: {value} }) => {
                                this.setState({username: value});
                            }}/>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={[bs.controlLabel].join(" ")} htmlFor={pwId}>
                            Password:
                        </label>
                        <input id={pwId}
                            type="password"
                            className={[bs.formControl].join(" ")}
                            onChange={({target: {value}}) => {
                                this.setState({password: value});
                            }}/>
                    </div>
                    <div className={[bs.formGroup].join(" ")}>
                        <button className={[bs.btn, bs.btnDefault].join(" ")}
                                type="submit">
                            Submit
                        </button>
                    </div>
                    {this.getError()}
                </form>
        </div>;
    }
}
