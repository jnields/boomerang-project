import React from 'react';
import { renderToString } from 'react-dom/server';
import { createTransport } from 'nodemailer';
import { Router } from 'express';
import crypto from 'crypto';

import orm from '../helpers/orm';
import {
    School,
    User,
    AuthMechanism,
    Address,
} from '../models';
import logServerError from '../helpers/log-server-error';
import PasswordResetTemplate from '../helpers/password-reset-template';

const MAX_LIMIT = 1000;
const DEFAULT_LIMIT = 10;
const mailConfig = {
  service: 'Gmail',
  auth: {
    user: 'example@gmail.com',
    pass: 'password',
  },
};
const transporter = createTransport(mailConfig);

const router = Router();

function startTransaction(req, res, next) {
  orm.transaction({
    autocommit: false,
    isolationLevel: 'READ COMMITTED',
  }).then(
        (transaction) => {
          req.transaction = transaction;
          next();
        },
        (error) => {
          console.log(error);
          res.status(500).send();
        },
    );
}

function json(req, res, next) {
  res.type('json');
  next();
}

function mapUser(user) {
  switch (user.type) {
    case 'ADMIN':
    case 'STUDENT':
    case 'LEADER':
    case 'TEACHER':
    default:
      return user.toJSON();
  }
}

function hasType(...args) {
  return (req, res, next) => {
    if ([].indexOf.call(args, req.user.type) === -1) {
      return res.status(403).send({ error: 'unauthorized' });
    }
    return next();
  };
}

function enforceAuthenticated(req, res, next) {
  if (req.user == null) { return res.status(401).send({ error: 'unauthenticated' }); }
  return next();
}

async function logIn(req, res) {
  const { transaction, body } = req;
  if (!body || !body.username || !body.password) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }
  const { username, password } = body;
  const result = await AuthMechanism.findOne({
    transaction,
    where: { username },
    include: [{
      model: User,
      include: [{
        model: School,
      }],
    }],
  });

  if (result == null
            || !result.correctPassword(password)) {
    await transaction.rollback();
    return res.status(422).send({ error: 'invalid format' });
  }

  const sessionId = result.sessionId
        || crypto.randomBytes(16).toString('base64');

  res.cookie(
        'SID',
        sessionId,
    {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    },
    );

  if (result.sessionId !== sessionId) { await result.update({ sessionId, transaction }); }

  await req.transaction.commit();
  return res.send(mapUser(result.user));
}

async function resetLogIn(req, res) {
  const { transaction, body } = req;
  if (!body || !body.sessionId || !body.password) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }
  const { sessionId, password } = body;
  const authMech = await AuthMechanism.findOne({
    transaction,
    where: { sessionId },
    include: [{
      model: User,
      include: [{
        model: School,
      }],
    }],
  });
  authMech.setPassword(password);
  const newSid = crypto.randomBytes(16).toString('base64');
  authMech.sessionId = newSid;
  res.cookie(
    'SID',
    newSid,
    {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    },
    );
  await authMech.save({ transaction });
  await transaction.commit();
  return res.send(mapUser(authMech.user));
}

async function requestReset(req, res) {
  const { transaction, body } = req;
  const authMech = await AuthMechanism.findOne({
    where: { username: body.username },
    include: [{
      model: User,
    }],
  });
  if (authMech == null) {
    await transaction.rollback();
    return res.status(404).send({ error: 'not found' });
  }
  const info = await transporter.sendMail({
    from: mailConfig.auth.user,
    to: authMech.user.email,
    subject: 'Boomerang password reset',
    html: renderToString(
      <PasswordResetTemplate
        host={req.headers.host}
        authMechanism={authMech}
      />,
        ),
  });
  await transaction.commit();
  console.log(info);
  return res.status(204).send();
}

