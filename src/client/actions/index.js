import xhr from "xhr";
import {

    GET_STUDENTS,
    GET_STUDENTS_SUCCESS,
    GET_STUDENTS_ERROR,

    POST_STUDENTS,
    POST_STUDENTS_SUCCESS,
    POST_STUDENTS_ERROR,

    PUT_STUDENT,
    PUT_STUDENT_SUCCESS,
    PUT_STUDENT_ERROR,

    PATCH_STUDENT,
    PATCH_STUDENT_SUCCESS,
    PATCH_STUDENT_ERROR,

    DELETE_STUDENTS,
    DELETE_STUDENTS_SUCCESS,
    DELETE_STUDENTS_ERROR,

    PARSE_SPREADSHEET,
    PARSE_SPREADSHEET_SUCCESS,
    PARSE_SPREADSHEET_ERROR

} from "./types";
import loadXlsx from "../helpers/load-xlsx";
let lastGetStudentsXhr;
const apiBase = "";
function getStudentsEndpoint(method, params) {
    let queryParams;
    switch(method) {
    case "POST":
        return `${apiBase}/students`;
    case "GET":
        queryParams  = [];
        Object.keys(params).forEach(key => {
            if (!Array.isArray(params[key])) {
                params[key] = [params[key]];
            }
            [].push.apply(
                queryParams,
                params[key].map(
                    param =>
                        encodeURIComponent(key)
                        + "=" + encodeURIComponent(param))
            );
        });
        return `${apiBase}/students?${queryParams.join("&")}`;
    case "PUT":
        return `${apiBase}/students/${encodeURIComponent(params.id)}`;
    case "DELETE":
        queryParams = params.map(student => {
            return `id=${encodeURIComponent(student.id)}`;
        }).join("&");
        return `${apiBase}/students?${queryParams}`;
    }
}

export const postStudents = (students) => (dispatch) => {
    dispatch({
        type: POST_STUDENTS,
        students
    });
    xhr.post(
        getStudentsEndpoint("POST"),
        { json: true, body: students },
        (error, response) => {
            if (error) {
                dispatch({
                    type: POST_STUDENTS_ERROR,
                    error,
                    response
                });
            } else {
                dispatch({
                    type: POST_STUDENTS_SUCCESS,
                    response
                });
            }
        }
    );
};

export const getStudents = params => dispatch => {
    dispatch({
        type: GET_STUDENTS,
        params
    });
    lastGetStudentsXhr && lastGetStudentsXhr.abort();
    lastGetStudentsXhr = xhr.get(
        getStudentsEndpoint("GET", params),
        (error, response) => {
            lastGetStudentsXhr = null;
            if (error) {
                dispatch({
                    type: GET_STUDENTS_ERROR,
                    error,
                    response
                });
            } else {
                dispatch({
                    type: GET_STUDENTS_SUCCESS,
                    response
                });
            }
        }
    );
};

export const putStudent = student => dispatch => {
    dispatch({ type: PUT_STUDENT, student });
    xhr.put(
        getStudentsEndpoint("PUT", student),
        { json: true, body: student },
        (error, response) => {
            if (error) {
                dispatch({
                    type: PUT_STUDENT_ERROR,
                    error,
                    response
                });
            } else {
                dispatch({
                    type: PUT_STUDENT_SUCCESS,
                    response
                });
            }
        }
    );
};

export const patchStudent = (student, patch) => dispatch => {
    dispatch({type: PATCH_STUDENT, student, patch});
    xhr.patch(
        getStudentsEndpoint("PATCH", student, patch),
        {json: true, body: patch },
        (error, response) => {
            if (error) {
                dispatch({
                    type: PATCH_STUDENT_ERROR,
                    response,
                    error
                });
            } else {
                dispatch({
                    type: PATCH_STUDENT_SUCCESS,
                    response
                });
            }
        }
    );
};

export const deleteStudent = students => dispatch => {
    dispatch({ type: DELETE_STUDENTS, students });
    xhr.delete(
        getStudentsEndpoint("DELETE"),
        (error, response) => {
            if (error) {
                dispatch({
                    type: DELETE_STUDENTS_ERROR,
                    error,
                    response
                });
            } else {
                dispatch({
                    type: DELETE_STUDENTS_SUCCESS,
                    response
                });
            }
        }
    );
};

export const parseSpreadsheet = files => dispatch => {
    dispatch({
        type: PARSE_SPREADSHEET,
        files
    });
    loadXlsx(files).then(
        students => {
            dispatch({
                type: PARSE_SPREADSHEET_SUCCESS,
                students
            });
        },
        error => {
            dispatch({
                type: PARSE_SPREADSHEET_ERROR,
                error
            });
        }
    );
};
