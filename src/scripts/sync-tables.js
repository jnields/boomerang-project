import orm from '../server/helpers/orm';

// eslint-disable-next-line no-unused-vars
import * as Models from '../server/models';

orm.sync({ force: true }).then(
  () => {
    console.log('SUCCESS');
    process.exit(0);
  },
  (e) => {
    console.log('ERROR');
    console.log(e);
    process.exit(1);
  },
);
