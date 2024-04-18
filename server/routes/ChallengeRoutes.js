const Challenge = require("../controllers/ChallengeController");

const router = require("express").Router();

const {
  AsyncWrapController,
} = require("../middleware/ErrorHandlingMiddleware");

const checkRole = require("../middleware/CheckRoleMiddleware");

AsyncWrapController(Challenge);

// Get all challenges for which SolutionsInProgress exist for the user.
router.get("/inprogress/user/:username", Challenge.findUserInProgress);

// Get the suggested challenges for the currently logged in user.
router.get("/suggested", Challenge.findSuggested);

// Get all challenges from the database.
router.get("/", Challenge.findAll);

// Get a challenge from the database.
router.get("/:id", Challenge.findOne);

// Get all solutions from a challenge. NOT GOING TO WORK AS IS
// Sorting (by date or upvote) happens on the client side.
// router.get("/:id", Challenge.getSolutions);

// Create a new challenge in the database.
router.post("/", checkRole(["admin"]), Challenge.create);

// Edit a challenge in the database.
// router.put("/:id", Challenge.edit);

// Delete a challenge from the database.
router.delete("/:id", checkRole(["admin"]), Challenge.delete);

module.exports = router;
