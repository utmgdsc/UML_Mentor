// server/controllers/AIController.js
const OpenAIService = require('../services/ai/OpenAIService');

class AIController {
  constructor(openAiKey) {
    this.aiService = new OpenAIService(openAiKey);
  }

  analyzeUML = async (req, res) => {
    try {
      console.log('here')
      const { nodes, edges } = req.body.umlData;
      const { challengeTitle, challengeDescription } = req.body;

      const analysis = await this.aiService.analyzeUMLDiagram(
        { nodes, edges },
        { 
          title: challengeTitle, 
          description: challengeDescription 
        }
      );

      res.json({ analysis });
    } catch (error) {
      res.status(500).json({ 
        error: "Error analyzing UML diagram", 
        details: error.message 
      });
    }
  }
}

module.exports = AIController;
