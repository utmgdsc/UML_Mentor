const db = require("../models/index");
const Comment = db.Comment;

exports.get = async (req, res) => {
  try {
    //const comments = await Comment.findAll();
    const sampleComments = [
      {
        text: "Amazing Work!",
        userId: "Alex Apostolu",
        solutionId: 1
      },
      {
        text: "Great job!",
        userId: "Alex Apostolu",
        solutionId: 2
      },
      {
        text: "jobizdan!",
        userId: "Alex Apostolu",
        solutionId: 3
      },
    ];
    res.status(200).json(sampleComments);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.create = async (req, res) => {
  try {
    const { text, userId, solutionId } = req.body;
    console.log("x", req.body);
    const newComment = await Comment.create({ text, userId, solutionId });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    await Comment.update({ text }, { where: { id } });
    const updatedComment = await Comment.findByPk(id);
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
