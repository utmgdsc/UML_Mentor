const db = require("../models/index");
const SolutionInProgress = db.SolutionInProgress;

// NOTE: This method is used only for testing. Do not run in production!
exports.findAll = async (req, res) => {
    try {
        //NOTE: in the future we will need to pass the offset for the limit
        const solutions = await SolutionInProgress.findAll({limit: 50});
        res.status(200).json(solutions);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//TODO: Implement this method
exports.findOne = async (req, res) => {

}

exports.findOneByChallengeId = async (req, res) => {
    try {
        // TODO: get the userId from the token
        const userId = req.headers.userid;
        const { challengeId } = req.params;
        const solution = await SolutionInProgress.findOne({ where: { challengeId: challengeId, userId: userId } });
        if (solution === null) {
            return res.status(404).json({ error: "No solution in progress found for this challenge." });
        }
        res.status(200).json(solution);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}



exports.create = async (req, res) => {
    try {
        //Note, in the future we will get the userId from the token
        const userId = req.headers.userid;
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
	catch (error) {
        res.status(500).json({ error: error.message });
        
    }
}

exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const { xml, title } = req.body;
        const solution = await SolutionInProgress.findByPk(id);
        await solution.update({ title, diagram: xml });
        res.status(200).json(solution);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
