import React, { PropTypes, Component } from "react";

export default class Login extends Component {

    static get propTypes() {
        return {
            authorize: PropTypes.func.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        const { username, password } = this.state;
        this.props.authorize({ username, password });
    }

    render() {
        return <form onSubmit={this.handleSubmit.bind(this)}>
            <label>
                Username:
                <input type="text"
                    onChange={({ target: {value} }) => {
                        this.setState({username: value});
                    }}/>
            </label>
            <label>
                Password:
                <input type="password"
                    onChange={({target: {value}}) => {
                        this.setState({password: value});
                    }}/>
            </label>
        </form>;
    }
}
