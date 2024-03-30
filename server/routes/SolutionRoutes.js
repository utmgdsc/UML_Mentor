const {
  AsyncWrapController,
} = require("../middleware/ErrorHandlingMiddleware");
const checkRole = require("../middleware/CheckRoleMiddleware");

const Solution = require("../controllers/SolutionController");
AsyncWrapController(Solution);
const Challenge = require("../controllers/ChallengeController");
AsyncWrapController(Challenge);

const express = require("express");
const STORAGE_CONFIG = require("../storage_config.json");

const router = express.Router();

// Multer file upload stuff
// Saves the uploaded files into ./file_uploads/
const multer = require("multer");
const storage = multer.diskStorage({
  destination: STORAGE_CONFIG.location,
});
const upload = multer({ storage: storage });

// Serves ./file_uploads as a static file directory
// from /api/solutions/diagrams/<filename>
router.use("/diagrams", express.static(STORAGE_CONFIG.location));

// Get solutions from the database.
router.get("/", Solution.getAll);

router.get("/recent/:n", Solution.getNrecent);

// Get individual solution by id
router.get("/:id", Solution.get);

// Get all comments for a solutions.
// Sorting (by date or upvote) happens on the client side.
// router.get("/:id", Challenge.getComments);

// Create a new solution in the database.
router.post("/", upload.single("diagram"), Solution.create);

// Edit a solution in the database.
router.put("/:id", upload.single("diagram"), Solution.edit);

// Upvote a solution in the database.
// However Vlad said we shouldn't worry about upvoting a solution for now. Just
// worry about upvoting comments.
// router.put("/:id", Solution.upvote);

// Delete a solution from the database.
router.delete("/:id", checkRole(['admin']), Solution.delete);

module.exports = router;
