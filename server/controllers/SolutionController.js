const fs = require("fs");
const STORAGE_CONFIG = require("../storage_config.json");
const db = require("../models/index");
const Solution = db.Solution;
const Comment = db.Comment;
const User = db.User;

exports.getNrecent = async (req, res) => {
  const { n } = req.params;
  const solutions = await Solution.findAll({ limit: n, include: {model: User, as: "User"}, order: [['createdAt', 'DESC']]});
  
  res.status(200).json(solutions);
}

exports.getAll = async (req, res) => {
  // eager load the user data
  const solutions = await Solution.findAll({ limit: 50, include: {model: User, as: "User"}});

  res.status(200).json(solutions);
};

exports.get = async (req, res) => {
  const { id } = req.params;
  const solution = await Solution.findByPk(id);
  res.status(200).json(solution);
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
  const { challengeId, title, description } = req.body;
  const { filename: diagram } = req.file;

  const userId = req.user.username;

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
  // TODO: make sure only the owner can make edits.
  const { file } = req;
  const { challengeId, description, title, id } = req.body;

  const updateData = {};

  if (challengeId !== null && challengeId !== undefined) {
    updateData.challengeId = challengeId;
  }
  if (req.user) {
    updateData.userId = req.user.id;
  }
  if (description !== null && description !== undefined) {
    updateData.description = description;
  }
  if (title !== null && title !== undefined) {
    updateData.title = title;
  }

  if (file && STORAGE_CONFIG.delete_on_edit) {
    // delete the old file

    const solution = await Solution.findByPk(id);
    // TODO: construct a path in a better way
    fs.unlink(`${STORAGE_CONFIG.location}/${solution.diagram}`, (err) =>
      console.log(err),
    );
  }

  if (file) {
    updateData.diagram = file.filename;
  }

  if (Object.keys(updateData).length > 0) {
    await Solution.update(updateData, { where: { id } });
  }

  const updatedSolution = await Solution.findByPk(id);
  res.status(200).json(updatedSolution);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Solution.destroy({ where: { id } });
  res.status(204).send();
};
