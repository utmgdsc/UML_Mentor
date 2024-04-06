const db = require('../models'); 

function checkRole(roleArray) {
  return async function(req, res, next) {
    if (req.headers.utorid) {
      try {
        const user = await db.User.findOne({ where: { username: req.headers.utorid } });
        if (user && roleArray.includes(user.role)) {
          next();
        } else {
          res.status(403).send('Not authorized');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        res.status(500).send('Server error');
      }
    } else {
      res.status(403).send('Not authorized');
    }
  };
}
module.exports = checkRole;