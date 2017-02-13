import orm from "../helpers/orm";

const Teacher = orm.define(
    "teacher",
    {
    },
    {
        validate: {
            tier2: function() {
                const ur = this.user || this.getUser();
                if (ur.tier != "2")
                    throw new Error("Teacher's user is the incorrect tier.");
            }
        }
    });
export default Teacher;
