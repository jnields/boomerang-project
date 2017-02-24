import {    
    GET_SCHOOLS,
    GET_SCHOOLS_SUCCESS,
    GET_SCHOOLS_ERROR,

    POST_SCHOOLS,
    POST_SCHOOLS_SUCCESS,
    POST_SCHOOLS_ERROR,

    PATCH_SCHOOL,
    PATCH_SCHOOL_SUCCESS,
    PATCH_SCHOOL_ERROR,

    DELETE_SCHOOL,
    DELETE_SCHOOL_SUCCESS,
    DELETE_SCHOOL_ERROR,

    SELECT_SCHOOL
} from "./types";

import { getQuery, schema } from "../helpers";
import { normalize } from "normalizr";
import fetchError from "./fetch-error";

const credentials = "include",
    headers = new Headers({"Content-Type": "application/json"});

export function selectSchool(id) {
    return {
        type: SELECT_SCHOOL,
        id
    };
}

export const getSchools = (params, dispatcher) => dispatch => {
    dispatch({
        type: GET_SCHOOLS,
        limit: params.$limit,
        offset: params.$offset,
        dispatcher
    });
    fetch(`/api/schools${getQuery(params)}`, { credentials })
    .then(
        response => {
            const { ok, body } = response;
            if (ok) {
                const normalized = normalize(body, schema.school);
                dispatch({
                    type: GET_SCHOOLS_SUCCESS,
                    dispatcher,
                    response,
                    ... normalized
                });
            } else {
                dispatch({
                    type: GET_SCHOOLS_ERROR,
                    dispatcher,
                    response
                });
            }
        },
        dispatch.bind(null, fetchError(GET_SCHOOLS, dispatcher))
    );
};

export const postSchool = (schools, dispatcher) => dispatch => {
    dispatch({
        type: POST_SCHOOLS,
        dispatcher,
        schools
    });
    fetch(
        "/api/schools",
        {
            method: "POST",
            credentials,
            headers,
            body: schools,
        }
    )
    .then(
        response => {
            const { body, ok } = response;
            if (ok) {
                const normalized = normalize(body, schema.school);
                dispatch({
                    type: POST_SCHOOLS_SUCCESS,
                    dispatcher,
                    response,
                    ... normalized
                });
            } else {
                dispatch({
                    type: POST_SCHOOLS_ERROR,
                    dispatcher,
                    response
                });
            }
        },
        dispatch.bind(null, fetchError(POST_SCHOOLS, dispatcher))
    );
};

export const patchSchool = (id, patch, dispatcher) => dispatch => {
    dispatch({
        type: PATCH_SCHOOL,
        id,
        patch,
        dispatcher
    });
    fetch(
        `/api/schools/${id}`,
        {
            method: "PATCH",
            headers,
            credentials,
            body: patch
        }
    )
    .then(
        response => {
            const { ok, body } = response;
            if (ok) {
                const normalized = normalize(body, schema.school);
                dispatch({
                    type: PATCH_SCHOOL_SUCCESS,
                    response,
                    dispatcher,
                    ... normalized
                });
            } else {
                dispatch({
                    type: PATCH_SCHOOL_ERROR,
                    dispatcher,
                    response
                });
            }
        },
        dispatch.bind(null, fetchError(PATCH_SCHOOL, dispatcher))
    );
};

export const deleteSchool = (id, dispatcher) => dispatch => {
    dispatch({
        type: DELETE_SCHOOL,
        id,
        dispatcher
    });
    fetch(
        `/api/schools/${id}`,
        {
            method: "DELETE",
            credentials
        }
    ).then(
        response => {
            if (response.ok) {
                const schools = {};
                // remove school from normalized entries
                schools[id] = void 0;
                dispatch({
                    type: DELETE_SCHOOL_SUCCESS,
                    entities: { schools },
                    dispatcher
                });
            } else {
                dispatch({
                    type: DELETE_SCHOOL_ERROR,
                    dispatcher,
                    response
                });
            }
        },
        dispatch.bind(null, fetchError(DELETE_SCHOOL, dispatcher))
    );
};
