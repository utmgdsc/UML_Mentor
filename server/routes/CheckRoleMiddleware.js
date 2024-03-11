function checkRole(roleArray) {
    return function(req, res, next) {
      if (req.user && roleArray.includes(req.user.role.name)) {
        next();
      } else {
        res.status(403).send('Not authorized');
      }
    };
  }
  