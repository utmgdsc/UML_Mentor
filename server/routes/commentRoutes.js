const Comment = require('../controllers/Comment.controller');
const router = require("express").Router();

// Get a comment for a solution.
router.get("/:id", Comment.find);

// Create a new comment for a solution in the database.
route.post("/:id", Comment.create);

// Edit a comment for a solution in the database.
router.put("/:id", Comment.edit);

// Delete a comment for a solution from the database.
router.delete("/:id", Comment.delete);

module.exports = router;
