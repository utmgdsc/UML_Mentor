const User = require("../controllers/UserController");
const router = require("express").Router();

const {
  AsyncWrapController,
} = require("../middleware/ErrorHandlingMiddleware");
const checkRole = require("../middleware/CheckRoleMiddleware");

AsyncWrapController(User);

// Get the currently logged in user.
router.get("/whoami", User.getMe);

// Get a user from the database.
router.get("/:username", User.get);

// USE FOR ADDING ADMINS
router.post("/", checkRole(["admin"]), User.create);

// Update a user in the database.
router.put("/:username", checkRole(["admin"]), User.update);

// Delete a User from the database.
router.delete("/:username", checkRole(["admin"]), User.delete);

module.exports = router;
