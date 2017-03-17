import {

    GET_ITEMS,
    GET_ITEMS_SUCCESS,
    GET_ITEMS_ERROR,

    POST_ITEMS,
    POST_ITEM_SUCCESS,
    POST_ITEM_ERROR,

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
import fetch from "node-fetch";

const credentials = "include",
    headers = {
        "Content-Type": "application/json"
    };

function getEntity(type) {
    switch (type) {
    case "schools":
        return schema.school;
    case "students":
        return schema.student;
    case "teachers":
        return schema.teacher;
    }
    throw "Invalid type";
}

export const postType = (itemType, items, schoolId) => dispatch => {
    const entity = getEntity(itemType);
    dispatch({
        type: POST_ITEMS,
        itemType,
        items,
        schoolId
    });
    items.forEach(item => {
        fetch(
            "/api/schools"
                + itemType === "schools"
                    ? ""
                    : `/${schoolId}/${itemType}`,
            {
                method: "POST",
                headers,
                credentials,
                body: item
            }
        ).then(
            response => {
                const { ok, body } = response;
                if (ok) {
                    const normalized = normalize(body, entity);
                    dispatch({
                        type: POST_ITEM_SUCCESS,
                        item,
                        itemType,
                        schoolId,
                        response,
                        ... normalized
                    });
                } else {
                    dispatch({
                        type: POST_ITEM_ERROR,
                        item,
                        itemType,
                        schoolId,
                        response
                    });
                }
            },
            dispatch.bind(null, fetchError(POST_ITEMS, item))
        );
    });
};

let lastGet = { };
export const getType = (itemType, params, schoolId) => dispatch => {
    const entity = getEntity(itemType);
    dispatch({
        type: GET_ITEMS,
        itemType,
        params,
        schoolId
    });
    lastGet[itemType] && lastGet[itemType].abort();
    lastGet[itemType] = xhr.get(
        "/api/schools"
            + itemType === "schools"
                ? ""
                : `/${schoolId}/${itemType}`
            + getQuery(params),
        (error, response) => {
            lastGet[itemType] = null;
            if (error) {
                dispatch(
                    fetchError(
                        GET_ITEMS,
                        { itemType, params, schoolId }
                    )
                );
            } else {
                const { statusCode, body } = response;
                if (200 <= statusCode && statusCode < 400) {
                    const normalized = normalize(body, entity);
                    dispatch({
                        type: GET_ITEMS_SUCCESS,
                        itemType,
                        schoolId,
                        response,
                        ... normalized
                    });
                } else {
                    dispatch({
                        type: GET_ITEMS_ERROR,
                        itemType,
                        schoolId,
                        response
                    });
                }
            }
        }
    );
};

let lastPatch = {
    schools: {},
    students: {},
    teachers: {}
};
export const patchItem =
(itemType, id, patch, schoolId) => dispatch => {

    const entity = getEntity(itemType);
    dispatch({type: PATCH_ITEM, schoolId, itemType, id, patch});

    lastPatch[itemType][id] =
    Promise.resolve(lastPatch[itemType][id])
    .then(() => {
        return fetch(
            "/api/schools/"
                + itemType === "schools"
                    ? ""
                    : `${schoolId}/${itemType}/`
                + id,
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
                    });
                }
            },
            dispatch.bind(
                null,
                fetchError(
                    PATCH_ITEM,
                    {itemType, id, patch, schoolId}
                )
            )
        );
    });
};

export const deleteItem =
(itemType, id, schoolId) =>
dispatch => {
    dispatch({ type: DELETE_ITEM, schoolId, itemType, id });
    fetch(
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
                    response,
                    entities
                });
            } else {
                dispatch({
                    type: DELETE_ITEM_ERROR,
                    schoolId,
                    itemType,
                    id,
                    response
                });
            }
        },
        dispatch.bind(
            null,
            fetchError(
                DELETE_ITEM,
                {
                    itemType,
                    id,
                    schoolId
                }
            )
        )
    );
};
