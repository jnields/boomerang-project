import Sequelize from "sequelize";
const database = process.env.BOOMERANG_DATABASE,
    username = process.env.BOOMERANG_USER,
    password = process.env.BOOMERANG_PASSWORD;
    
export default new Sequelize(
    database,
    username,
    password
);
