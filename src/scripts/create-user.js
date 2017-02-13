import { User } from "../server/models";
let flag, password;
let user = {};

const fields = {
    "-u": "username",
    "-p": "password",
    "-e": "email",
    "-g": "gender",
    "-a": "age",
    "-dob": "dob",
    "-t": "tier",
    "-f": "firstName",
    "-l": "lastName"
};

process.argv.forEach((arg, ix) => {
    if (ix < 2) return;
    if (flag == null) {
        if (!(flag = fields[arg]))
            throw "Usage: create-user "
            + "-u [[username]] "
            + "-p [[password]] "
            + "-f [[firstName]] "
            + "-l [[lastName]] "
            + "-e [[email]] "
            + "-g [[gender]] "
            + "-a [[age]] "
            + "-dob [[dateOfBirth]] "
            + "-t  [[accessTier]]" ;
    } else {
        if (flag === "password") {
            password = arg;
        } else {
            user[flag] = arg;
        }
        flag = null;
    }
});
user.authMechanism = { type: "BASIC" };
user = User.build(
    user,
    { include: [{ association: User.AuthMechanism }] }
);

user.authMechanism.setPassword(password);
user.save().then(() => {
    console.log("USER CREATED");
    process.exit(0);
}, error => {
    console.log("ERROR");
    console.log(error);
    process.exit(1);
});
