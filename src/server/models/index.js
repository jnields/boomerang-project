import Address from "./address";
import School from "./school";
import Student from "./student";
import User from "./user";
import Teacher from "./teacher";

export const SchoolAddresses = School.hasMany(Address, { as: "addresses" });
export const SchoolTeachers = School.hasMany(Teacher, { as: "teachers" });
export const SchoolStudents = School.hasMany(Student, { as: "students" });

export const StudentUser = Student.belongsTo(User);

export const TeacherSchool = Teacher.belongsTo(School);
export const TeacherUser = Teacher.belongsTo(User);



export { default as Address } from "./address";
export { default as School } from "./school";
export { default as Student } from "./student";
export { default as User } from "./user";
export { default as Teacher } from "./teacher";
