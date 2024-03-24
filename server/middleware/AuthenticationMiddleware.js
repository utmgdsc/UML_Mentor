const db = require("../models");
const { HandledError } = require("./ErrorHandlingMiddleware");

async function authMiddleware(req, res, next) {
  if (process.env?.ENV !== "prod") {
    console.log("Skipping auth middleware.");
    next();
  } else {
    try {
      const utorid = req.headers.utorid;
      const http_mail = req.headers.http_mail;

      let user = await db.User.findOne({ where: { username: utorid } });

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
      throw HandledError(500, "User not found...");
    }
  }
}

module.exports = authMiddleware;
