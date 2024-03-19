const User = require("../controllers/UserController");
const router = require("express").Router();
const { AsyncWrapController } = require("../routes/ErrorHandlingMiddleware");

AsyncWrapController(User);

router.get("headers",User.getHeaders);
// Get a user from the database.
router.get("/:id", checkRole(['user', 'admin']), User.get);

// Create a new user in the database.(Is it only an admin task?)
router.post("/", checkRole(['user','admin']), User.create); 

// Update a user in the database.
router.put("/:id", checkRole(['user', 'admin']), User.update);

// Delete a User from the database.
router.delete("/:id", checkRole(['admin']), User.delete);


module.exports = router;