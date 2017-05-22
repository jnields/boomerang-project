import {
  User, School, Address, Group,
} from '../../../models';
import { NotFoundError, BadRequestError } from '../../../helpers/errors';

const patchOne = async (req, res) => {
  const id = req.params.id;
  const transaction = req.transaction;
  const updates = req.body;
  if (updates && updates.dob) updates.dob = new Date(updates.dob);
  if (updates == null || (updates.id && `${updates.id}` !== id)) {
    throw new BadRequestError();
  }
  delete updates.type;
  delete updates.school;
  delete updates.schoolId;
  delete updates.addressId;
  delete updates.email;

  const schoolInclude = {
    model: School,
    where: req.user.school ? { id: req.user.school.id } : undefined,
  };

  const groupInclude = { model: Group };
  const addressInclude = { model: Address };

  const existing = await User.findOne({
    where: { id: req.params.id },
    include: [schoolInclude],
    transaction,
  });

  if (existing == null) {
    throw new NotFoundError();
  }

  const updated = await existing.update(updates, { transaction });

  async function updateGroup() {
    if (updates.group || updates.groupId) {
      const groupId = updates.groupId || updates.group.id;
      const group = await Group.findOne(
        {
          where: { id: groupId },
          include: [schoolInclude],
          transaction,
        },
      );
      return updated.setGroup(group, { transaction });
    } else if ('group' in updates || 'groupId' in updates) {
      return updated.setGroup(null, { transaction });
    }
    return null;
  }

  async function updateAddress() {
    if (updates.address) {
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

  await Promise.all([updateGroup(), updateAddress()]);
  await existing.reload({
    transaction,
    include: [groupInclude, addressInclude],
  });
  await transaction.commit();
  return res.send(updated);
};

const patchMany = async (req, res) => {
  const updates = req.body;
  const transaction = req.transaction;
  if (!Array.isArray(updates)) {
    throw new BadRequestError('id not specified');
  }
  const schoolInclude = {
    model: School,
    where: req.user.school ? { id: req.user.school.id } : undefined,
  };
  const groupInclude = { model: Group };
  const addressInclude = { model: Address };

  const results = await Promise.all(updates.map(
    async (update) => {
      const patch = { ...update };
      delete patch.type;
      delete patch.school;
      delete patch.schoolId;
      delete patch.addressId;
      delete patch.email;
      const existing = await User.findOne({
        where: { id: patch.id },
        include: [schoolInclude],
        transaction,
      });

      if (existing == null) {
        throw new NotFoundError();
      }

      const updated = await existing.update(patch, { transaction });

      const groups = {};
      async function updateGroup() {
        if (patch.group || patch.groupId) {
          const groupId = patch.groupId || patch.group.id;
          groups[groupId] = groups[groupId] || Group.findOne(
            {
              where: { id: groupId },
              include: [schoolInclude],
              transaction,
            },
          );
          return updated.setGroup(await groups[groupId], { transaction });
        } else if ('group' in patch || 'groupId' in patch) {
          return updated.setGroup(null, { transaction });
        }
        return null;
      }

      async function updateAddress() {
        if (patch.address) {
          const existingAddress = await existing.getAddress({ transaction });
          if (existingAddress) {
            return existingAddress.update(patch.address, { transaction });
          }
          return existing.createAddress(patch.address, { transaction });
        } else if ('address' in patch) {
          return existing.setAddress(null, { transaction });
        }
        return null;
      }

      await Promise.all([updateGroup(), updateAddress()]);
      return existing.reload({
        transaction,
        include: [groupInclude, addressInclude],
      });
    },
  ));
  await req.transaction.commit();
  return res.send(results.map(result => result.toJSON()));
};

export default async function patchUser(req, res) {
  const id = req.params.id;
  if (id) return patchOne(req, res);
  return patchMany(req, res);
}
