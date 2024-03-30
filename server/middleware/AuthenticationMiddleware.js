const db = require("../models");
const { HandledError } = require("./ErrorHandlingMiddleware");

async function authMiddleware(req, res, next) {
  try {
    const utorid = req.headers.utorid;
    const http_mail = req.headers.http_mail;

    let user = await db.User.findByPk(utorid);
      if (!user) {
        user = await db.User.create({
          username: utorid,
          email: http_mail,
          role: "user",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      next(new HandledError(500, "Shibboleth headers not found."));
    }
}

module.exports = authMiddleware;
