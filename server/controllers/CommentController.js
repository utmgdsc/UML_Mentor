const db = require("../models/index");
const Comment = db.Comment;

exports.get = async (req, res) => {
  const { solutionId } = req.params;
  const comments = await Comment.findAll({
    where: {
      solutionId,
    },
  });
  res.status(200).json(comments);
};

exports.create = async (req, res) => {
  const { text, userId, solutionId } = req.body;
  const newComment = await Comment.create({ text, userId, solutionId });
  res.status(201).json(newComment);
};

exports.edit = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  await Comment.update({ text }, { where: { id } });
  const updatedComment = await Comment.findByPk(id);
  res.status(200).json(updatedComment);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Comment.destroy({ where: { id } });
  res.status(204).send();
};
