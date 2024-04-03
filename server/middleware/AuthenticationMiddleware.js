const db = require("../models");
const { HandledError } = require("./ErrorHandlingMiddleware");

async function authMiddleware(req, res, next) {
  try {
    let utorid = "";
    let http_mail = "";

    if (process.env?.ENV === "dev") {
      // Replace shibboleth headers
      utorid = "demo_utorid";
      http_mail = "demo@demo.com";
    } else {
      utorid = req.headers.utorid;
      http_mail = req.headers.http_mail;
    }

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
    console.log(error);
    next(new HandledError(500, "Shibboleth headers not found."));
  }
}

module.exports = authMiddleware;
