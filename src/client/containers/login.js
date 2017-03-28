import { connect } from "react-redux";
import Login from "../components/login";
import { authorize } from "../actions/authorization";

export default connect(
    state => {
        return {
            user: state.authorization.user,
            authorized: state.authorization.authorized,
            authorizing: state.authorization.authorizing,
            invalidAttempt: state.authorization.invalidAttempt
        };
    },
    { authorize }
)(Login);
