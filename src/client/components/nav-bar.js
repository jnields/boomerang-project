import React, { PropTypes } from "react";
import styles from "../sass/nav-bar";
import bs from "../sass/bootstrap";
import { Link } from "react-router";
import { denormalize } from "normalizr";
import * as schemas from "../helpers/schema";

const {
    shape,
    bool,
    object,
    number
} = PropTypes;

NavBar.propTypes = {
    logOut: PropTypes.func.isRequired,
    authorization: shape({
        authorized: bool.isRequired,
        user: number
    }).isRequired,
    entities: object.isRequired
};
export default function NavBar(props) {
    return <div className={styles.default}>
        {getUser(props)}
    </div>;

    function getUser({logOut, entities, authorization: {user}}) {
        if(user == null) return null;
        user = denormalize(user, schemas.user, entities);
        const {firstName, lastName} = user;
        return <div>
            <div className={styles.floatRight}>
                <span className={[bs.glyphicon, bs.glyphiconUser,styles.userIcon].join(" ")}></span>
                <span className={styles.name}>
                    {`${firstName || ""} ${lastName || ""}`}
                </span>
                <Link className={styles.logOut}
                        onClick={logOut}
                        to="/login">
                    Log Out
                </Link>
            </div>
        </div>;

    }
}
