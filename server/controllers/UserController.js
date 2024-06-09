const db = require("../models/index");
const User = db.User;

//change
exports.getMe = async (req, res) => {
  try {
    const username = req.headers.utorid;
    if (!username) {
      return res.status(401).send('Authentication required');
    }

    const user = await db.User.findOne({ where: { username: username } });
    if (user) {
      // Sending response after checking user existence and fetching role
      res.status(200).json({ username: user.username, role: user.role, score: user.score });
    } else {
      // Sending not authorized if no user is found
      res.status(403).send('Not authorized');
    }
  } catch (error) {
    console.error('Error checking user role:', error);
    // Sending server error response
    res.status(500).send('Server error');
  }
};

exports.getSolvedChallengesTitles = async (req, res) => {
  const solutions = await db.Solution.findAll({
    where: {
      userId: req.params.username,
    },
    include: { model: db.Challenge, as: "Challenge" },
  });

  const solvedNames = [];
  for (let i = 0; i < solutions.length; i++) {
    // make sure the challenge is not already in the list
    if (!solvedNames.includes(solutions[i].Challenge.title)) {
      solvedNames.push(solutions[i].Challenge.title);
    }
  }

  res.status(200).json(solvedNames);
}

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
  const { email, role, score } = req.body;

  const user = await User.findByPk(username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.update({ email, role, score });
  res.status(200).json(user);
};

exports.delete = async (req, res) => {
  const { username } = req.params;
  await User.destroy({ where: { username } });
  res.status(204).send();
};
