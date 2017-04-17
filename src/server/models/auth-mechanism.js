import crypto from 'crypto';
import { ENUM, CHAR, STRING } from 'sequelize';
import orm from '../helpers/orm';
import { InsecurePasswordError } from '../helpers/errors';

function sha512(salt, password) {
  const hash = crypto
        .createHmac('sha512', salt)
        .update(password)
        .digest('base64');
  return { salt, hash };
}

function saltHashPassword(password) {
  if (password == null) {
    throw new Error('null password');
  }
  return sha512(
        crypto.randomBytes(16).toString('base64'),
        password,
    );
}


function match(salt, hash, password) {
  if (salt == null || hash == null || password == null) { return false; }
  const hash2 = sha512(salt, password).hash;
  let same = 1;
  for (let i = 0; i < hash2.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    same &= (hash[i] === hash2[i]);
  }
  return same === 1;
}

export default orm.define(
    'authMechanism',
  {
    type: {
      type: ENUM('BASIC'),
      allowNull: false,
    },
    username: {
      type: STRING,
      unique: true,
      allowNull: true,
    },
    salt: {
      type: CHAR(24),
      allowNull: false,
    },
    hash: {
      type: CHAR(88),
      allowNull: false,
    },
    sessionId: CHAR(88),
  },
  {
    instanceMethods: {
      correctPassword(password) {
        return match(this.salt, this.hash, password);
      },
      setPassword(password) {
        if (password.length < 8) { throw new InsecurePasswordError(); }
        const sh = saltHashPassword(password);
        this.salt = sh.salt.toString('base64');
        this.hash = sh.hash.toString('base64');
      },
    },
  },
);
