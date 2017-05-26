import crypto from 'crypto';

const tenYears = 1000 * 60 * 60 * 24 * 365 * 10;
export default function (res, sessionId) {
  const newSid = sessionId || crypto.randomBytes(64).toString('base64');
  res.cookie(
    'SID',
    newSid,
    {
      secure: process.env.NODE_ENV === 'production',
      maxAge: tenYears,
    },
  );
  return newSid;
}
