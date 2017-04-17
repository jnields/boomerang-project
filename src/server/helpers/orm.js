import Sequelize from 'sequelize';

export default new Sequelize(
    process.env.BOOMERANG_DATABASE,
    process.env.BOOMERANG_USER,
    process.env.BOOMERANG_PASSWORD,
);
