const Comment = require("../controllers/CommentController");
const router = require("express").Router();

const {
  AsyncWrapController,
} = require("../middleware/ErrorHandlingMiddleware");
const checkRole = require("../middleware/CheckRoleMiddleware");

AsyncWrapController(Comment);

// Get all comments for the user.
router.get("/user/:username", Comment.getUserComments);

// Get comments for a solution.
router.get("/:solutionId", Comment.get);

// Create a new comment for a solution in the database.
router.post("/", Comment.create);

// Edit a comment for a solution in the database.
router.put("/:id", Comment.edit);

// Delete a comment for a solution from the database.
router.delete("/:id", Comment.delete);

// Reply to a comment
router.post("/reply/:parentId", Comment.reply);

// Upvote a comment
router.post("/upvote/:commentId", Comment.upvote);

module.exports = router;
