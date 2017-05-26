import {
    User,
    School,
    Group,
    Address,
} from '../../../models';
import orm from '../../../helpers/orm';

async function createUser(user, transaction) {
  const mapped = { ...user };
  delete mapped.group;
  const created = await User.create(
    user,
    {
      transaction,
      include: [
        { model: Group },
        { model: School },
        { model: Address },
      ],
    },
  );
  if (user.address) {
    await created.createAddress(user.address, { transaction });
  }

  return created;
}

function validateUser(user, req, res, next) {
  if (user == null || user.id != null) {
    res.status(400).send({ error: 'bad request' });
    return false;
  }
  switch (req.user.type) {
    case 'ADMIN':
      if (['TEACHER', 'LEADER', 'STUDENT'].indexOf(user.type) !== -1
                && user.school == null
                && user.schoolId == null) {
        res.status(400).send(
          { error: 'incorrect user type provided' },
        );
        return false;
      }
      return true;
    case 'TEACHER':
      if (['STUDENT', 'LEADER'].indexOf(user.type) === -1) {
        res.status(400).send(
          { error: 'incorrect user type provided' },
        );
        return false;
      }
      return true;
    default:
      next(new RangeError(`unhandled case: ${req.user.type}`));
      return false;
  }
}

async function postUsers(req, res, next) {
  const users = req.body;
  const transaction = req.transaction;
  let thrown;
  const groups = {};
  const addresses = [];
  for (
    let i = 0, user = users[i];
    i < users.length;
    i += 1, user = users[i]
  ) {
    if (!validateUser(user, req, res, next)) {
      thrown = true; break;
    }
    if (user.dob) user.dob = new Date(user.dob);

    if (req.user.school) {
      user.schoolId = req.user.schoolId;
    }
    const groupId = user.groupId || (user.group || {}).id;
    if (groupId) groups[groupId] = true;
    if (user.address) addresses.push(user.address);
    delete user.group;
  }
  if (thrown) {
    await transaction.rollback();
    return;
  }
  const insertedAddresses = await Address.bulkCreate(addresses, { transaction });
  let [[{ addressId }]] = await orm.query(
    'SELECT LAST_INSERT_ID() addressId;',
    { transaction },
  );
  const addressMap = {};
  const records = users.map((ur) => {
    const result = { ...ur };
    if (ur.address) {
      result.addressId = addressId;
      addressMap[addressId] = insertedAddresses.shift().toJSON();
      addressMap[addressId].id = addressId;
      addressId += 1;
    }
    return result;
  });

  const results = await User.bulkCreate(records, { transaction });
  const [[{ userId }]] = await orm.query(
    'SELECT LAST_INSERT_ID() userId;',
    { transaction },
  );
  await transaction.commit();
  res.send(results.map((user, ix) => ({
    ...user.toJSON(),
    id: userId + ix,
    address: addressMap[user.addressId],
    group: groups[user.groupId],
  })));
}

async function postUser(req, res, next) {
  const user = req.body;
  if (!validateUser(user, req, res, next)) {
    await req.transaction.rollback();
    return;
  }
  if (user.dob) user.dob = new Date(user.dob);
  if (req.user.school) {
    user.schoolId = req.user.school.id;
  }
  const created = await createUser(user, req.transaction);
  const result = await created.reload({
    transaction: req.transaction,
    include: [
      { model: Group },
      { model: Address },
    ],
  });
  await req.transaction.commit();
  res
    .status(201)
    .set('Location', `/api/users/${created.id}`)
    .send(result.toJSON());
}

export default function post(req, res, next) {
  if (Array.isArray(req.body)) {
    postUsers(req, res, next);
  } else {
    postUser(req, res, next);
  }
}
