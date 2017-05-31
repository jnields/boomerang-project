import crypto from 'crypto';

import parseQuery from '../parse-query';
import { User, Address, Group, AuthMechanism } from '../../../models';
import transporter from '../../../mail-transporter';
import getTransaction from '../../../helpers/get-transaction';


const sendActivation = async (transaction, user) => {
  const [authMech] = await AuthMechanism.findOrCreate({
    where: { username: user.email },
    defaults: {
      type: 'BASIC',
      username: user.email,
    },
    transaction,
  });
  const resetId = crypto.randomBytes(32);
  const result = authMech.update(
    {
      userId: user.id,
      resetId: resetId.toString('base64'),
      resetAt: new Date(),
    },
    { transaction },
  );
  transporter.sendMail({
    from: process.env.MAIL_USER,
    to: user.email,
    subject: 'Activate your account with Boomerang Project',
    text:
`
You've been granted access to the Boomerang Project's data manager.

To set a password to activate your account, follow the link below:

${process.env.HOST}/activate/${resetId.toString('hex')}

Thanks,
Your friends at the Boomerang Project
`,
  }).then(info => console.log(info), err => console.error(err));
  return result;
};

export default async (req, res) => {
  const transaction = req.transaction;
  const translatedQuery = { ...req.query };
  const schoolId = translatedQuery.schoolId;
  delete translatedQuery.schoolId;
  const query = parseQuery(
    translatedQuery,
    {
      transaction,
      where: {
        activationSent: false,
        $and: [
          { email: { $ne: null } },
          { email: { $ne: '' } },
        ],
      },
    },
    User,
  );
  if (schoolId !== undefined) query.where.schoolId = schoolId;
  const updated = await User.findAll({
    ...query,
    include: [
      { model: Group },
      { model: Address },
    ],
  });
  await User.update(
    { activationSent: true },
    query,
  );
  await transaction.commit();
  res.status(202).send(updated.map(ur => ({
    ...ur.toJSON(),
    activationSent: true,
  })));
  const newTransaction = await getTransaction();
  try {
    await Promise.all(updated.map(
      sendActivation.bind(null, newTransaction),
    ));
  } catch (error) {
    newTransaction.rollback();
  } finally {
    if (!newTransaction.finished) newTransaction.commit();
  }
};
