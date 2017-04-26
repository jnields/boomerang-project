import {
    User,
    School,
    AuthMechanism,
} from '../models';

export default async function authenticate(req, res, next) {
  try {
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
  } catch (e) {
    return next(e);
  }
}
