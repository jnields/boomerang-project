import {

    SUBMIT_PATCH,
    SUBMIT_DELETE,
    ADD_UNSAVED_ITEMS,
    SELECT_SCHOOL,
    REVERT_CHANGES,
    TOGGLE_EDIT,
    SAVE_CHANGES,

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
    DELETE_ITEM_ERROR,

    PARSE_SPREADSHEET,
    PARSE_SPREADSHEET_SUCCESS,
    PARSE_SPREADSHEET_ERROR

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

export const saveChanges =
(type, unsavedItems, unsavedPatches, unsavedDeletes, schoolId) =>
dispatch => {
    const ps = [];
    dispatch({type: SAVE_CHANGES, itemType: type, status: "STARTED"});
    unsavedItems = Object.keys(unsavedItems)
        .map(key=>unsavedItems[key]);
    ps.push(postItems(type, unsavedItems, schoolId)(dispatch));
    Object.keys(unsavedDeletes).forEach(key => {
        const doDelete = parseInt(key) > 0 && unsavedDeletes[key];
        if (!doDelete) return;
        ps.push(deleteItem(type, key, schoolId)(dispatch));
    });
    Object.keys(unsavedPatches).forEach(key=> {
        const patch = unsavedPatches[key];
        if (!patch) return;
        ps.push(patchItem(type, key, patch, schoolId)(dispatch));
    });
    Promise.all(ps).then(
        () => {
            dispatch({type: SAVE_CHANGES, itemType: type, status: "COMPLETE"});
        },
        () => {
            dispatch({
                type: SAVE_CHANGES,
                itemType: type,
                status: "ERROR"
            });
        }
    );
};

export const getTeachersAndStudents = () => dispatch => {
    return Promise.all([
        getItems("teachers", {})(dispatch),
        getItems("students", {})(dispatch)
    ]);
};

export const getSchools = () => dispatch => {
    return getItems("schools", {})(dispatch);
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

export const submitDelete = (itemType, id) => {
    return {
        type: SUBMIT_DELETE,
        itemType,
        id
    };
};

export const toggleEdit = (itemType,value) => {
    return {
        type: TOGGLE_EDIT,
        itemType,
        value
    };
};

export const revertChanges = (itemType) => {
    return {
        type: REVERT_CHANGES,
        itemType
    };
};

export const selectSchool = (schoolId) =>  dispatch => {
    dispatch({
        type: SELECT_SCHOOL,
        schoolId
    });
    if (schoolId == null) {
        dispatch({
            type: GET_ITEMS_SUCCESS,
            itemType: "teachers",
            response: {},
            result: []
        });
        dispatch({
            type: GET_ITEMS_SUCCESS,
            itemType: "students",
            response: {},
            result: []
        });
        return Promise.resolve();
    } else {
        return Promise.all([
            getItems("students", {}, schoolId)(dispatch),
            getItems("teachers", {}, schoolId)(dispatch)
        ]);
    }
};

export const submitPatch = (itemType, id, patch) => {
    return {
        type: SUBMIT_PATCH,
        itemType, id, patch
    };
};

export const addUnsavedItems = (itemType, items) => {
    return {
        type: ADD_UNSAVED_ITEMS,
        itemType,
        items
    };
};

export const postItems = (itemType, items, schoolId) => dispatch => {
    const entity = getEntity(itemType);
    dispatch({
        type: POST_ITEMS,
        itemType,
        items,
        schoolId
    });
    const promises = [];
    items.forEach(item => {
        item = { ... item };
        const id = item.id;
        delete item.id;
        promises.push(new Promise((resolve, reject) => {
            xhr.post(
                "/api/" +
                    (schoolId === void 0 ? "" : `schools/${schoolId}/`) +
                    itemType,
                {
                    headers,
                    credentials,
                    body: JSON.stringify(item)
                },
                (error, response) => {
                    let body;
                    try {
                        if (response && response.body)
                            body = JSON.parse(response.body);
                    }
                    catch (e) { error = e; }
                    if (error) {
                        reject(dispatch(
                            xhrError(
                                POST_ITEMS,
                                { item, id, itemType, schoolId }
                            )
                        ));
                    }
                    if (response.statusCode < 400) {
                        const normalized = normalize(body, entity);
                        resolve(dispatch({
                            type: POST_ITEM_SUCCESS,
                            item,
                            id,
                            itemType,
                            schoolId,
                            response,
                            ... normalized
                        }));
                    } else {
                        reject(dispatch({
                            type: POST_ITEM_ERROR,
                            item,
                            id,
                            itemType,
                            schoolId,
                            response
                        }));
                    }
                }
            );
        }));
    });
    return Promise.all(promises);
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
    return new Promise((resolve, reject) => {
        lastGet[itemType] && lastGet[itemType].abort();
        lastGet[itemType] = xhr.get(
            "/api/" +
                (schoolId === void 0 ? "" : `schools/${schoolId}/`) +
                itemType +
                getQuery(params),
            (error, response) => {
                lastGet[itemType] = null;
                let body;
                try {
                    if (response && response.body)
                        body = JSON.parse(response.body);
                }
                catch (e) { error = e; }
                if (error) {
                    reject(dispatch(
                        xhrError(
                            GET_ITEMS,
                            { itemType, params, schoolId }
                        )
                    ));
                } else {
                    const { statusCode } = response;
                    if (statusCode < 400) {
                        const normalized = normalize(body, [entity]);
                        resolve(dispatch({
                            type: GET_ITEMS_SUCCESS,
                            itemType,
                            schoolId,
                            response,
                            ... normalized
                        }));
                    } else {
                        reject(dispatch({
                            type: GET_ITEMS_ERROR,
                            itemType,
                            schoolId,
                            response
                        }));
                    }
                }
            }
        );
    });
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

    return lastPatch[itemType][id] =
    Promise.resolve(lastPatch[itemType][id])
    .then(() => getPromise(), () => getPromise());


    function getPromise() {
        return new Promise((resolve, reject) => {
            xhr.patch(
                "/api/" +
                    (schoolId === void 0 ? "" : `schools/${schoolId}/`) +
                    itemType + "/" +
                    id,
                {
                    method: "PATCH",
                    headers,
                    credentials,
                    body: JSON.stringify(patch)
                },
                (error, response) => {
                    let body;
                    try {
                        if (response && response.body)
                            body = JSON.parse(response.body);
                    }
                    catch (e) { error = e; }

                    if (error) {
                        reject(dispatch(
                            xhrError(
                                PATCH_ITEM,
                                { patch, itemType, id, schoolId}
                            )
                        ));
                    }

                    const { statusCode } = response;
                    if (statusCode < 400) {
                        const normalized = normalize(body, entity);
                        resolve(dispatch({
                            type: PATCH_ITEM_SUCCESS,
                            response,
                            id,
                            patch,
                            itemType,
                            ... normalized
                        }));
                    } else {
                        reject(dispatch({
                            type: PATCH_ITEM_ERROR,
                            schoolId,
                            itemType,
                            id,
                            patch,
                            response,
                        }));
                    }
                }
            );
        });
    }
};

export const deleteItem =
(itemType, id, schoolId) =>
dispatch => {
    dispatch({ type: DELETE_ITEM, schoolId, itemType, id });
    return new Promise((resolve, reject) => {
        xhr.del(
            "/api/" +
                (schoolId === void 0 ? "" : `schools/${schoolId}/`) +
                itemType + "/" +
                id,
            {
                method: "DELETE",
                credentials,
                headers
            },
            (error, response) => {
                if (error) {
                    reject(dispatch(xhrError(
                        DELETE_ITEM,
                        {
                            itemType,
                            id,
                            schoolId
                        }
                    )));
                }
                if (response.statusCode < 400) {
                    const entities = {};
                    entities[itemType] = {};
                    entities[itemType][id] = void 0;
                    resolve(dispatch({
                        type: DELETE_ITEM_SUCCESS,
                        id,
                        itemType,
                        schoolId,
                        response,
                        entities
                    }));
                } else {
                    reject(dispatch({
                        type: DELETE_ITEM_ERROR,
                        schoolId,
                        itemType,
                        id,
                        response
                    }));
                }
            }
        );
    });
};


import loadXlsx from "../helpers/load-xlsx";

export const parseFiles = (itemType, properties, files) => dispatch => {
    dispatch({
        type: PARSE_SPREADSHEET,
        itemType,
        files
    });
    return loadXlsx(properties, files).then(
        items => {
            dispatch({
                type: PARSE_SPREADSHEET_SUCCESS,
                itemType,
                items
            });
        },
        error => {
            dispatch({
                type: PARSE_SPREADSHEET_ERROR,
                itemType,
                error
            });
        }
    );
};
