const db = require("../models/index");
const User = db.User;

exports.get = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getSolutions = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const solutions = await user.getSolutions();
        res.status(200).json(solutions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const comments = await user.getComments();
        res.status(200).json(comments);
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.create = async (req, res) => {
    try {
        const { username, passwordHash, preferredName, email, score } = req.body;
        const newUser = await User.create({ username, passwordHash, preferredName, email, score });
        res.status(201).json(newUser);
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, passwordHash, preferredName, email, score } = req.body;
        await User.update({ username, passwordHash, preferredName, email, score }, { where: { id } });
        const updatedUser = await User.findByPk(id);
        res.status(200).json(updatedUser);
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        res.status(204).send();
    }
	catch (error) {
        res.status(500).json({ error: error.message });
    }
}
