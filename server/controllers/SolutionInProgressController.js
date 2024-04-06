const db = require("../models/index");
const SolutionInProgress = db.SolutionInProgress;

exports.findMyInProgress = async (req, res) => {
    const userId = req.user.username;
    const solutions = await SolutionInProgress.findAll({ where: { userId } });
    res.status(200).json(solutions);
}


// NOTE: This method is used only for testing. Do not run in production!
exports.findAll = async (req, res) => {
    //NOTE: in the future we will need to pass the offset for the limit
    const solutions = await SolutionInProgress.findAll({limit: 50});
    res.status(200).json(solutions);
}

//NOTE: This method is not to be used in the current version of the app.
// exports.findOne = async (req, res) => {

// }

exports.findOneByChallengeId = async (req, res) => {
    const userId = req.user.username;
    const { challengeId } = req.params;

    const solution = await SolutionInProgress.findOne({ where: { challengeId: challengeId, userId: userId } });
    if (solution === null) {
        return res.status(404).json({ error: "No solution in progress found for this challenge." });
    }

    res.status(200).json(solution);
}

exports.create = async (req, res) => {
    const userId = req.user.username;
    const { xml, title, challengeId  } = req.body;

    // Verify that the combination of challengeId and userId is unique
    // (i.e. the user has not started a solution for this challenge)
    const oldSolution = await SolutionInProgress.findOne({ where: { challengeId: challengeId, userId: userId } });
    if (oldSolution !== null) {
        return res.status(400).json({ error: "A solution in progress already exists for this user and challenge." });
    }

    const newSolution = await SolutionInProgress.create({ challengeId, userId, title, diagram: xml});
    res.status(201).json(newSolution);
}

exports.edit = async (req, res) => {
    const { id } = req.params;
    const { xml, title } = req.body;

    const solution = await SolutionInProgress.findByPk(id);
    await solution.update({ title, diagram: xml });

    res.status(200).json(solution);
}

exports.delete = async (req, res) => {
    const { id } = req.params;
    const solution = await SolutionInProgress.findByPk(id);
    // make sure the solution userid matches the token userid
    if (solution.userId !== req.headers.userid) {
        return res.status(403).json({ error: "You do not have permission to delete this solution." });
    }

    await solution.destroy();
    res.status(204).end();
}

exports.deleteAll = async (req, res) => {
    //make sure the request is coming from the admin
    if (req.user.username !== "admin") {
        return res.status(403).json({ error: "You do not have permission to delete all solutions in progress." });
    }

    await SolutionInProgress.destroy({ where: {} });
    res.status(204).end();
}