async function querySchools(req, res) {
  const limit = Math.min(
    parseInt(req.query.$limit, 10) || DEFAULT_LIMIT,
    MAX_LIMIT,
  );
  const offset = parseInt(req.query.$offset, 10) || 0;
  const $like = req.query.name$like;
  const transaction = req.transaction;

  let attributes = req.query.$select;

  if (attributes && !Array.isArray(attributes)) {
    attributes = [attributes];
  }

  const where = $like
    ? { name: { $like } }
    : undefined;
  const query = {
    transaction,
    include: [{
      model: Address,
    }],
  };
  if (attributes) query.attributes = attributes;
  if (where) query.where = where;
  if (limit) query.limit = limit;
  if (offset) query.offset = offset;

  const schools = await School.findAll(query);
  await transaction.commit();
  return res.send(schools.map(school => school.toJSON()));
}

async function getSchool(req, res) {
  const transaction = req.transaction;
  const id = req.params.id;

  const school = await School.findOne({
    where: { id },
    transaction,
  });
  if (school) {
    await transaction.commit();
    return res.send(school);
  }
  await transaction.rollback();
  return res.status(404).send({ error: 'not found' });
}

async function patchInstanceAddress(instance, patch, transaction) {
  const address = await instance.getAddress();
  if (patch) {
    if (address) {
      await address.update(
                patch,
                { transaction },
            );
    } else {
      await instance.createAddress(
                patch,
                { transaction },
            );
    }
  } else if (address) {
    await address.destroy({
      transaction,
    });
  }
  return instance.reload({
    transaction,
    include: [{ model: Address }],
  });
}

async function patchSchool(req, res) {
  const patch = req.body;
  const id = req.params.id;
  const transaction = req.transaction;

  if (!patch || (patch.id && `${patch.id}` !== id)) {
    await transaction.rollback();
    return res.status(400).send({ error: 'ID mismatch' });
  }
  delete patch.id;
  const existing = await School.findOne({
    where: { id },
    include: [{ model: Address }],
    transaction,
  });
  if (!existing) {
    await transaction.rollback();
    return res.status(404).send({ error: 'not found' });
  }
  const patchAddress = 'address' in patch;
  const addressPatch = patch.address;
  delete patch.address;

  let updated = await existing.update(
        patch,
        { transaction },
    );
  if (patchAddress) {
    updated = await patchInstanceAddress(
            updated,
            addressPatch,
            transaction,
        );
  }
  await transaction.commit();
  return res.status(200).send(updated.toJSON());
}

async function postSchool(req, res) {
  const school = req.body;
  const transaction = req.transaction;
  if (school.id) {
    await transaction.rollback();
    return res.status(422)
            .send({ error: 'explicit value provided for id' });
  }
  const saved = await School.create(school, { transaction });
  if (school.address) {
    await saved.createAddress(school.address, { transaction });
  }
  await transaction.commit();
  return res.set('Location', `/schools/${saved.id}`)
        .status(201)
        .send(saved.toJSON());
}

async function deleteSchool(req, res) {
  const id = req.params.id;
  const transaction = req.transaction;
  if (id == null) {
    await transaction.rollback();
    return res.status(400).send({ error: 'no id specified to delete' });
  }
  const destroyed = await School.destroy({ where: { id }, limit: 1, transaction });
  if (destroyed) {
    await transaction.commit();
    return res.status(204).end();
  }
  await transaction.rollback();
  return res.status(404).end();
}

