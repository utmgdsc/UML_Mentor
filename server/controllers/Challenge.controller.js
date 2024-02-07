const db = require("../models/index");
const Challenge = db.Challenge;

exports.get = async (req, res) => {
	try {
        const challenges = await Challenge.findAll();
        res.status(200).json(challenges);
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getSolutions = async (req, res) => {
	try {
        const id = req.body;
        const solutions = await axios.get(id);
        res.status(200).json(solutions.data);
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.create = async (req, res) => {
	try {
        const { description, title } = req.body;
        const newChallenge = await Challenge.create({ description, title });
        res.status(201).json(newChallenge);
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.edit = async (req, res) => {
	try {
        const { id } = req.params;
        const { description, title } = req.body;
        await Challenge.update({ description, title }, { where: { id } });
        const updatedChallenge = await Challenge.findByPk(id);
        res.status(200).json(updatedChallenge);
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.delete = async (req, res) => {
	try {
        const { id } = req.params;
        await Challenge.destroy({ where: { id } });
        res.status(204).send();
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}