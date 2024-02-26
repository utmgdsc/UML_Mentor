const express = require("express");
const instructionsController = require("../controllers/InstructionsController");
const router = express.Router();

router.get('/instructions', instructionsController.getInstructions);
module.exports = router;