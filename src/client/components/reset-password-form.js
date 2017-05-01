import React, { PropTypes, Component } from "react";
import { Link } from "react-router";

export default class ResetPasswordForm extends Component {
    
    static get propTypes() {        
        return {
            onSubmit: PropTypes.func.isRequired
        };
    }    
    
    constructor(props) {
        super(props);
        this.state = {
            email: ""
        };
    }
    
    render() {
        return <form onSubmit={e => {
            e.preventDefault();
            this.props.onSubmit(this.state.email);
        }}>
            <h2>Lost Password</h2>
            <aside>Follow these steps to recover your password</aside>
            <ol>
                <li>Enter your registered e-mail address</li>
                <li>Wait for a recovery email</li>
                <li>Follow instructions to reset your password</li>
            </ol>
            <div>
                <input type="text" 
                    placeholder="your e-mail"
                    value={this.state.email}                    
                    onChange={({target:{value}}) => {
                        this.setState({email: value});
                    }}/>
                <button type="submit">Get New Password</button>
            </div>
            <Link to="/login">Login</Link>
        </form>;
    }
}
