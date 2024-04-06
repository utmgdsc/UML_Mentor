const fs = require("fs").promises;
const STORAGE_CONFIG = require("../storage_config.json");
const db = require("../models/index");
const { HandledError } = require("../middleware/ErrorHandlingMiddleware");
const { AITA } = require("../AI/AITA.js");
const Solution = db.Solution;
const Comment = db.Comment;
const Challenge = db.Challenge;
const User = db.User;

exports.getNrecent = async (req, res) => {
  const { n } = req.params;
  const solutions = await Solution.findAll({
    limit: n,
    include: { model: User, as: "User" },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(solutions);
};

exports.getAll = async (req, res) => {
  // eager load the user data
  const solutions = await Solution.findAll({
    limit: 50,
    include: { model: User, as: "User" },
  });

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
    throw HandledError(404, "Solution not found");
  }
  const comments = await solution.getComments();
  res.status(200).json(comments);
};

exports.create = async (req, res) => {
  const { challengeId, title, description } = req.body;
  const { filename: diagram } = req.file;

  const userId = req.user.username;

  console.log(`Creating Solution /w ${challengeId}m ${userId}`);

  const newSolution = await Solution.create({
    challengeId,
    userId: userId,
    title,
    description,
    diagram,
  });

  res.status(201).json(newSolution).send();

  // Prepare AI feedback and submit it as a comment!
  const challenge = await Challenge.findByPk(challengeId);
  const [chainRunId, feedback] = await AITA.feedback_for_post(
    newSolution,
    challenge,
    `${STORAGE_CONFIG.location}/${diagram}`,
  );
  Comment.create({
    text: feedback,
    userId: "AITA",
    solutionId: newSolution.id,
    runId: chainRunId,
  });
  console.log("AITA gave feedback!");
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
    //TODO: Copy paste to delete
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

// TODO: Test this route
exports.delete = async (req, res) => {
  const { id } = req.params;
  await Solution.destroy({ where: { id } });
  fs.unlink(`${STORAGE_CONFIG.location}/${solution.diagram}`, (err) =>
    console.log(err),
  );
  res.status(204).send();
};
