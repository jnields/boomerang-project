import orm from "../helpers/orm";
import { BOOLEAN, INTEGER } from "sequelize";
import user from "./user";

const Student = orm.define(
    "student",
    {
        grade: INTEGER,
        isLeader: BOOLEAN
    },
    {
        validate: {
            tier1: function() {
                const ur = this.getUser();
                if (ur.tier !== "3")
                    throw new Error("Student's User is the incorrect tier.");
            }
        }
    });

export default Student;
