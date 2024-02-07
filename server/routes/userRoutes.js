const User = require('../models/User');
const router = require("express").Router()

// Create a new user in the database.
route.post("/:id", User.create)

// Find a user in the database.
router.get("/:id", User.find)

// Update a user in the database.
router.put("/:id", User.update)

// Delete a User from the database.
router.delete("/:id", User.delete)

module.exports = router
