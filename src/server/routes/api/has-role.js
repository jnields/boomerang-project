export default function hasRole(...args) {
  return (req, res, next) => {
    if ([].indexOf.call(args, req.user.type) === -1) {
      return res.status(401).send({ error: 'unauthorized' });
    }
    return next();
  };
}
