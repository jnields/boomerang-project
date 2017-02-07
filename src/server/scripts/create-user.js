import User from "../models/user";

let flag, password;
let user = {};
process.argv.forEach(arg => {
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
        }
        flag = null;
    }
});
user = User.build(user);
user.setPassword(password);
user.save().then(success => {

}, error => {

});
