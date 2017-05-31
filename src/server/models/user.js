import {
    STRING,
    DATEONLY,
    ENUM,
    BOOLEAN,
} from 'sequelize';

import orm from '../helpers/orm';

export default orm.define(
  'user',
  {
    firstName: STRING,
    lastName: STRING,
    middleName: STRING,
    phone: STRING,
    email: STRING,
    firstLanguage: STRING,
    languageNeeds: STRING(2550),
    notes: STRING(2550),
    gender: ENUM('M', 'F'),
    dob: DATEONLY,

    homeRoom: STRING,
    teacher: STRING,
    oriented: BOOLEAN,

    activationSent: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    type: {
      type: ENUM(
        'STUDENT',
        'LEADER',
        'TEACHER',
        'ADMIN',
            ),
      allowNull: false,
    },
  },
);
