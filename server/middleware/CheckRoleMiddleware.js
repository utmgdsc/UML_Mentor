function checkRole(roleArray) {
  return function(req, res, next) {
    // Check if the user exists and if their role is included in the provided roleArray
    if (req.user && roleArray.includes(req.user.role)) {
      next();
    } else {
      res.status(403).send('Not authorized');
    }
  };
}
