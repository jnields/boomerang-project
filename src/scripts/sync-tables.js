import orm from "../server/helpers/orm";
import { User } from "../server/models";
if (User == null)
    global.process.exit(-1);
orm.sync({force: true}).then(
    () => {
        console.log("SUCCESS");
    },
    () => {
        console.log("ERROR");
    }
);
