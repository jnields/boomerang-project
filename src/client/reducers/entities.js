import { normalize } from "normalizr";
import { user } from "../helpers/schema";
import { load } from "react-cookie";

const loggedInUser = load("USER");
let users = {};
if (loggedInUser !== void 0) {
    users = normalize(loggedInUser, user).entities.users;
}

const initialState = {
    users,
    teachers: {},
    students: {},
    schools: {}
};


export default function entities(state = initialState, action) {
    if (action.entities) {
        const result = {};
        Object.keys(state).forEach(key => {
            result[key] = {
                ...state[key],
                ...action.entities[key]
            };
        });
        return result;
    }
    return state;
}
