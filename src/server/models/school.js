import orm from "../helpers/orm";
import {
    STRING
} from "sequelize";
import Address from "./address";
import Teacher from "./teacher";
import Student from "./student";

const School = orm.define("school", {
    name: {
        type: STRING,
        notNull: true
    }
});
export default School;
