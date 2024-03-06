const db = require("../models/index");
const Solution = db.Solution;
const Comment = db.Comment;

exports.get = async (req, res) => {
    try {
        const sampleSolutions = [
            {
                challengeId: 1,
                userId: "Alex Apostolu",
                description: "Make a Factory Design Pattern",
                title: "Factory Design Pattern"
            }
        ];

        res.status(200).json(sampleSolutions);
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const solution = await Solution.findByPk(id);
        if (!solution) {
            return res.status(404).json({ message: "Solution not found" });
        }
        const comments = await solution.getComments();
        res.status(200).json(comments);
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.create = async (req, res) => {
    try {
        const { challengeId, userId } = req.body;
        const newSolution = await Solution.create({ challengeId, userId });
        res.status(201).json(newSolution);
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const { challengeId, userId } = req.body;
        await Solution.update({ challengeId, userId }, { where: { id } });
        const updatedSolution = await Solution.findByPk(id);
        res.status(200).json(updatedSolution);
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await Solution.destroy({ where: { id } });
        res.status(204).send();
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}
