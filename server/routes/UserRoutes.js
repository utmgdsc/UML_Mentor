const User = require("../controllers/UserController");
const router = require("express").Router();
const {
  AsyncWrapController,
} = require("../middleware/ErrorHandlingMiddleware");

AsyncWrapController(User);

// Get a user from the database.
router.get("/:username", User.get);

// USE FOR ADDING ADMINS
router.post("/", User.create);

// Update a user in the database.
router.put("/:username", User.update);

// Delete a User from the database.
router.delete("/:username", User.delete);

module.exports = router;
