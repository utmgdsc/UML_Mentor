const db = require("../models/index");
const repl = require("repl");
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
  const { text, solutionId } = req.body;

  const userId = req.user.username;

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

exports.reply = async (req, res) => {
  // TODO: add userId!!!!
  // Comment that it's in reply to
  const { parentId } = req.params;
  const { text } = req.body;
  const parent = await Comment.findByPk(parentId);
  const { solutionId: parentSolutionId, replies: parentReplies } = parent;
  const to_add = {
    text,
    solutionId: parentSolutionId,
  };
  const newComment = await Comment.create(to_add);

  const replyList = parentReplies.split(",").filter((v) => v.length !== 0);

  Comment.update(
    { replies: [...replyList, `${newComment.id}`].join(",") },
    {
      where: {
        id: parentId,
      },
    },
  );

  res.status(204).send();
};
