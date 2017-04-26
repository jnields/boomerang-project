export default function (func) {
  return async (req, res, next) => {
    try {
      return await func(req, res);
    } catch (e) { return next(e); }
  };
}
