const db = require("../models/index");
const User = db.User;

exports.getMe = async (req, res) => {
  res.status(200).json({ username: req.user.username });
};

exports.get = async (req, res) => {
  const { username } = req.params;

  const user = await User.findByPk(username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
};

exports.getSolutions = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const solutions = await user.getSolutions();

  res.status(200).json(solutions);
};

exports.getComments = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const comments = await user.getComments();

  res.status(200).json(comments);
};

// USE FOR ADDING ADMINS
exports.create = async (req, res) => {
  const { username, role, email } = req.body;
  const newUser = await User.create({
    username,
    email,
    role,
  });
  res.status(201).json(newUser);
};

exports.update = async (req, res) => {
  const { username } = req.params;
  const { email, role } = req.body;

  const user = await User.findByPk(username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.update({ email, role });
  res.status(200).json(user);
};

exports.delete = async (req, res) => {
  const { username } = req.params;
  await User.destroy({ where: { username } });
  res.status(204).send();
};
