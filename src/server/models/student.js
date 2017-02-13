import orm from "../helpers/orm";
import { BOOLEAN, INTEGER } from "sequelize";

const Student = orm.define(
    "student",
    {
        grade: INTEGER,
        isLeader: BOOLEAN
    },
    {
        validate: {
            tier3: function() {
                const ur = this.user || this.getUser();
                if (ur.tier !== "3")
                    throw new Error("Student's User is the incorrect tier.");
            }
        }
    });

export default Student;
