const Comment = require("../controllers/CommentController");
const router = require("express").Router();

const {
  AsyncWrapController,
} = require("../middleware/ErrorHandlingMiddleware");
const checkRole = require("../middleware/CheckRoleMiddleware");

AsyncWrapController(Comment);

// Get comments for a solution.
router.get("/:solutionId", checkRole(['user', 'admin']), Comment.get);

// Create a new comment for a solution in the database.
router.post("/:id", checkRole(['user', 'admin']), Comment.create);

// Edit a comment for a solution in the database.
router.put("/:id", checkRole(['user', 'admin']), Comment.edit);

// Delete a comment for a solution from the database.

// Reply to a comment
router.post("/reply/:parentId", Comment.reply);

module.exports = router;
