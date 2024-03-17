const SolutionInProgress = require('../controllers/SolutionInProgressController');
const router = require("express").Router();

router.get("/", SolutionInProgress.findAll);

// Get a solution in progress by its challenge id and (and user id) from the database.
router.get("/challenge/:challengeId", SolutionInProgress.findOneByChallengeId);

// Get a solution in progress by its id from the database.
router.get("/:id", SolutionInProgress.findOne);


// Create a new solution in the database.
router.post("/", SolutionInProgress.create);

// Edit a solution in the database.
router.put("/:id", SolutionInProgress.edit);


// Delete a solution from the database.
router.delete("/:id", SolutionInProgress.delete);

// DEVELOPMENT ONLY!
// router.delete("/", SolutionInProgress.deleteAll);

module.exports = router;