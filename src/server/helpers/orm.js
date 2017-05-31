import Sequelize from 'sequelize';

export default new Sequelize(
    'boomerang',
    process.env.DB_USER,
    process.env.DB_PASSWORD,
);
