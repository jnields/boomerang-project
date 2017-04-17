import {
    User,
    School,
    AuthMechanism,
} from '../models';
import logServerError from './log-server-error';

async function authenticate(req, res, next) {
  const sessionId = req.cookies.SID;
  if (sessionId && sessionId.length) {
    const result = await AuthMechanism.findOne({
      where: { sessionId },
      include: [{
        model: User,
        include: [{
          model: School,
        }],
      }],
    });
    req.user = (result && result.user) ? result.user : null;
  } else {
    req.user = null;
  }
  return next();
}

export default function (req, res, next) {
  authenticate(req, res, next).catch(
        (err) => {
          console.log("can't authenticate", err);
          logServerError(err, req, res);
        },
    );
}
