const User = require('../controllers/UserController');
const router = require("express").Router();

router.get("/", User.findAll);

// Get a user from the database.
router.get("/:id", User.get);

// Create a new user in the database.
router.post("/:id", User.create);

// Update a user in the database.
router.put("/:id", User.update);

// Delete a User from the database.
router.delete("/:id", User.delete);

module.exports = router;
