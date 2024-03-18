// In checkRole.js
function checkRole(roleArray) {
  return function(req, res, next) {
    if (req.user && roleArray.includes(req.user.role)) {
      next();
    } else {
      res.status(403).send('Not authorized');
    }
  };
}

module.exports = checkRole;
