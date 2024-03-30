const db = require("../models/index");
const User = db.User;

module.exports = async () => {
  await User.create({
    id: -13,
    username: "AI TA",
    passwordHash: "02",
    email: "AITA - email",
  });
};
