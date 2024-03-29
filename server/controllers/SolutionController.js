const fs = require("fs").promises;
const STORAGE_CONFIG = require("../storage_config.json");
const db = require("../models/index");
const { HandledError } = require("../routes/ErrorHandlingMiddleware");
const { AITA } = require("../AI/AITA.js");
const Solution = db.Solution;
const Comment = db.Comment;
const Challenge = db.Challenge;

exports.getAll = async (req, res) => {
  const solutions = await Solution.findAll();
  res.status(200).json(solutions);
};

exports.get = async (req, res) => {
  const { id } = req.params;
  const solutions = await Solution.findByPk(id);
  res.status(200).json(solutions);
};

exports.getComments = async (req, res) => {
  const { id } = req.params;
  const solution = await Solution.findByPk(id);
  if (!solution) {
    throw HandledError(404, "Solution not found");
  }
  const comments = await solution.getComments();
  res.status(200).json(comments);
};

exports.create = async (req, res) => {
  // TODO: fix user id
  const { challengeId, title, userId, description } = req.body;
  const { filename: diagram } = req.file;

  const newSolution = await Solution.create({
    challengeId,
    userId: 0,
    title,
    description,
    diagram,
  });
  res.status(201).json(newSolution).send();

  // Prepare AI feedback and submit it as a comment!
  const challenge = await Challenge.findByPk(challengeId);
  const feedback = await AITA.feedback_for_post(
    newSolution,
    challenge,
    `${STORAGE_CONFIG.location}/${diagram}`,
  );
  Comment.create({ text: feedback, userId: -13, solutionId: newSolution.id });
  console.log("AITA gave feedback!");
};

exports.edit = async (req, res) => {
  // TODO: make sure only the owner can make edits.
  const { file } = req;
  const { challengeId, userId, description, title, id } = req.body;

  const updateData = {};

  if (challengeId !== null && challengeId !== undefined) {
    updateData.challengeId = challengeId;
  }
  if (userId !== null && userId !== undefined) {
    updateData.userId = userId;
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
    await fs.unlink(`${STORAGE_CONFIG.location}/${solution.diagram}`);
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
