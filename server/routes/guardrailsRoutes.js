// server/routes/guardrailsRoutes.js
const Guardrails = require("../controllers/guardrails-controller");
const router = require("express").Router();
const {
    AsyncWrapController,
} = require("../middleware/ErrorHandlingMiddleware");

AsyncWrapController(Guardrails);

// Analyze text using Perspective API
router.post("/analyze", Guardrails.analyzeText);

module.exports = router;