async function queryUsers(req, res) {
  const limit = Math.min(
    parseInt(req.query.$limit, 10) || DEFAULT_LIMIT,
    MAX_LIMIT,
  );
  const offset = parseInt(req.query.$offset, 10) || 0;
  const transaction = req.transaction;
  const where = {};
  if (req.query.type) {
    if (Array.isArray(req.query.type)) {
      where.type = {
        $in: req.query.type,
      };
    } else {
      where.type = req.query.type;
    }
  }

  let include;
  switch (req.user.type) {
    case 'ADMIN':
      if (req.query.school && req.query.school.id) {
        if (Array.isArray(req.query.school.id)) {
          include = [{
            model: School,
            where: {
              id: {
                $in: req.query.school.id,
              },
            },
          }];
        } else {
          include = [{
            model: School,
            where: {
              id: req.query.school.id,
            },
          }];
        }
      }
      break;
    case 'TEACHER':
      include = [{
        model: School,
        where: {
          id: req.user.school.id,
        },
      }];
      break;
    default:
      throw new Error('type unhandled in case switch');
  }
  const results = await User.findAll({
    where,
    transaction,
    limit,
    offset,
    include,
  });
  await transaction.commit();
  return res.send(results.map(mapUser));
}

async function getUser(req, res) {
  const transaction = req.transaction;
  const id = req.params.id;
  const include = [];

  switch (req.user.type) {
    case 'ADMIN':
      break;
    case 'TEACHER':
      include.push({
        model: School,
        where: {
          id: req.user.school.id,
        },
      });
      break;
    default:
      throw new Error('unhandled case in switch statement');
  }
  const user = await User.findOne({
    where: { id },
    include,
    transaction,
  });

  await transaction.commit();
  if (user) {
    return res.send(mapUser(user));
  }
  return res.status(404).send({ error: 'not found' });
}

async function postUser(req, res) {
  const user = req.body;
  const transaction = req.transaction;
  const include = [{
    model: School,
  }];

  if (user == null || user.id != null) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }

  switch (req.user.type) {
    case 'ADMIN':
      if (['TEACHER', 'LEADER', 'STUDENT'].indexOf(user.type) !== -1
                && user.school == null
                && user.schoolId == null) {
        await transaction.rollback();
        return res.status(400).send(
                { error: 'incorrect user type provided' },
            );
      }

      break;
    case 'TEACHER':
      delete user.school;
      user.schoolId = req.user.school.id;
      if (['STUDENT', 'LEADER'].indexOf(user.type) === -1) {
        await transaction.rollback();
        return res.status(400).send(
                { error: 'incorrect user type provided' },
            );
      }
      break;
    default:
      throw new Error('unhandled case');
  }
  const password = user.password;
  const created = await User.create(user, { transaction, include });
  if (created.type !== 'ADMIN'
            && created.school == null
            && created.schoolId == null) {
    throw new Error('school not saved');
  }
  if (password) {
    let authMechanism = AuthMechanism.build({
      type: 'basic',
      username: user.email,
    });
    authMechanism.setPassword(password);
    authMechanism = await authMechanism.save({ transaction });
    await authMechanism.setUser(created, { transaction });
  }
  const result = await created.reload({ transaction, include });
  await transaction.commit();
  return res.send(result.toJSON());
}

