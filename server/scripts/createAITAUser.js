const db = require("../models/index");
const User = db.User;

module.exports = async () => {
  const AITA = await User.findByPk("AITA");
  if (AITA) {
    return;
  }
  await User.findOrCreate({
    where: {
      username: "AITA",
    },
    defaults: {
      username: "AITA",
      passwordHash: "02",
      email: "AITA - email",
    },
  });
};
