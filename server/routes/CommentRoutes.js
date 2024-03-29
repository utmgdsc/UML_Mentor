const Comment = require("../controllers/CommentController");
const router = require("express").Router();
const {
  AsyncWrapController,
} = require("../middleware/ErrorHandlingMiddleware");

AsyncWrapController(Comment);

// Get a comment for a solution.
router.get("/:solutionId", Comment.get);

// Create a new comment for a solution in the database.
router.post("/:id", Comment.create);

// Edit a comment for a solution in the database.
router.put("/:id", Comment.edit);

// Delete a comment for a solution from the database.
router.delete("/:id", Comment.delete);

module.exports = router;
