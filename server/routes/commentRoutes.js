const Comment = require('../models/Comment');

function getAllChallenges(req, res) {
    Challenge.find()
        .then(challenges => res.json(challenges))
        .catch(err => res.status(500).json({ error: err.message }));
}

function createChallenge(req, res) {
    const challenge = new Challenge(req.body);
    challenge.save()
        .then(newChallenge => res.status(201).json(newChallenge))
        .catch(err => res.status(400).json({ error: err.message }));
}

module.exports = { getAllChallenges, createChallenge };
