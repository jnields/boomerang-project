import { UniqueConstraintError } from 'sequelize';

import orm from '../server/helpers/orm';
import { AuthMechanism } from '../server/models';

let flag;
let password;
let username;
const user = {};

const fields = {
  '-u': 'username',
  '-p': 'password',
  '-e': 'email',
  '-g': 'gender',
  '-a': 'age',
  '-dob': 'dob',
  '-t': 'type',
  '-f': 'firstName',
  '-l': 'lastName',
};

const usage = 'Usage: create-user '
            + '-u [[username]] '
            + '-p [[password]] '
            + '-f [[firstName]] '
            + '-l [[lastName]] '
            + '-e [[email]] '
            + '-g [[gender]] '
            + '-a [[age]] '
            + '-dob [[dateOfBirth]] '
            + '-t  [[type]]';


process.argv.forEach((arg, ix) => {
  if (ix < 2) return;
  if (flag == null) {
    flag = fields[arg];
    if (!flag) {
      throw new Error(usage);
    }
  } else {
    if (flag === 'password') {
      password = arg;
    } else if (flag === 'username') {
      username = arg;
    } else {
      user[flag] = arg;
    }
    flag = null;
  }
});

let transaction;
async function saveUser() {
  transaction = await orm.transaction({
    autocommit: false,
    isolationLevel: 'READ COMMITTED',
  });
  let authMechanism = AuthMechanism.build(
    { type: 'BASIC', username },
  );
  authMechanism.setPassword(password);
  authMechanism = await authMechanism.save({ transaction });
  user.email = username;
  await authMechanism.createUser(user, { transaction });
  await transaction.commit();
  console.log('USER CREATED');
  process.exit(0);
}

saveUser().catch(
  (error) => {
    transaction.rollback().then(() => {
      if (error instanceof UniqueConstraintError) {
        console.log('USERNAME TAKEN');
      } else {
        console.log(error);
        process.exit(1);
      }
      process.exit(1);
    });
  },
);
