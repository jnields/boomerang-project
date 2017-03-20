import Home from "../components/home";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import * as entities from "../helpers/schema";
import { 
    getItems,
    postItems,
    patchItem,
    deleteItem
} from "../actions/items";
import { parseSpreadsheet } from "../actions/spreadsheet";

function selectItems(state, type) {

    const schema = (() => {switch(type) {
    case "students": return entities.student;
    case "teachers": return entities.teacher;
    case "schools": return entities.school;
    }})();

    return denormalize(
        state.items[type].items,
        [schema],
        state.entities        
    ).map(item => {
        return {
            ... item,
            ... (state.items[type].pendingPatches[item.id] || {}),
            ... (state.items[type].unsavedPatches[item.id] || {})
        };
    });
    
}

export default connect(
    state => {
        return {
            user: state.authorization.user,
            schoolId: state.authorization.schoolId,
            
            schools: selectItems(state, "schools"),
            teachers: selectItems(state, "teachers"),
            students: selectItems(state, "students"),
            
            isPosting: (type, obj) => {
                return state.items[type].pendingPosts.indexOf(obj) > -1;
            },
            isPatching: (type, obj) => {
                return state.items[type].pendingPatches[obj.id] !== void 0;
            },
            isDeleting: (type, obj) => {
                return state.items[type].pendingDeletes[obj.it] !== void 0;
            },
            
            parsingSchools: state.items.schools.isParsing,
            parsingTeachers: state.items.teachers.isParsing,
            parsingStudents: state.items.students.isParsing,

            unsavedSchools: state.items.schools.unsavedItems,
            unsavedTeachers: state.items.teachers.unsavedItems,
            unsavedStudents: state.items.students.unsavedItems,

            loadingSchools: state.items.schools.isGetting,
            loadingStudents: state.items.students.isGetting,
            loadingTeachers: state.items.teachers.isGetting,
            
            schoolParseError: state.items.schools.spreadsheetError,
            teacherParseError: state.items.teachers.spreadsheetError,
            studentParseError: state.items.students.spreadsheetError,
            
            schoolGetError: state.items.schools.getError,
            teacherGetError: state.items.teachers.getError,
            studentGetError: state.items.students.getError
        };
    },
    dispatch => {
        return {
            selectSchool: school => {
                dispatch(getItems("teachers", {}, school.id));
                dispatch(getItems("students", {}, school.id));
            },
            parseFiles: (type, files) => {
                dispatch(parseSpreadsheet(type,files));
            },
            saveChanges: (type, unsavedItems, unsavedPatches, schoolId) => {
                dispatch(postItems(type, unsavedItems, schoolId));
                Object.keys(unsavedPatches).forEach(key=> {
                    const patch = unsavedPatches[key];
                    if (!patch) return;
                    dispatch(patchItem(type, key, patch, schoolId));
                });
            },
        };
    }
)(Home);