async function patchUser(req, res) {
  const updates = req.body;
  const transaction = req.transaction;
  const id = req.params.id;

  if (updates == null || (updates.id && `${updates.id}` !== id)) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }

  if (id === `${req.user.id}`) {
    delete updates.type;
  }

  const include = [];

  if (req.user.type === 'TEACHER') {
    if (['TEACHER', 'STUDENT', 'LEADER'].indexOf(updates.type) === -1) { delete updates.type; }
    include.push({
      model: School,
      where: { id: req.user.school.id },
    });
  }

  delete updates.school;
  delete updates.schoolId;

  const existing = await User.findOne({
    where: { id: req.params.id },
    include,
    transaction,
  });

  if (existing == null) {
    await transaction.rollback();
    return res.status(404).send();
  }
  const oldEmail = existing.email;
  const updated = await existing.update(updates, { transaction });

  if (updates.password) {
    const noEmail = (
            (oldEmail == null || 'email' in updates)
            && updates.email == null
        );
    if (noEmail) {
      await transaction.rollback();
      return res.status(400).send({
        error: 'no username assigned',
      });
    }
    let authMech = await AuthMechanism.findOne({
      where: {
        type: 'BASIC',
        username: oldEmail,
      },
      transaction,
    });
    if (authMech) {
      authMech.setPassword(updates.password);
      if (updates.email) { authMech.username = updated.email; }
      await authMech.save({ transaction });
    } else {
      authMech = AuthMechanism.build({
        type: 'BASIC',
        username: updated.email,
      });
      authMech.setPassword(updates.password);
      await authMech.save({ transaction });
      await authMech.setUser(updated, { transaction });
    }
  } else if (
        'password' in updates
        || ('email' in updates && updates.email == null)
    ) {
    await AuthMechanism.destroy({
      where: {
        username: oldEmail,
        type: 'BASIC',
      },
            // include isn't supported
            // for destroy ???
            // maybe they'll add support one day
            // otherwise username is guaranteed
            // to be unique so this should be fine
            // include:[{
            //     model: User,
            //     where: {
            //         id: updated.id
            //     }
            // }],
      transaction,
    });
  } else if (updates.email) {
    await AuthMechanism.update(
            { username: updates.email },
      {
        where: {
          username: oldEmail,
        },
        transaction,
      },
        );
  }

  await transaction.commit();
  return res.send(updated);
}

async function deleteUser(req, res) {
  const id = req.params.id;
  const transaction = req.transaction;
  const include = [];

  if (`${req.user.id}` === id) {
    await transaction.rollback();
    return res.status(400).send({ error: 'bad request' });
  }

  if (req.user.type === 'TEACHER') {
    include.push({
      model: School,
      where: { id: req.user.school.id },
    });
  }

  const existing = await User.findOne({
    where: { id },
    transaction,
    include,
  });

  if (existing) {
    await existing.destroy();
    await transaction.commit();
    return res.status(204).send();
  }
  await transaction.rollback();
  return res.status(404).send();
}

function initializeRoutes() {
  router.use(startTransaction, json);

  router.route('/login')
    .post((req, res) => {
      logIn(req, res)
        .catch(err => logServerError(err, req, res));
    })
    .put((req, res) => {
      resetLogIn(req, res)
        .catch(err => logServerError(err, req, res));
    });

  router.route('/recover/request')
    .post((req, res) => {
      requestReset(req, res)
        .catch(err => logServerError(err, req, res));
    });

  router.route('/schools')
    .all(enforceAuthenticated, hasType('ADMIN'))
    .get((req, res) => {
      querySchools(req, res)
        .catch(err => logServerError(err, req, res));
    })
    .post((req, res) => {
      postSchool(req, res)
        .catch(err => logServerError(err, req, res));
    });

  router.route('/schools/:id')
    .all(enforceAuthenticated, hasType('ADMIN'))
    .get((req, res) => {
      getSchool(req, res)
        .catch(err => logServerError(err, req, res));
    })
    .patch((req, res) => {
      patchSchool(req, res)
        .catch(err => logServerError(err, req, res));
    })
    .delete((req, res) => {
      deleteSchool(req, res)
        .catch(err => logServerError(err, req, res));
    });

  router.route('/users')
    .all(enforceAuthenticated, hasType('ADMIN', 'TEACHER'))
    .get((req, res) => {
      queryUsers(req, res)
        .catch(err => logServerError(err, req, res));
    })
    .post((req, res) => {
      postUser(req, res)
        .catch(err => logServerError(err, req, res));
    });

  router.route('/users/:id')
    .all(enforceAuthenticated, hasType('ADMIN', 'TEACHER'))
    .get((req, res) => {
      getUser(req, res)
        .catch(err => logServerError(err, req, res));
    })
    .patch((req, res) => {
      patchUser(req, res)
        .catch(err => logServerError(err, req, res));
    })
    .delete((req, res) => {
      deleteUser(req, res)
        .catch(err => logServerError(err, req, res));
    });
}


export default orm.sync().then(initializeRoutes).then(() => router);
