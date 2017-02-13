import AuthMechanism from "./auth-mechanism";
//import Address from "./address";
import School from "./school";
import Student from "./student";
import User from "./user";
import Teacher from "./teacher";

// const noNull = {
//     foreignKey: { allowNull: false }
// };
// define associations on Model objects, configure as read-only properties
([
    //[School, "Addresses", School.hasMany(Address)],
    [School, "Teachers", School.hasMany(Teacher, { onDelete: "CASCADE" })],
    [School, "Students", School.hasMany(Student, { onDelete: "CASCADE" })],

    [Student, "User", Student.hasOne(User, { onDelete: "CASCADE" })],
    [Student, "School", Student.belongsTo(School)],

    [Teacher, "User", Teacher.hasOne(User, { onDelete: "CASCADE" })],
    [Teacher, "School", Teacher.belongsTo(School)],

    [User, "AuthMechanism", User.hasOne(AuthMechanism, { onDelete: "CASCADE" })]

]).forEach(arr => {
    Object.defineProperty(arr[0], arr[1], {
        value: arr[2],
        writable: false
    });
});

export { default as Address } from "./address";
export { default as School } from "./school";
export { default as Student } from "./student";
export { default as User } from "./user";
export { default as Teacher } from "./teacher";
export { default as AuthMechanism } from "./auth-mechanism";
