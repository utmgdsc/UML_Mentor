const Challenge = require('../controllers/ChallengeController');
const router = require("express").Router();
const checkRole = require('./middleware/checkRole');

// Get all challenges from the database.
router.get("/", Challenge.findAll);

// Get a challenge from the database.
router.get("/:id", Challenge.findOne);

// Get all solutions from a challenge. NOT GOING TO WORK AS IS
// Sorting (by date or upvote) happens on the client side.
// router.get("/:id", Challenge.getSolutions);

// Create a new challenge in the database.
// router.post("/:id", Challenge.create);

// Edit a challenge in the database.
// router.put("/:id", Challenge.edit);

// Delete a challenge from the database.
// router.delete("/:id", Challenge.delete);

module.exports = router;
