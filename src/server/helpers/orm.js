import Sequelize from 'sequelize';

export default new Sequelize(
    'boomerang',
    'boomerang',
    process.env.DB_PASSWORD,
);
