import { Router } from 'express';
import { Group, School, User, Address } from '../../models';

export default new Router()
  .get('/groups', async (req, res) => {
    res.send(
      (await Group.findAll({
        transaction: req.transaction,
        include: [
          {
            model: School,
            where: { id: req.user.schoolId },
          },
          {
            model: User,
            include: [{ model: Address }],
          },
        ],
        order: ['name'],
      }))
        .map((item) => {
          const json = item.toJSON();
          delete json.school;
          delete json.schoolId;
          return json;
        }),
    );
    req.transaction.commit();
  })
  .get('/students', async (req, res) => {
    res.send((await User.findAll({
      transaction: req.transaction,
      include: [
        { model: Group },
        {
          model: School,
          where: { id: req.user.schoolId },
        },
        { model: Address },
      ],
      order: ['lastName', 'firstName'],
      where: { type: 'STUDENT' },
    })).map((item) => {
      const result = item.toJSON();
      delete result.schoolId;
      delete result.school;
      return result;
    }));
    req.transaction.commit();
  })
  .get('/leaders', async (req, res) => {
    res.send((await User.findAll({
      transaction: req.transaction,
      include: [
        { model: Group },
        {
          model: School,
          where: { id: req.user.schoolId },
        },
        { model: Address },
      ],
      order: ['lastName', 'firstName'],
      where: { type: 'LEADER' },
    })).map((item) => {
      const result = item.toJSON();
      delete result.schoolId;
      delete result.school;
      return result;
    }));
    req.transaction.commit();
  });
