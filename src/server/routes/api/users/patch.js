import {
  User, School, Address, Group, AuthMechanism,
} from '../../../models';
import { NotFoundError, BadRequestError } from '../../../helpers/errors';

const patchUser = async (transaction, schoolId, id, updates, groups) => {
  if (!id) throw new BadRequestError();
  const parsedUpdates = { ...updates };
  if (parsedUpdates.dob) parsedUpdates.dob = new Date(parsedUpdates.dob);
  delete parsedUpdates.type;
  delete parsedUpdates.school;
  delete parsedUpdates.schoolId;
  delete parsedUpdates.addressId;
  delete parsedUpdates.activationSent;

  const groupId = parsedUpdates.groupId || (parsedUpdates.group || {}).id;
  if (groupId) {
    parsedUpdates.groupId = groupId;
  } else if ('groupId' in parsedUpdates
      || ('group' in parsedUpdates && parsedUpdates.group == null)) {
    parsedUpdates.groupId = null;
  }
  delete parsedUpdates.group;

  const where = { id };
  if (schoolId) where.schoolId = schoolId;
  const existing = await User.findOne({
    where,
    transaction,
  });

  if (existing == null) {
    throw new NotFoundError();
  }

  async function updateAuthMechanism() {
    if (['TEACHER', 'ADMIN'].indexOf(existing.type) === -1
        || !('email' in parsedUpdates)) return;
    if (!parsedUpdates.email) throw new BadRequestError();
    const authMech = await AuthMechanism.findOne({
      where: { username: existing.email },
      transaction,
    });
    if (authMech != null) {
      await authMech.update({ email: parsedUpdates.email }, { transaction });
    }
  }

  async function validateGroup() {
    if (!groupId) return;
    if (groups && groups[groupId]) return;
    const promise = Group.findOne({
      where: { id: groupId },
      include: [{
        model: School,
        where: { id: existing.schoolId },
      }],
      transaction,
    });
    // eslint-disable-next-line no-param-reassign
    if (groups) groups[groupId] = promise;
    const group = await promise;
    if (group == null) throw new NotFoundError();
  }

  async function updateAddress() {
    if (parsedUpdates.address) {
      const existingAddress = await existing.getAddress({ transaction });
      if (existingAddress) {
        return existingAddress.update(updates.address, { transaction });
      }
      return existing.createAddress(updates.address, { transaction });
    } else if ('address' in updates) {
      return existing.setAddress(null, { transaction });
    }
    return null;
  }

  await Promise.all([
    validateGroup(),
    updateAddress(),
    updateAuthMechanism(),
  ]);
  return existing.update(
    parsedUpdates,
    {
      transaction,
      include: [
        { model: Address },
        { model: Group },
      ],
    },
  );
};

const patchOne = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  if (updates.id && `${updates.id}` !== id) throw new BadRequestError();
  const transaction = req.transaction;
  const updated = await patchUser(
    req.transaction,
    req.user.schoolId,
    id,
    updates,
  );
  await transaction.commit();
  return res.send(updated);
};

const patchMany = async (req, res) => {
  const updates = req.body;
  const transaction = req.transaction;
  if (!Array.isArray(updates)) {
    throw new BadRequestError('id not specified');
  }
  const groups = {};
  const results = await Promise.all(updates.map(
    update => patchUser(
      transaction,
      req.user.schoolId,
      (update || {}).id,
      update || {},
      groups,
    ),
  ));
  await transaction.commit();
  return res.send(results.map(result => result.toJSON()));
};

export default async function patch(req, res) {
  if ('id' in req.params) return patchOne(req, res);
  return patchMany(req, res);
}
