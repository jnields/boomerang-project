import {
    AUTHORIZE,
    AUTHORIZE_SUCCESS,
    AUTHORIZE_ERROR,
    LOG_OUT
} from "./types";
import fetchError from "./fetch-error";
import { normalize } from "normalizr";
import { schema } from "../helpers";

export const logOut = () => {
    return {
        type: LOG_OUT
    };
};

export const authorize = (username, password) => dispatch => {
    dispatch({
        type: AUTHORIZE,
        username, password
    });
    fetch(
        "/api/login",
        {
            headers: {
                Authorization: "Basic" + btoa(`${username}:${password}`)
            }
        }
    ).then(
        response => {
            if (response.ok) {
                const normalized = normalize(response.body, schema.user);
                dispatch({
                    type: AUTHORIZE_SUCCESS,
                    response,
                    ... normalized
                });
            }
            else {
                dispatch({ type: AUTHORIZE_ERROR, response });
            }
        },
        dispatch.bind(null, fetchError(AUTHORIZE))
    );
};
