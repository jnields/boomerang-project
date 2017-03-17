import { connect } from "react-redux";
import Login from "../components/login";
import { authorize } from "../actions";

export default connect(
    null,
    { authorize }
)(Login);
