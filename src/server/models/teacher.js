import orm from "../helpers/orm";
import user from "./user";
import school from "./school";

const Teacher = orm.define(
    "teacher",
    {
    },
    {
        validate: {
            tier2: function() {
                const ur = this.getUser();
                if (ur.tier !== "2")
                    throw new Error("Teacher's user is the incorrect tier.");
            }
        }
    });
export default Teacher;
