const fs = require("fs").promises;
const STORAGE_CONFIG = require("../storage_config.json");
const db = require("../models/index");
const { HandledError } = require("../middleware/ErrorHandlingMiddleware");
const { AITA } = require("../AI/AITA.js");
const { where } = require("sequelize");
const Solution = db.Solution;
const Comment = db.Comment;
const Challenge = db.Challenge;
const User = db.User;

exports.getNrecent = async (req, res) => {
  const { n } = req.params;
  const userSolutions = await Solution.findAll({
    where: { userId: req.user.username },
  });
  const solvedChallengeIds = userSolutions.map((solution) => solution.challengeId);
  const solutions = await Solution.findAll({
    where: { challengeId: solvedChallengeIds },
    limit: n,
    include: { model: User, as: "User" },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(solutions);
};

exports.getUserSolutions = async (req, res) => {
  const userId = req.params.username;
  const solutions = await Solution.findAll({ where: { userId }, include: {model: User, as: "User"}});

  res.status(200).json(solutions);
};


exports.getAll = async (req, res) => {
  if (req.user.role === "admin") { // don't hide any solutions
    // eager load the user data
    const solutions = await Solution.findAll({
      // limit: 50,
      include: { model: User, as: "User" },
    });

    // append the challenge title to each solution
    for (let i = 0; i < solutions.length; i++) {
      const solution = solutions[i];
      const challenge = await Challenge.findByPk(solution.challengeId);
      solution.dataValues.challengeTitle = challenge.title;
    }

    res.status(200).json(solutions);
  } 
  else { // only return the solutions to the challenges that the user has solved
    // find all the solutions belonging to the user
    const userSolutions = await Solution.findAll({
      where: { userId: req.user.username },
    });

    const solvedChallengeIds = [];
    const solutions = [];

    // make a list of challenge id's that the user has solved
    for (let i = 0; i < userSolutions.length; i++) {
      if(!solvedChallengeIds.includes(userSolutions[i].challengeId)) {
        solvedChallengeIds.push(userSolutions[i].challengeId);
      }
    }

    // find all the solutions to the challenges that the user has solved
    for (let i = 0; i < solvedChallengeIds.length; i++) {
      const challengeId = solvedChallengeIds[i];
      const challengeSolutions = await Solution.findAll({
        where: { challengeId },
        include: { model: User, as: "User" },
      });
      solutions.push(...challengeSolutions);
    }

    // append the challenge title to each solution
    for (let i = 0; i < solutions.length; i++) {
      const solution = solutions[i];
      const challenge = await Challenge.findByPk(solution.challengeId);
      solution.dataValues.challengeTitle = challenge.title;
    }

    // sort the solutions by date created
    solutions.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    res.status(200).json(solutions);
    
  }

};

exports.get = async (req, res) => {
  const { id } = req.params;
  const solution = await Solution.findByPk(id);
  
  if (!solution) {
    return res.status(404).json({ message: "Solution not found" });
  }

  // Append the challenge title to the solution
  const challenge = await Challenge.findByPk(solution.challengeId);
  solution.dataValues.challengeTitle = challenge.title;
  
  // Append the user data to the solution
  const user = await User.findByPk(solution.userId);
  solution.dataValues.User = user;

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
  try {
    const { challengeId, title, description } = req.body;
    let diagram = null;

    if (req.file) {
      diagram = req.file.filename; // Store just the filename, not the full path
    }

    const userId = req.user.username;

    console.log(`Creating Solution /w ${challengeId}, ${userId}`);

    const newSolution = await Solution.create({
      challengeId,
      userId: userId,
      title,
      description,
      diagram,
    });

    const challenge = await Challenge.findByPk(challengeId);

    // Update user score
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (challenge.difficulty === "easy") {
        user.score += 10;
      } else if (challenge.difficulty === "medium") {
        user.score += 20;
      } else if (challenge.difficulty === "hard") {
        user.score += 30;
      } else {
        console.error('Error finding challenge difficulty: ', challenge.difficulty);
      }

      await user.save();
    } catch (error) {
      console.error('Error updating user score:', error);
      return res.status(500).send('Server error');
    }

    res.status(201).json(newSolution);

    // Prepare AI feedback and submit it as a comment!
    if (diagram) {
      const [chainRunId, feedback] = await AITA.feedback_for_post(
        newSolution,
        challenge,
        `${STORAGE_CONFIG.location}/${diagram}`,
      );
      await Comment.create({
        text: feedback,
        userId: "AITA",
        solutionId: newSolution.id,
        runId: chainRunId,
      });
      console.log("AITA gave feedback!");
    }
  } catch (error) {
    console.error("Error creating solution:", error);
    res.status(500).json({ error: "An error occurred while creating the solution." });
  }
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

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Solution.destroy({ where: { id } });
  res.status(204).send();
  fs.unlink(`${STORAGE_CONFIG.location}/${solution.diagram}`, (err) =>
  console.log(err),
  );
};