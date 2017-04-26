import {
    STRING,
} from 'sequelize';

import orm from '../helpers/orm';

export default orm.define(
  'group',
  {
    name: STRING,
    roomNumber: STRING,
    notes: STRING(2550),
  },
);
