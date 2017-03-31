import { normalize } from "normalizr";
import * as schemas from "../helpers/schema";
import { load } from "react-cookie";

let user = load("USER", true),
    school = load("SCHOOL", true);
try {
    user = JSON.parse(user);
    if (typeof(user) !== "object") user = null;
} catch(e) {
    user = null;
}
try {
    school = JSON.parse(school);
    if (typeof(school) !== "object") school = null;
} catch(e) {
    school = null;
}

let users = {}, schools = {};
if (user != null) {
    users = normalize(user, schemas.user).entities.users;
}
if (school != null) {
    schools = normalize(school, schemas.school).entities.schools;
}

const initialState = {
    users,
    schools,
    teachers: {},
    students: {}
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
