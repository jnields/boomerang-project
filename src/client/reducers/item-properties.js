const maxAge = 150,
    minAge = 1,
    now = new Date(),
    minDate = new Date(
        now.getFullYear() - maxAge,
        now.getMonth(),
        now.getDay()
    ),
    maxDate = new Date(
        now.getFullYear() - minAge,
        now.getMonth(),
        now.getDay()
    ),
    userProps = [
        {
            header: "First Name",
            type: "text",
            dataType: "string",
            regex: /first\s?name/i,
            setValue: (obj, value) => {
                (obj.user = obj.user || {}).firstName
                    = value;
            },
            getValue: (obj, patch = {}) => {
                patch = patch.user || {};
                obj = obj.user || {};
                return patch.firstName || obj.firstName;
            },
            onChange: (obj, value) => {
                return { user: { firstName: value } };
            },
            required: true,
            maxLength: 255,
        },
        {
            header: "Last Name",
            type: "text",
            dataType: "string",
            regex: /last\s?name/i,
            setValue: (obj, value) => {
                (obj.user = obj.user || {}).lastName
                    = value;
            },
            getValue: (obj, patch = {}) => {
                patch = patch.user || {};
                obj = obj.user || {};
                return patch.lastName || obj.lastName;
            },
            onChange: (obj, value) => {
                return { user: { lastName: value } };
            },
            required: true,
            maxLength: 255,
        },
        {
            header: "E\u2011Mail",
            type: "text",
            dataType: "string",
            regex: /e.?mail/i,
            getValue: (obj, patch = {}) => {
                patch = patch.user || {};
                obj = obj.user || {};
                return patch.email || obj.email;
            },
            setValue: (obj, value) => {
                (obj.user = obj.user || {}).email
                    = value;
            },
            onChange: (obj, value) => {
                return { user: { email: value } };
            },
            required: false,
            maxLength: 255
        },
        {
            header: "Gender",
            type: "select",
            dataType: "string",
            regex: /(gender|sex)/i,
            setValue: (obj, value) => {
                (obj.user = obj.user || {}).gender
                    = /m/i.test(value)
                        ? "M"
                        : /f/i.test(value)
                            ? "F"
                            : null;
            },
            getValue: (obj, patch = {}) => {
                patch = patch.user || {};
                obj = obj.user || {};
                return patch.gender || obj.gender;
            },
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
            dataType: "number",
            regex: /(age)/i,
            setValue: (obj, value) => {
                (obj.user = obj.user || {}).age
                    = value;
            },
            getValue: (obj, patch = {}) => {
                patch = patch.user || {};
                obj = obj.user || {};
                return patch.age || obj.age;
            },
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
            dataType: "date",
            regex: /(birthday|birth\s?date|dob|date\s?of\s?birth)/i,
            setValue: (obj, value) => {
                (obj.user = obj.user || {}).dob
                    = value;
            },
            getValue: (obj, patch = {}) => {
                patch = patch.user || {};
                obj = obj.user || {};
                return patch.dob || obj.dob;
            },
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
            dataType: "string",
            regex: /user(name)?/i,
            setValue: (obj, value) => {
                (obj.user = obj.user || {}).username
                    = value || null;
            },
            getValue: (obj, patch = {}) => {
                patch = patch.user || {};
                obj = obj.user || {};
                return patch.username || obj.username;
            },
            onChange: (obj, username) => {
                return { user: { username: username || null } };
            },
            required: false
        },
        {
            header: "Password",
            type: "password",
            dataType: "string",
            regex: /(password|pw|pass)/i,
            setValue: (obj, value) => {
                (obj.user = obj.user || {}).password
                    = value;
            },
            getValue: (obj, patch = {}) => {
                patch = patch.user || {};
                obj = obj.user || {};
                return patch.password || obj.password;
            },
            onChange: (obj, password) => {
                return { user: { password} };
            },
            required: false,
        }
    ],
    initialState = {
        students: [
            ... userProps,
            {
                header: "Group",
                dataType: "string",
                regex: /group/i,
                setValue: (obj, value) => {
                    obj.group = value;
                },
                getValue: (obj, patch = {}) => {
                    return patch.group || obj.group;
                },
                onChange: (obj, group) => {
                    return { group };
                },
                required: false,
                type: "text"
            },
            {
                header: "Grade",
                dataType: "number",
                regex: /grade/i,
                setValue: (obj, value) => {
                    obj.age = value >= 5 && value <= 12
                        ? value
                        : null;
                },
                getValue: (obj, patch = {}) => {
                    return patch.grade || obj.grade;
                },
                onChange: (obj, value) => {
                    if (value == "") value = null;
                    else { value = parseInt(value); }
                    return { grade: value };
                },
                required: false,
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
                dataType: "bool",
                regex: /(is)?\s?leader/i,
                setValue: (obj, value) => {
                    obj.isLeader = value ? true : false;
                },
                getValue: (obj, patch = {}) => {
                    const value = patch.isLeader === void 0
                        ? obj.isLeader
                        : patch.isLeader;
                    return value === true ? "Y" : value === false ? "N" : "";
                },
                onChange: (obj, value) => {
                    const isLeader = value  === "Y"
                        ? true
                        : value === "N"
                            ? false
                            : null;
                    return { isLeader };
                },
                required: false,
                type: "select",
                options: [
                    { value: "Y", display: "Y" },
                    { value: "N", display: "N" }
                ]
            }
        ],
        teachers: [
            ... userProps
        ],
        schools: [
            {
                header: "Name",
                type: "text",
                regex: /name/i,
                dataType:"string",
                setValue: (obj, value) => {
                    obj.name = value;
                },
                getValue: (obj, patch = {}) => {
                    return patch.name || obj.name;
                },
                onChange: (obj, name) => {
                    return { name };
                },
                maxLength: 255,
                required: true
            }
        ]
    };

export default function(state = initialState) {
    return state;
}
