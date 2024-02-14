const db = require("../models/index");
const Challenge = db.Challenge;

exports.findOne = async (req, res) => {
	try {
        const challenge_id = req.params.id;


        // const challenge = await Challenge.findOne({
        //     where: { 
        //         id: challenge_id ,
        //         // userId: req.user.id //Set up properly after done authentication
        //     },
        // });

        //FOR TESTING
        const challenge = {
            "id": 1,
            "difficulty": "Easy",
            "title": "Simple Blogging Platform",
            "outcome": "A basic platform for users to create and publish blog posts.",
            "keyPatterns": ["Factory Method pattern for creating different types of blog posts."],
            "generalDescription": "Creation and editing of blog posts, comment management, and basic user profiles.",
            "expectedFunctionality": {
                "CreatePost": "Create a new Text, Photo or Image post."
            },
            "usageScenarios": {
                "TextPost": "Users can write and format text, add tags, and categorize their posts.",
                "PhotoPost": "Users can upload images, create galleries, and add brief descriptions.",
                "VideoPost": "Users can embed videos from platforms like YouTube or upload directly."
            }
        }

        res.status(200).json(challenge);
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