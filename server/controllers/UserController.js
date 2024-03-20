const db = require("../models/index");
const User = db.User;

exports.get = async (req, res) => {
  //const users = await User.findAll();

  const sampleUser = {
      username: 'Alexander Apostolu',
      preferredName: 'Alex',
      email: 'apostolu240@gmail.com',
      score: 100
  };

  res.status(200).json(sampleUser);
}

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

exports.create = async (req, res) => {
  const { username, passwordHash, preferredName, email, score } = req.body;
  const newUser = await User.create({
    username,
    passwordHash,
    preferredName,
    email,
    score,
  });
  res.status(201).json(newUser);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { username, passwordHash, preferredName, email, score } = req.body;
  await User.update(
    { username, passwordHash, preferredName, email, score },
    { where: { id } },
  );
  const updatedUser = await User.findByPk(id);
  res.status(200).json(updatedUser);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  res.status(204).send();
};


// send request to the route postman
