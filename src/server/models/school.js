import orm from "../helpers/orm";
import {
    STRING
} from "sequelize";

const School = orm.define("school", {
    name: {
        type: STRING,
        allowNull: false
    }
});
export default School;
