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

// add action for update pendingPatches... 
// update unsavedPatches to 
// push update without saving.

const initialState = {
    students: {
        items: [],
        unsavedPatches: {},
        unsavedItems: [],
        unsavedDeletes: {},

        pendingPatches: {},
        pendingDeletes: [],
        pendingPosts: [],

        isGetting: false,
        getError: null,
        isParsing: false,
        spreadsheetError: null
    },
    teachers: {
        items: [],
        unsavedPatches: {},
        unsavedItems: [],
        unsavedDeletes: {},

        pendingPatches: {},
        pendingDeletes: [],
        pendingPosts: [],
        isGetting: false,
        getError: null,
        isParsing: false,
        spreadsheetError: null
    },
    schools: {
        items: [],
        unsavedPatches: {},
        unsavedItems: [],
        unsavedDeletes: {},
    
        pendingPatches: {},
        pendingDeletes: [],
        pendingPosts: [],
    
        isGetting: false,
        getError: null,

        isParsing: false,    
        spreadsheetError: null        
        
    }
};

export default function(state = initialState, action) {
    const { itemType, result, response } = action;
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
                pendingPosts,
                items: [ ... state[itemType].items, result]
            }
        };
    }
    case POST_ITEM_ERROR: {
        let error;
        switch(response.status) {
        case 409:
            error = "Username is not available";
            break;
        default:
            error = "Something went wrong.";
        }
        const pendingPosts = state[itemType].pendingPosts.slice(),
            ix = pendingPosts.indexOf(action.item);

        pendingPosts[ix] = { ... pendingPosts[ix], error };
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingPosts
            }
        };
    }
    //GET
    case GET_ITEMS: {
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                isGetting: true,
                items: []
            }
        };
    }
    case GET_ITEMS_SUCCESS: {
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                isGetting: false,
                items: action.result
            }
        };
    }
    case GET_ITEMS_ERROR:
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                isGetting: false,
                items: []
            }
        };
    // PUT
    case PATCH_ITEM:
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingPatches: {
                    ... state[itemType].pendingPatches,
                    [action.id]: action.patch
                }
            }
        };
    case PATCH_ITEM_ERROR: {
        let error;
        switch(response.status) {
        case 409:
            error = "Username is not available";
            break;
        default:
            error = "Something went wrong.";
        }
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingPatches: {
                    ... state[itemType].pendingPatches,
                    [action.id]: {
                        ... action.patch,
                        error
                    }
                }
            }
        };
    }
    case PATCH_ITEM_SUCCESS:
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingPatches: {
                    ... state[itemType].pendingPatches,
                    [action.id]: void 0
                }
            }
        };
    // DELETE
    case DELETE_ITEM:
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingDeletes: [
                    ... state[itemType].deletes,
                    action.id
                ]
            }
        };
    case DELETE_ITEM_SUCCESS: {
        const pendingDeletes = state[itemType].pendingDeletes.slice(),
            items = state[itemType].items.slice();
        pendingDeletes.splice(pendingDeletes.indexOf(action.id),1);
        items.splice(items.indexOf(action.id), 1);
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                items,
                pendingDeletes
            }
        };
    }
    case DELETE_ITEM_ERROR: {
        const pendingDeletes = state[itemType].pendingDeletes.slice();
        pendingDeletes.splice(pendingDeletes.indexOf(action.id),1);
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingDeletes
            }
        };
    }
    // SPREADSHEET
    case PARSE_SPREADSHEET:
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                parsingSpreadsheet: true,
                spreadsheetError: null
            }
        };
    case PARSE_SPREADSHEET_SUCCESS:
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                parsingSpreadsheet: false,
                unsavedItems: [
                    ... state[itemType].unsavedItems,
                    action.items
                ]
            },
        };
    case PARSE_SPREADSHEET_ERROR:
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                parsingSpreadsheet: false,
                spreadsheetError: action.error
            }
        };
    default:
        return state;
    }
}
