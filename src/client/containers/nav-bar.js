import { logOut } from "../actions/authorization";
import { connect } from "react-redux";
import NavBar from "../components/nav-bar";


export default connect(
    state => {
        return {
            authorization: state.authorization,
            entities: state.entities
        };
    },
    { logOut }
)(NavBar);
