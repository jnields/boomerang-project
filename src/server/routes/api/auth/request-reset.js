import React from 'react';
import { renderToString } from 'react-dom/server';
import { createTransport } from 'nodemailer';
import {
    User,
    AuthMechanism,
} from '../../../models';
import PasswordResetTemplate from './password-reset-template';

const mailConfig = {
  service: 'Gmail',
  auth: {
    user: 'example@gmail.com',
    pass: 'password',
  },
};
const transporter = createTransport(mailConfig);

export default async function requestReset(req, res) {
  const {
    transaction,
    params: {
      username,
    },
  } = req;
  const authMech = await AuthMechanism.findOne({
    where: { username },
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
