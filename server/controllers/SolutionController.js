const db = require("../models/index");
const Solution = db.Solution;
const Comment = db.Comment;

exports.getAll = async (req, res) => {
  const solutions = await Solution.findAll();
  res.status(200).json(solutions);
};

exports.get = async (req, res) => {
  const { id } = req.params;
  const solutions = await Solution.findAll({
    where: {
      id: id,
    },
  });
  res.status(200).json(solutions[0]);
};

exports.getComments = async (req, res) => {
  const { id } = req.params;
  const solution = await Solution.findByPk(id);
  if (!solution) {
    return res.status(404).json({ message: "Solution not found" });
  }
  const comments = await solution.getComments();
  res.status(200).json(comments);
};

exports.create = async (req, res) => {
  const { challengeId, userId, title, description, diagram } = req.body;
  const newSolution = await Solution.create({
    challengeId,
    userId,
    title,
    description,
    diagram,
  });
  res.status(201).json(newSolution);
};

exports.edit = async (req, res) => {
  const { id } = req.params;
  const { challengeId, userId } = req.body;
  await Solution.update({ challengeId, userId }, { where: { id } });
  const updatedSolution = await Solution.findByPk(id);
  res.status(200).json(updatedSolution);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Solution.destroy({ where: { id } });
  res.status(204).send();
};
