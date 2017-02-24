import {

    GET_ITEMS,
    GET_ITEMS_SUCCESS,
    GET_ITEMS_ERROR,

    POST_ITEMS,
    POST_ITEMS_SUCCESS,
    POST_ITEMS_ERROR,

    PATCH_ITEM,
    PATCH_ITEM_SUCCESS,
    PATCH_ITEM_ERROR,

    DELETE_ITEM,
    DELETE_ITEM_SUCCESS,
    DELETE_ITEM_ERROR

} from "./types";
import fetchError from "./fetch-error";
import getQuery from "../helpers/get-query";
import xhr from "xhr";
import { schema } from "../helpers";
import { normalize } from "normalizr";

const credentials = "include",
    headers = new Headers({
        "Content-Type": "application/json"
    });

function getEntity(type) {
    switch (type) {
    case "students":
        return schema.student;
    case "teachers":
        return schema.teacher;
    }
    throw "Invalid type";
}

let lastPost = {};
export const postType = (schoolId, itemType, items, dispatcher) => dispatch => {
    const entity = getEntity(itemType);
    dispatch({
        type: POST_ITEMS,
        schoolId,
        itemType,
        items,
        dispatcher
    });
    lastPost[itemType] = Promise.resolve(lastPost[itemType]).then(() => {
        return fetch(
            `/api/schools/${schoolId}/${itemType}`,
            {
                method: "POST",
                headers,
                credentials,
                body: items
            }
        ).then(
            response => {
                const { ok, body } = response;
                if (ok) {
                    const normalized = normalize(body, entity);
                    dispatch({
                        type: POST_ITEMS_SUCCESS,
                        schoolId,
                        itemType,
                        response,
                        dispatcher,
                        ... normalized
                    });
                } else {
                    dispatch({
                        type: POST_ITEMS_ERROR,
                        schoolId,
                        itemType,
                        items,
                        dispatcher,
                        response
                    });
                }
            },
            dispatch.bind(null, fetchError(POST_ITEMS, dispatcher))
        );
    });
};

let lastGet = { };
export const getType = (schoolId, itemType, params, dispatcher) => dispatch => {
    const entity = getEntity(itemType);
    dispatch({
        type: GET_ITEMS,
        schoolId,
        itemType,
        params,
        dispatcher
    });
    lastGet[itemType] && lastGet[itemType].abort();
    lastGet[itemType] = xhr.get(
        `/api/schools/${schoolId}/${itemType}${getQuery(params)}`,
        (error, response) => {
            lastGet[itemType] = null;
            if (error) {
                dispatch(fetchError(GET_ITEMS, dispatcher));
            } else {
                const { statusCode, body } = response;
                if (200 <= statusCode && statusCode < 400) {
                    const normalized = normalize(body, entity);
                    dispatch({
                        type: GET_ITEMS_SUCCESS,
                        schoolId,
                        itemType,
                        dispatcher,
                        response,
                        ... normalized
                    });
                } else {
                    dispatch({
                        type: GET_ITEMS_ERROR,
                        schoolId,
                        itemType,
                        dispatcher,
                        response
                    });
                }
            }
        }
    );
};

let lastPatch = {
    students: {},
    teachers: {}
};
export const patchItem = (schoolId, itemType, id, patch, dispatcher) => dispatch => {
    const entity = getEntity(itemType);
    dispatch({type: PATCH_ITEM, schoolId, itemType, id, patch, dispatcher});
    lastPatch[itemType][id] = Promise.resolve(lastPatch[itemType][id]).then(() => {
        return fetch(
            `/api/schools/${schoolId}/${itemType}/${id}`,
            {
                method: "PATCH",
                headers,
                credentials,
                body: patch
            }
        ).then(
            response => {
                const { ok, body } = response;
                if (ok) {
                    const normalized = normalize(body, entity);
                    dispatch({
                        type: PATCH_ITEM_SUCCESS,
                        response,
                        itemType,
                        dispatcher,
                        ... normalized
                    });
                } else {
                    dispatch({
                        type: PATCH_ITEM_ERROR,
                        schoolId,
                        itemType,
                        id,
                        patch,
                        response,
                        dispatcher
                    });
                }
            },
            dispatch.bind(null, fetchError(PATCH_ITEM, dispatcher))
        );
    });
};

let lastDelete = {
    students: {},
    teachers: {}
};
export const deleteItem = (schoolId, itemType, id, dispatcher) => dispatch => {
    dispatch({ type: DELETE_ITEM, schoolId, itemType, id, dispatcher });
    lastDelete[itemType][id] = Promise.resolve(lastDelete[itemType][id])
    .then(() => {
        return fetch(
            `/api/schools/${schoolId}/${itemType}/${id}`,
            {
                method: "DELETE",
                credentials,
                headers
            }
        ).then(
            response => {
                if (response.ok) {
                    const entities = {};
                    entities[itemType] = {};
                    entities[itemType][id] = void 0;
                    dispatch({
                        type: DELETE_ITEM_SUCCESS,
                        schoolId,
                        itemType,
                        id,
                        dispatcher,
                        response,
                        entities
                    });
                } else {
                    dispatch({
                        type: DELETE_ITEM_ERROR,
                        schoolId,
                        itemType,
                        id,
                        dispatcher,
                        response
                    });
                }
            },
            dispatch.bind(null, fetchError(DELETE_ITEM, dispatcher))
        );
    });
};
