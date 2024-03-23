const Comment = require("../controllers/CommentController");
const router = require("express").Router();
const { AsyncWrapController } = require("../middleware/ErrorHandlingMiddleware");
const checkRole = require("../middleware/CheckRoleMiddleware");

AsyncWrapController(Comment);

router.get("/:solutionId", checkRole(['user', 'admin']), Comment.get);
router.post("/:id", checkRole(['user', 'admin']), Comment.create);
router.put("/:id", checkRole(['user', 'admin']), Comment.edit);
router.delete("/:id", checkRole(['user', 'admin']), Comment.delete);

module.exports = router;
