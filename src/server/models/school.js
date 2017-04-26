import {
    STRING,
} from 'sequelize';

import orm from '../helpers/orm';

export default orm.define(
  'school',
  {
    name: STRING,
  },
);
