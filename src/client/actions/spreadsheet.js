import {
    PARSE_SPREADSHEET,
    PARSE_SPREADSHEET_SUCCESS,
    PARSE_SPREADSHEET_ERROR
} from "./types";

import loadXlsx from "../helpers/load-xlsx";
export const parseSpreadsheet = (type, files) => dispatch => {
    dispatch({
        type: PARSE_SPREADSHEET,
        target: type,
        files
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
