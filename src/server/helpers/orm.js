import Sequelize from 'sequelize';

export default new Sequelize(
    'boomerang',
    'root',
    process.env.BOOMERANG_PASSWORD,
);
