import { createTransport } from 'nodemailer';

const mailConfig = {
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
};

export default createTransport(mailConfig);
