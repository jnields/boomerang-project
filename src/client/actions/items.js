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
import xhrError from "./xhr-error";
import getQuery from "../helpers/get-query";
import xhr from "xhr";
import { schema } from "../helpers";
import { normalize } from "normalizr";

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

export const postItem = (itemType, items, schoolId) => dispatch => {
    const entity = getEntity(itemType);
    dispatch({
        type: POST_ITEMS,
        itemType,
        items,
        schoolId
    });
    items.forEach(item => {
        xhr.post(
            "/api/schools"
                + itemType === "schools"
                    ? ""
                    : `/${schoolId}/${itemType}`,
            {
                headers,
                credentials,
                body: item
            },
            (error, response) => {
                let body;
                try {
                    if (response && response.body)
                        body = JSON.parse(response.body);
                }
                catch (e) { error = e; }
                if (error) 
                    return dispatch(
                        xhrError(
                            POST_ITEMS, 
                            { item, itemType, schoolId }
                        )
                    );
                    
                if (response.status < 400) {
                    const normalized = normalize(body, entity);
                    return dispatch({
                        type: POST_ITEM_SUCCESS,
                        item,
                        itemType,
                        schoolId,
                        response,
                        ... normalized
                    });
                } else {
                    return dispatch({
                        type: POST_ITEM_ERROR,
                        item,
                        itemType,
                        schoolId,
                        response
                    });
                }
            }
        );
    });
};

let lastGet = { };
export const getItems = (itemType, params, schoolId) => dispatch => {
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
            let body;
            try {
                if (response && response.body)
                    body = JSON.parse(response.body);
            }
            catch (e) { error = e; }
            if (error) {
                dispatch(
                    xhrError(
                        GET_ITEMS,
                        { itemType, params, schoolId }
                    )
                );
            } else {
                const { statusCode } = response;
                if (statusCode < 400) {
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
        return xhr.patch(
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
            (error, response) => {
                let body;
                try {
                    if (response && response.body)
                        body = JSON.parse(response.body);
                }
                catch (e) { error = e; }

                if (error) {
                    return dispatch(
                        xhrError(
                            PATCH_ITEM, 
                            { patch, itemType, id, schoolId}
                        )
                    );
                }

                const { statusCode } = response;
                if (statusCode < 400) {
                    const normalized = normalize(body, entity);
                    return dispatch({
                        type: PATCH_ITEM_SUCCESS,
                        response,
                        itemType,
                        ... normalized
                    });
                } else {
                    return dispatch({
                        type: PATCH_ITEM_ERROR,
                        schoolId,
                        itemType,
                        id,
                        patch,
                        response,
                    });
                }
            }
        );        
    });
};

export const deleteItem =
(itemType, id, schoolId) =>
dispatch => {
    dispatch({ type: DELETE_ITEM, schoolId, itemType, id });
    xhr.delete(
        "/api/schools/"
            + itemType === "schools"
                ? ""
                : `${schoolId}/${itemType}/`
            + id,
        {
            method: "DELETE",
            credentials,
            headers
        }
    ).then(
        (error, response) => {
            if (error) {
                return dispatch(xhrError(
                    DELETE_ITEM,
                    {
                        itemType,
                        id,
                        schoolId
                    }
                ));                
            }
            if (response.statusCode < 400) {
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
        }
    );
};
