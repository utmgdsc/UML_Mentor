const express = require("express");
const instructionsController = require("../controllers/InstructionController");
const router = express.Router();

router.get('/instructions', instructionsController.getInstructions);
module.exports = router;