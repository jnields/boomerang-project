import {
    PARSE_SPREADSHEET,
    PARSE_SPREADSHEET_SUCCESS,
    PARSE_SPREADSHEET_ERROR
} from "./types";

import loadXlsx from "../helpers/load-xlsx";
export const parseSpreadsheet = (files, type) => dispatch => {
    dispatch({
        type: PARSE_SPREADSHEET,
        files,
        target: type
    });
    loadXlsx(files).then(
        results => {
            dispatch({
                type: PARSE_SPREADSHEET_SUCCESS,
                target: type,
                results
            });
        },
        error => {
            dispatch({
                type: PARSE_SPREADSHEET_ERROR,
                target: type,
                error
            });
        }
    );
};
