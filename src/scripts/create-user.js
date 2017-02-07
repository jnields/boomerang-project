import User from "../server/models/user";

let flag, password;
let user = {};
console.log("args:", global.process.argv.length);
global.process.argv.forEach((arg, ix) => {
    console.log("arg:", arg);
    console.log("ix:", ix);
    if (ix < 2) return;
    if (flag == null) {
        switch(arg) {
        case "-u":
        case "-p":
        case "-e":
            flag = arg;
            break;
        default:
            throw "Usage: create-user -u [[username]] -p [[password]] -e [[email]]";
        }
    } else {
        switch(flag) {
        case "-u":
            user.username = arg;
            break;
        case "-p":
            password = arg;
            break;
        case "-e":
            user.email = arg;
            break;
        default:
            throw "Usage: create-user -u [[username]] -p [[password]] -e [[email]]";
        }
        flag = null;
    }
});
console.log(user);
user = User.build(user);
user.setPassword(password);
user.save().then(saved => {
    console.log("User successfully saved!");
    console.log(saved);
}, error => {
    console.log("ERROR");
    console.log(error);
});
