import {
    AUTHORIZE,
    AUTHORIZE_SUCCESS,
    AUTHORIZE_ERROR,
    LOG_OUT
} from "./types";
import xhrError from "./xhr-error";
import { normalize } from "normalizr";
import { schema } from "../helpers";
import xhr from "xhr";
import { load } from "react-cookie";

export const logOut = () => {
    return {
        type: LOG_OUT
    };
};

export const authorize = ({username, password}) => dispatch => {
    dispatch({
        type: AUTHORIZE,
        username, password
    });
    xhr.get(
        "/api/login",
        {
            headers: {
                Authorization: "Basic " + btoa(`${username}:${password}`),
                "Content-Type": "application/json"
            }
        },
        (error, response) => {
            let body;
            try {
                if (response && response.body)
                    body = JSON.parse(response.body);
            }
            catch (e) { error = e; }
            if (error) {
                return dispatch(xhrError(AUTHORIZE, error));
            }
            if (response.statusCode < 400) {
                const normalizedUser = normalize(body, schema.user);

                let school = load("SCHOOL", true);
                try {
                    school = JSON.parse(school);
                    if (typeof(school) !== "object") school = null;
                } catch(e) {
                    school = null;
                }
                if (school == null) {
                    return dispatch({
                        type: AUTHORIZE_SUCCESS,
                        response,
                        user: normalizedUser.result,
                        school: null,
                        entities: {
                            users: normalizedUser.entities.users,
                        }
                    });
                }
                else {
                    const normalizedSchool = normalize(school, schema.school);
                    return dispatch({
                        type: AUTHORIZE_SUCCESS,
                        response,
                        user: normalizedUser.result,
                        school: normalizedSchool.result,
                        entities: {
                            users: normalizedUser.entities.users,
                            schools: normalizedSchool.entities.schools
                        }
                    });
                }

            }
            return dispatch({ type: AUTHORIZE_ERROR, response });
        }
    );
};
