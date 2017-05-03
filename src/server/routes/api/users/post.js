import {
    User,
    School,
    Group,
    Address,
} from '../../../models';

async function createUser(user, transaction) {
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
  console.log('posting several');
  const users = req.body;
  const transaction = req.transaction;
  let thrown;
  const promises = [];
  for (
    let i = 0, user = users[i];
    i < users.length;
    i += 1, user = users[i]
  ) {
    if (req.user.school) {
      user.schoolId = req.user.school.id;
    }
    if (validateUser(user, req, res, next)) {
      promises.push(createUser(user, transaction).then(
        created => created.reload({
          transaction: req.transaction,
          include: [
              { model: Group },
              { model: Address },
          ],
        }),
      ));
    } else {
      thrown = true; break;
    }
  }
  const results = await Promise.all(promises);
  if (thrown) {
    await transaction.rollback();
    return;
  }
  await transaction.commit();
  res.send(results.map(result => result.toJSON()));
}

async function postUser(req, res, next) {
  const user = req.body;
  if (req.user.school) {
    user.schoolId = req.user.school.id;
  }
  if (validateUser(user, req, res, next)) {
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
  } else {
    await req.transaction.rollback();
  }
}

export default function post(req, res, next) {
  if (Array.isArray(req.body)) {
    postUsers(req, res, next);
  } else {
    postUser(req, res, next);
  }
}
