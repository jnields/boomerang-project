import React, { PropTypes, Component } from "react";
import ItemList from "../components/item-list";
const maxAge = 150, 
    minAge = 1,
    now = new Date(),
    minDate = new Date(
        now.getYear() - maxAge,
        now.getMonth(),
        now.getDay()
    ),
    maxDate = new Date(
        now.getYear - minAge,
        now.getMonth(),
        now.getDay()
    ),
    studentProps = [
        {
            header: "First Name",
            type: "text",
            getValue: obj => obj.user.firstName,
            onChange: (obj, value) => {
                return { user: { firstName: value } };
            },
            required: true,
            maxLen: 255,
        },
        {
            header: "Last Name",
            type: "text",
            getValue: obj => obj.user.lastName,
            onChange: (obj, value) => {
                return { user: { lastName: value } };
            },
            required: true,
            maxLen: 255,
        },
        {
            header: "E-Mail",
            type: "text",
            getValue: obj => obj.user.email,
            onChange: (obj, value) => {
                return { user: { email: value } };
            },
            required: false,
            maxLen: 255
        },
        {
            header: "Gender",
            type: "select",
            getValue: obj => obj.user.gender,
            onChange: (obj, value) => {
                return { user: { gender: value } };
            },
            required: false,
            options: [
                { display: "F", value: "F" },
                { display: "M", value: "M" }
            ]
        },
        {
            header: "Age",
            type: "number",
            getValue: obj => obj.user.age, 
            onChange: (obj, age) => {
                return { user: { age }};
            },
            required: false,
            min: minAge,
            max: maxAge
        },
        {
            header: "Birthday",
            type: "date",
            getValue: obj => obj.user.dob,
            onChange: (obj, dob) => {
                return { user: { dob } };
            },
            required: false,
            min: minDate,
            max: maxDate
        },
        {
            header: "Username",
            type: "text",
            getValue: obj => obj.user.username,
            onChange: (obj, username) => {
                return { user: { username } };
            },
            required: false
        },
        {
            header: "Password",
            type: "text",
            getValue: obj => obj.user.password,
            onChange: (obj, password) => {
                return { user: { password} };
            },
            required: false,
        },
        {
            header: "Grade",
            getValue: obj => obj.grade,
            onChange: (obj, value) => {
                if (value == "") value = null;
                else { value = parseInt(value); }
                return { grade: value };
            },
            required: true,            
            type: "select",
            options: (() => {
                const result = [];
                for (let i = 5; i < 13; i++) {
                    result.push({
                        value: i + "",
                        display: i + ""
                    });
                }
                return result;
            })()
        },
        {
            header: "Leader",
            getValue: obj => obj.isLeader ? "Y" : "N",
            onChange: (obj, value) => {
                const isLeader = value  === "Y" 
                    ? true 
                    : value === "N" 
                        ? false
                        : null;
                return { isLeader };
            },
            required: true,
            type: "select",
            options: [
                { value: "Y", display: "Y" },
                { value: "N", display: "N" }
            ]
        }
    ],
    teacherProps = [
        {
            header: "First Name",
            type: "text",
            getValue: obj => obj.user.firstName,
            onChange: (obj, value) => {
                return { user: { firstName: value } };
            },
            required: true,
            maxLen: 255,
        },
        {
            header: "Last Name",
            type: "text",
            getValue: obj => obj.user.lastName,
            onChange: (obj, value) => {
                return { user: { lastName: value } };
            },
            required: true,
            maxLen: 255,
        },
        {
            header: "E-Mail",
            type: "text",
            getValue: obj => obj.user.email,
            onChange: (obj, value) => {
                return { user: { email: value } };
            },
            required: false,
            maxLen: 255
        },
        {
            header: "Gender",
            type: "select",
            getValue: obj => obj.user.gender,
            onChange: (obj, value) => {
                return { user: { gender: value } };
            },
            required: false,
            options: [
                { display: "F", value: "F" },
                { display: "M", value: "M" }
            ]
        },
        {
            header: "Age",
            type: "number",
            getValue: obj => obj.user.age, 
            onChange: (obj, age) => {
                return { user: { age }};
            },
            required: false,
            min: minAge,
            max: maxAge
        },
        {
            header: "Birthday",
            type: "date",
            getValue: obj => obj.user.dob,
            onChange: (obj, dob) => {
                return { user: { dob } };
            },
            required: false,
            min: minDate,
            max: maxDate
        },
        {
            header: "Username",
            type: "text",
            getValue: obj => obj.user.username,
            onChange: (obj, username) => {
                return { user: { username } };
            },
            required: false
        },
        {
            header: "Password",
            type: "text",
            getValue: obj => obj.user.password,
            onChange: (obj, password) => {
                return { user: { password} };
            },
            required: false,
        }        
    ],
    schoolProps = [
        {
            header: "Name",
            type: "text",
            getValue: obj => obj.name,
            maxLen: 255,
            required: true
        }
    ];


