import {
    AUTHORIZE,
    AUTHORIZE_SUCCESS,
    AUTHORIZE_ERROR,
    LOG_OUT,
    LOG_OUT_SUCCESS,
    LOG_OUT_ERROR
} from "./types";
import xhrError from "./xhr-error";
import { normalize } from "normalizr";
import schema from "../helpers/schema";
import xhr from "xhr";

function encodeUtf8(str) {
    return btoa(
        encodeURIComponent(str)
        .replace(
            /%([0-9A-F]{2})/g,
            function(match, code) {
                return String.fromCharCode("0x" + code);
            }
        )
    );
}

export const logOut = () => dispatch => {
    dispatch({
        type: LOG_OUT
    });
    xhr.get(
        "/api/logout",
        { withCredentials: true },
        (error, response) => {
            if (error) {
                return dispatch(xhrError(LOG_OUT, error));
            }
            const { statusCode } = (response || {});
            if (statusCode < 400) {
                dispatch({type: LOG_OUT_SUCCESS});
            } else {
                dispatch({type: LOG_OUT_ERROR});
            }

        }
    );
};

export const authorize = ({username, password}) => dispatch => {
    dispatch({
        type: AUTHORIZE,
        username, password
    });
    xhr.get(
        "/api/login",
        {
            json: true,
            withCredentials: true,
            headers: {
                Authorization: "Basic " + encodeUtf8(`${username}:${password}`),
            }
        },
        (error, response) => {
            const { body } = (response || {});
            if (error) {
                return dispatch(xhrError(AUTHORIZE, error));
            }
            if (response.statusCode < 400) {

                const school = body.school;
                delete body.school;
                const normalizedUser = normalize(body, schema.user);

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
