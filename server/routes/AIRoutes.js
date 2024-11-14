// server/routes/AIRoutes.js
const express = require('express');
const AIController = require('../controllers/AIController');
const authMiddleware = require('../middleware/AuthenticationMiddleware');

const router = express.Router();
const aiController = new AIController(process.env.OPENAI_API_KEY);

router.post('/analyze-uml', 
  (req, res) => {
    console.log('Received UML data for analysis:', req.body);
    aiController.analyzeUML(req, res);
  }
);

// router.post('/analyze-uml', 
//   authMiddleware,
//   (req, res) => aiController.analyzeUML(req, res)
// );

module.exports = router;
