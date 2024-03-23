const User = require("../controllers/UserController");
const router = require("express").Router();
const { AsyncWrapController } = require("../middleware/ErrorHandlingMiddleware");
const checkRole = require("../middleware/CheckRoleMiddleware");
AsyncWrapController(User);

router.get("/:id", User.get);
router.post("/:id", checkRole(['admin']), User.create);
router.put("/:id", checkRole(['admin']), User.update);
router.delete("/:id", checkRole(['admin']), User.delete);

module.exports = router;
