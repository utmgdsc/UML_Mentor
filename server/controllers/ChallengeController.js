const db = require("../models/index");
const Challenge = db.Challenge;

function diffToNum(difficulty) {
  switch (difficulty) {
    case "easy":
      return 0;
    case "medium":
      return 1;
    case "hard":
      return 2;
    default:
      return -1;
  }
}

exports.findAll = async (req, res) => {
  const challengesData = await Challenge.findAll();
  const challenges = challengesData.map((challengeData) => {
    const challengeDescription = JSON.parse(challengeData.description);
    return {
      id: challengeData.id,
      title: challengeData.title,
      difficulty: diffToNum(challengeData.difficulty),
      outcome: challengeDescription.outcome,
      keyPatterns: challengeDescription.keyPatterns,
      generalDescription: challengeDescription.generalDescription,
      usageScenarios: challengeDescription.usageScenarios,
      expectedFunctionality: challengeDescription.expectedFunctionality,
    };
  });

  res.status(200).json(challenges);
};

exports.findOne = async (req, res) => {
  const challenge_id = req.params.id;

  const challengeData = await Challenge.findOne({
    where: {
      id: challenge_id,
      // userId: req.user.id //Set up properly after done authentication
    },
  });

  const challengeDescription = JSON.parse(challengeData.description);

  // Convert the challenge into proper format
  const challenge = {
    id: challengeData.id,
    title: challengeData.title,
    difficulty: diffToNum(challengeData.difficulty),
    outcome: challengeDescription.outcome,
    keyPatterns: challengeDescription.keyPatterns,
    generalDescription: challengeDescription.generalDescription,
    usageScenarios: challengeDescription.usageScenarios,
    expectedFunctionality: challengeDescription.expectedFunctionality,
  };

  res.status(200).json(challenge);
};

exports.getSolutions = async (req, res) => {
  const id = req.body;
  const solutions = await axios.get(id);
  res.status(200).json(solutions.data);

  res.status(500).json({ error: error.message });
};

exports.create = async (req, res) => {
  const { description, title } = req.body;
  const newChallenge = await Challenge.create({ description, title });
  res.status(201).json(newChallenge);

  res.status(500).json({ error: error.message });
};

exports.edit = async (req, res) => {
  const { id } = req.params;
  const { description, title } = req.body;
  await Challenge.update({ description, title }, { where: { id } });
  const updatedChallenge = await Challenge.findByPk(id);
  res.status(200).json(updatedChallenge);

  res.status(500).json({ error: error.message });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Challenge.destroy({ where: { id } });
  res.status(204).send();

  res.status(500).json({ error: error.message });
};
