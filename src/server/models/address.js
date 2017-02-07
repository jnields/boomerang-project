import {
    STRING,
} from "sequelize";
import orm from "../helpers/orm";
export default orm.define("address", {
    line1: STRING,
    line2: STRING,
    line3: STRING,
    city: STRING,
    state: STRING,
    country: STRING
});
