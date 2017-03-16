import {

    POST_ITEMS,
    POST_ITEM_SUCCESS,
    POST_ITEM_ERROR,

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
        pendingPatches: {},
        pendingDeletes: [],
        pendingPosts: [],
        unsavedItems: [],
        isGetting: false,
        getError: null
    },
    teachers: {
        items: [],
        pendingPatches: {},
        pendingDeletes: [],
        unsavedItems: [],
        pendingPosts: [],
        isGetting: false,
        getError: null
    },
    schools: {
        items: [],
        pendingPatches: {},
        pendingDeletes: [],
        unsavedItems: [],
        pendingPosts: [],
        isGetting: false,
        getError: null        
    }
};

export default function(state = initialState, action) {
    const { itemType, result, result: { status } } = action;
    switch (action.type) {
    //POST
    case POST_ITEMS:
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingPosts: [ 
                    ... state[itemType].pendingPosts,
                    ... action.items
                ]
            }
        };
    case POST_ITEM_SUCCESS: {
        const pendingPosts = state[itemType].pendingPosts.slice();
        pendingPosts.splice(pendingPosts.indexOf(action.item), 1);
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingPosts
            }
        };
    }     
    case POST_ITEM_ERROR: {
        let error;
        switch(status) {
        case 409:
            error = "Username is not available";
            break;
        default:
            error = "Something went wrong.";
        }
    }
    //GET
    case GET_ITEMS: {
    }
    case GET_ITEMS_SUCCESS:
    case GET_ITEMS_ERROR:
    // PUT
    case PATCH_ITEM:
    case PATCH_ITEM_ERROR:
    case PATCH_ITEM_SUCCESS:
    // DELETE
    case DELETE_ITEM:
    case DELETE_ITEM_SUCCESS:
    case DELETE_ITEM_ERROR:
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
    default:
        return state;
    }
}
