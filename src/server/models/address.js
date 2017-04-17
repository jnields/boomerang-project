import {
    STRING,
} from 'sequelize';

import orm from '../helpers/orm';

export default orm.define(
  'address',
  {
    line1: STRING,
    line2: STRING,
    line3: STRING,
    city: STRING,
    state: STRING,
    zip: { type: STRING, is: /^[0-9]{5}(-[0-9]{4})?$/ },
    country: STRING,
  },
);
