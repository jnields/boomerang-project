import {
    POST_STUDENTS,
    POST_STUDENTS_SUCCESS,
    POST_STUDENTS_ERROR,

    GET_STUDENTS,
    GET_STUDENTS_SUCCESS,
    GET_STUDENTS_ERROR,

    PUT_STUDENT,
    PUT_STUDENT_SUCCESS,
    PUT_STUDENT_ERROR,

    DELETE_STUDENTS,
    DELETE_STUDENTS_SUCCESS,
    DELETE_STUDENTS_ERROR,

    PARSE_SPREADSHEET,
    PARSE_SPREADSHEET_SUCCESS,
    PARSE_SPREADSHEET_ERROR

} from "../actions/types";

export default function(state = {}, action) {
    switch (action.type) {
    //POST
    case POST_STUDENTS:
        return {
            ... state,
            isPosting: true,
            postError: null
        };
    case POST_STUDENTS_SUCCESS:
        return {
            ... state,
            isPosting: false,
            postError: null
        };
    case POST_STUDENTS_ERROR:
        return {
            ... state,
            isPosting: true,
            postError: action.error
        };
    //GET
    case GET_STUDENTS:
        return {
            ... state,
            isGetting: true,
            getError: null
        };
    case GET_STUDENTS_SUCCESS:
        return {
            ... state,
            isGetting: false,
            getError: null,
            savedItems: action.response.data
        };
    case GET_STUDENTS_ERROR:
        return {
            ... state,
            isGetting: false,
            getError: action.error
        };
    // PUT
    case PUT_STUDENT:
        return{
            isPutting: true,
            putError: null
        };
    case PUT_STUDENT_ERROR:
        return {
            isPutting: false,
            putError: action.error
        };
    case PUT_STUDENT_SUCCESS:
        return {
            isPutting: false,
            putError: null
        };
    // DELETE
    case DELETE_STUDENTS:
        return {
            ... state,
            isDeleting: true,
            deleteError: null
        };
    case DELETE_STUDENTS_SUCCESS:
        return {
            ... state,
            isDeleting: false,
            deleteEror: null,
        };
    case DELETE_STUDENTS_ERROR:
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
