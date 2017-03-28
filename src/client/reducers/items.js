import {

    SUBMIT_PATCH,
    SUBMIT_DELETE,
    SAVE_CHANGES,
    ADD_UNSAVED_ITEMS,
    SELECT_SCHOOL,
    REVERT_CHANGES,
    TOGGLE_EDIT,
    GENERATE_GROUPS,

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
import patchRecursive from "../helpers/patch-recursive";
// add action for update pendingPatches...
// update unsavedPatches to
// push update without saving.

const initialItemState = {
        editing: false,
        anyChanges: false,
        selectedItem: null,
        items: [],
        unsavedPatches: {},
        unsavedItems: {},
        unsavedDeletes: {},

        pendingPatches: {},
        pendingDeletes: {},
        pendingPosts: {},

        isGetting: false,
        getError: null,
        isParsing: false,
        spreadsheetError: null,
        saving: false,
        saveError: null,
        errors: {
            patches: {},
            posts: {},
            deletes: {}
        }
    },
    initialState = {
        lastUnsavedId: 0,
        students: initialItemState,
        teachers: initialItemState,
        schools: initialItemState
    };


export default function(state = initialState, action) {
    const { itemType, result, response } = action;
    switch (action.type) {
    case SAVE_CHANGES: {
        switch(action.status) {
        case "COMPLETE":
            return {
                ... state,
                [itemType]: {
                    ... state[itemType],
                    saving: false,
                    anyChanges: false,
                    groupsAssigned: false,
                    saveError: null
                }
            };
        case "ERROR":
            return {
                ... state,
                [itemType]: {
                    ... state[itemType],
                    saving: false,
                    saveError: "Not all changes saved."
                }
            };
        case "STARTED":
            return {
                ... state,
                [itemType]: {
                    ... state[itemType],
                    editing: false,
                    saving: true,
                }
            };
        default:
            throw new Error("Unhandled: ", action.status);
        }
    }
    case GENERATE_GROUPS: {
        return {
            ... state,
            students: {
                ... state.students,
                groupsAssigned: true,
                anyChanges: true,
                unsavedPatches: patchRecursive(
                    state.students.unsavedPatches,
                    action.patches
                )
            }
        };
    }
    case TOGGLE_EDIT: {
        const editing = action.value === void 0
            ? !state[itemType].editing
            : action.value;
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                editing
            }
        };
    }
    case SUBMIT_DELETE: {
        if (action.id > 0) {
            return {
                ... state,
                [itemType]: {
                    ... state[itemType],
                    anyChanges: true,
                    unsavedDeletes: {
                        ... state[itemType].unsavedDeletes,
                        [action.id]: true
                    }
                }
            };
        } else {
            const unsavedItems = { ... state[itemType].unsavedItems };
            delete unsavedItems[action.id];
            return {
                ... state,
                [itemType]: {
                    ... state[itemType],
                    unsavedItems
                }
            };
        }
    }
    case REVERT_CHANGES: {
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                anyChanges: false,
                editing: false,
                groupsAssigned: false,
                unsavedItems: {},
                unsavedPatches: {},
                unsavedDeletes: {},
                errors: initialItemState.errors
            }
        };
    }
    case SELECT_SCHOOL: {
        return {
            ... state,
            schools: {
                ... state.schools,
                selectedItem: action.schoolId
            },
            students: initialItemState,
            teachers: initialItemState
        };
    }
    case SUBMIT_PATCH: {
        const changes = {...state[itemType].errors.patches};
        delete changes[action.id];
        if (action.id > 0) {
            return {
                ...state,
                [itemType]: {
                    ... state[itemType],
                    anyChanges: true,
                    unsavedPatches: {
                        ... state[itemType].unsavedPatches,
                        [action.id]: patchRecursive(
                            state[itemType].unsavedPatches[action.id],
                            action.patch,
                        )
                    },
                    errors: {
                        ... state[itemType].errors,
                        patches: changes
                    },
                    saveError: null
                }
            };
        } else {
            return {
                ...state,
                [itemType]: {
                    ... state[itemType],
                    anyChanges: true,
                    unsavedItems: {
                        ... state[itemType].unsavedItems,
                        [action.id]: patchRecursive(
                            state[itemType].unsavedItems[action.id],
                            action.patch
                        )
                    },
                    errors: {
                        ... state[itemType].errors,
                        posts: changes
                    },
                    saveError: null
                }
            };
        }
    }
    case ADD_UNSAVED_ITEMS: {
        const unsavedItems = {
            ... state[itemType].unsavedItems
        };
        action.items.forEach((item,ix) => {
            const id = state.lastUnsavedId - ix - 1;
            unsavedItems[id] = {
                ... item,
                id
            };
        });

        return {
            ... state,
            lastUnsavedId: state.lastUnsavedId - action.items.length,
            [itemType]: {
                ...state[itemType],
                anyChanges: true,
                unsavedItems
            }
        };
    }
    //POST
    case POST_ITEMS: {
        const pendingPosts = {
            ... state[itemType].pendingPosts
        };
        const posts = {
            ... state[itemType].errors.posts
        };
        action.items.forEach(item => {
            pendingPosts[item.id] = true;
            delete posts[item.id];
        });
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingPosts,
                errors: {
                    ... state[itemType].errors,
                    posts
                }
            }
        };
    }
    case POST_ITEM_SUCCESS: {
        const pendingPosts = {...state[itemType].pendingPosts},
            unsavedItems = { ... state[itemType].unsavedItems },
            posts = { ... state[itemType].errors.posts };
        delete pendingPosts[action.id];
        delete unsavedItems[action.id];
        delete posts[action.id];

        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingPosts,
                unsavedItems,
                items: [ ... state[itemType].items, result],
                errors: {
                    ... state[itemType].errors,
                    posts
                }
            }
        };
    }
    case POST_ITEM_ERROR: {
        let error;
        switch(response.statusCode) {
        case 409:
            error = "Username is not available";
            break;
        default:
            error = "Something went wrong.";
        }
        const pendingPosts = { ... state[itemType].pendingPosts };

        delete pendingPosts[action.id];
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingPosts,
                errors: {
                    ... state[itemType].errors,
                    posts: {
                        ... state[itemType].errors.posts,
                        [action.id]: error
                    }
                }
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
                getError: action.error,
                items: []
            }
        };
    // PUT
    case PATCH_ITEM: {
        const patches = {
            ... state[itemType].errors
        };
        delete patches[action.id];
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingPatches: {
                    ... state[itemType].pendingPatches,
                    [action.id]: action.patch
                },
                errors: {
                    ... state[itemType].errors,
                    patches
                }
            }
        };
    }
    case PATCH_ITEM_ERROR: {
        let error;
        switch(response.statusCode) {
        case 409:
            error = "Username is not available";
            break;
        default:
            error = "Something went wrong.";
        }
        const pendingPatches = {... state[itemType].pendingPatches};
        delete pendingPatches[action.id];
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingPatches,
                errors: {
                    ... state[itemType].errors,
                    patches: {
                        ... state[itemType].errors.patches,
                        [action.id]: error
                    }
                }
            }
        };
    }
    case PATCH_ITEM_SUCCESS: {
        const pendingPatches = {
                ... state[itemType].pendingPatches
            },
            unsavedPatches = {
                ... state[itemType].unsavedPatches
            },
            patches = {
                ...state[itemType].errors.patches
            };
        delete pendingPatches[action.id];
        delete unsavedPatches[action.id];
        delete patches[action.id];

        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                unsavedPatches,
                pendingPatches,
                errors: {
                    ... state[itemType].errors,
                    patches
                }
            }
        };

    }
    // DELETE
    case DELETE_ITEM: {
        const deletes = {
            ... state[itemType].errors.deletes
        };
        delete deletes[action.id];
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingDeletes: {
                    ... state[itemType].deletes,
                    [action.id]: true
                },
                errors: {
                    ... state[itemType].errors,
                    deletes
                }
            }
        };
    }
    case DELETE_ITEM_SUCCESS: {
        const items = state[itemType].items.slice();
        items.splice(items.indexOf(parseInt(action.id)), 1);
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                items,
                pendingDeletes: {
                    ... state[itemType].pendingDeletes,
                    [action.id]: false
                }
            }
        };
    }
    case DELETE_ITEM_ERROR: {
        const error = "Something went wrong";
        const deletes = {
            ... state[itemType].errors.deletes,
            [action.id]: error
        };
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                pendingDeletes: {
                    ... state[itemType].pendingDeletes,
                    [action.id]: action.error
                },
                errors: {
                    ... state[itemType].errors,
                    deletes
                }
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
                parseError: null
            }
        };
    case PARSE_SPREADSHEET_SUCCESS: {
        const unsavedItems = {
            ... state[itemType].unsavedItems
        };
        action.items.forEach((item,ix) => {
            const id = state.lastUnsavedId - ix - 1;
            unsavedItems[id] = {
                ... item,
                id
            };
        });
        return {
            ... state,
            lastUnsavedId: state.lastUnsavedId - action.items.length,
            [itemType]: {
                ... state[itemType],
                anyChanges: true,
                parsingSpreadsheet: false,
                unsavedItems
            },
        };
    }

    case PARSE_SPREADSHEET_ERROR: {
        const parseError = action.error.message.startsWith("Unsupported file")
            ? "Unsupported file type"
            : "Unable to parse file";
        return {
            ... state,
            [itemType]: {
                ... state[itemType],
                parsingSpreadsheet: false,
                parseError
            }
        };
    }
    default:
        return state;
    }
}
