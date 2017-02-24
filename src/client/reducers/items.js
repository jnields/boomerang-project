import {

    POST_ITEMS,
    POST_ITEMS_SUCCESS,
    POST_ITEMS_ERROR,

    GET_ITEMS,
    GET_ITEMS_SUCCESS,
    GET_ITEMS_ERROR,

    PATCH_ITEM,
    PATCH_ITEM_SUCCESS,
    PATCH_ITEM_ERROR,

    DELETE_ITEM,
    DELETE_ITEM_SUCCESS,
    DELETE_ITEM_ERROR,

    PARSE_SPREADSHEET,
    PARSE_SPREADSHEET_SUCCESS,
    PARSE_SPREADSHEET_ERROR
} from "../actions/types";

const initialState = {
    students: {
        items: [],
        unsavedItems: [],
        isPosting: false,
        isPatching: false,
        isDeleting: false,
        isGetting: false,
        error: null
    },
    teachers: {
        items: [],
        unsavedItems: [],
        isPosting: false,
        isPatching: false,
        isDeleting: false,
        isGetting: false,
        error: null
    }
};

export default function(state = initialState, action) {
    const { itemType, result, result: { status } } = action;
    switch (action.type) {
    //POST
    case POST_ITEMS:{
        if (itemType === "students") {
            return {
                ... state,
                students: {
                    ... state.students,
                    error: null,
                    posting: true
                }
            };
        } else {
            return {
                ... state,
                teachers: {
                    ... state.teachers,
                    error: null,
                    posting: true
                }
            };
        }
    }
    case POST_ITEMS_SUCCESS:{
        if (itemType === "students") {
            return {
                ... state,
                students: {
                    ... state.students,
                    items: [ ... state.students.items, ... result],
                    unsavedItems: [],
                    error: null,
                    posting: false
                }
            };
        } else {
            return {
                ... state,
                teachers: {
                    ... state.teachers,
                    items: [ ... state.teachers.items, ... result],
                    unsavedItems: [],
                    error: null,
                    posting: false
                }
            };
        }

    }
    case POST_ITEMS_ERROR: {
        let error;
        switch(status) {
        case 409:
            error = "Username is not available";
            break;
        default:
            error = "Something went wrong.";
        }
        if (itemType === "students") {
            return {
                ... state,
                students: {
                    ... state.students,
                    posting: false,
                    error
                }
            };
        } else {
            return {
                ... state,
                teachers: {
                    ... state.teachers,
                    posting: false,
                    error
                }
            };
        }
    }
    //GET
    case GET_ITEMS: {
        if (itemType === "students") {
            return {
                ... state,
                students: {
                    ... state.students,
                    getting: true,
                    items: [],
                    error: null
                }
            };
        } else {
            return {
                ... state,
                teachers: {
                    ... state.teachers,
                    getting: true,
                    items: [],
                    error: null
                }
            };
        }
    }
    case GET_ITEMS_SUCCESS:
        return {
            ... state,
            isGetting: false,
            getError: null,
            savedItems: action.response.data
        };
    case GET_ITEMS_ERROR:
        return {
            ... state,
            isGetting: false,
            getError: action.error
        };
    // PUT
    case PUT_ITEM:
        return{
            isPutting: true,
            putError: null
        };
    case PUT_ITEM_ERROR:
        return {
            isPutting: false,
            putError: action.error
        };
    case PUT_ITEM_SUCCESS:
        return {
            isPutting: false,
            putError: null
        };
    // DELETE
    case DELETE_ITEM:
        return {
            ... state,
            isDeleting: true,
            deleteError: null
        };
    case DELETE_ITEM_SUCCESS:
        return {
            ... state,
            isDeleting: false,
            deleteEror: null,
        };
    case DELETE_ITEM_ERROR:
        return {
            ... state,
            isDeleting : false,
            deleteError: action.error
        };
    // SPREADSHEET
    case PARSE_SPREADSHEET:
        return {
            ... state,
            error: null
        };
    case PARSE_SPREADSHEET_SUCCESS:
        return {
            ... state,
            error: null,
            unsavedItems: action.students
        };
    case PARSE_SPREADSHEET_ERROR:
        return {
            ... state,
            isFetching: false,
            isSaving: false,
            error: action.error,
            unsavedItems: []
        };
    }
    return state;
}