export default class Home extends Component {

    static get propTypes() {
        const {
            object, number, func, bool, arrayOf, string
        } = PropTypes;
        return {
            user: object.isRequired,
            schoolId: number,
            
            schools: arrayOf(object).isRequired,
            teachers: arrayOf(object).isRequired,
            students: arrayOf(object).isRequired,
            
            isPosting: func.isRequired,
            isPatching: func.isRequired,
            isDeleting: func.isRequired,
            
            parsingSchools: bool.isRequired,
            parsingStudents: bool.isRequired,
            parsingTeachers: bool.isRequired,
            
            selectSchool: func.isRequired,
            
            unsavedSchools: arrayOf(object).isRequired,
            unsavedStudents: arrayOf(object).isRequired,
            unsavedTeachers: arrayOf(object).isRequired,
            
            loadingSchools: bool.isRequired,
            loadingStudents: bool.isRequired,
            loadingTeachers: bool.isRequired,
            
            parseFiles: func.isRequired,
            saveChanges: func.isRequired,            
            
            schoolParseError: string,
            teacherParseError: string,
            studentParseError: string,
            
            schoolGetError: string,
            teacherGetError: string,
            studentGetError: string,
            
            saveUnsavedItems: func.isRequired,
            
        };
    }
    
    static get contextTypes() {        
        return {
            router: PropTypes.object.isRequired
        };
    }
    
    constructor(props) {
        super(props);
    }
    
    render() { 
        const { 
            user: { firstName, lastName },
            
            schools,
            teachers,
            students,
            
            isPosting,
            isPatching,
            isDeleting,
            
            parsingSchools,
            parsingStudents,
            parsingTeachers,

            selectSchool,

            unsavedSchools,
            unsavedStudents,
            unsavedTeachers,
            
            loadingSchools,
            loadingStudents,
            loadingTeachers,
            
            parseFiles,
            saveChanges,
            saveUnsavedItems,
            
            schoolParseError,
            teacherParseError,
            studentParseError,
            
            schoolGetError,
            teacherGetError,
            studentGetError
        } = this.props;
        
        return <div>
            Welcome, {firstName} {lastName}.
            <ItemList 
                itemType="schools"
                items={schools}
                onItemSelect={selectSchool}
                unsavedItems={unsavedSchools}
                properties={schoolProps} 
                isPosting={isPosting.bind(null, "schools")}
                isPatching={isPatching.bind(null, "schools")}
                isDeleting={isDeleting.bind(null, "schools")}
                isParsing={parsingSchools}
                isGetting={loadingSchools}
                parseFiles={parseFiles.bind(null, "schools")}
                saveChanges={saveChanges.bind(null, "schools")}
                saveUnsavedItems={saveUnsavedItems.bind(null, "schools")}
                parseError={schoolParseError}
                getError={schoolGetError} />
                
            <ItemList 
                itemType="teachers"
                items={teachers}
                // onItemSelect={selectTeacher}
                unsavedItems={unsavedTeachers}
                properties={teacherProps} 
                isPosting={isPosting.bind(null, "teachers")}
                isPatching={isPatching.bind(null, "teachers")}
                isDeleting={isDeleting.bind(null, "teachers")}
                isParsing={parsingTeachers}
                isGetting={loadingTeachers}
                parseFiles={parseFiles.bind(null, "teachers")}
                saveChanges={saveChanges.bind(null, "teachers")}
                saveUnsavedItems={saveUnsavedItems.bind(null, "teachers")}
                parseError={teacherParseError}
                getError={teacherGetError} />

            <ItemList 
                itemType="students"
                items={students}
                // onItemSelect={selectStudent}
                unsavedItems={unsavedStudents}
                properties={studentProps} 
                isPosting={isPosting.bind(null, "students")}
                isPatching={isPatching.bind(null, "students")}
                isDeleting={isDeleting.bind(null, "students")}
                isParsing={parsingStudents}
                isGetting={loadingStudents}
                parseFiles={parseFiles.bind(null, "students")}
                saveChanges={saveChanges.bind(null, "students")}
                saveUnsavedItems={saveUnsavedItems.bind(null, "students")}
                parseError={studentParseError}
                getError={studentGetError} />
        </div>;
    }
}
