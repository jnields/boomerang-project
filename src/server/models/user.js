import {
    STRING,
    DATEONLY,
    ENUM,
    INTEGER
} from "sequelize";
import orm from "../helpers/orm";

export default orm.define(
    "user",
    {
        firstName: STRING,
        lastName: STRING,
        email: STRING,
        dob: DATEONLY,
        gender: ENUM("M","F"),
        age: INTEGER,
        tier: {
            type: ENUM("1","2","3"),
            allowNull: false
        },
        username: {
            type: STRING,
            unique: true,
            allowNull: true
        }
    }
    // {
    //     indexes: [
    //         {
    //             unique: true,
    //             fields: ["username"],
    //             where: {
    //                 username: {
    //                     $ne: null
    //                 }
    //             }
    //         }
    //     ]
    // }
);
