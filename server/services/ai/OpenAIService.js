// server/services/ai/OpenAIService.js
const { OpenAI } = require('openai');
const { UMLFormatter } = require('../uml/UMLFormatter');

class OpenAIService {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
  }

  async analyzeUMLDiagram(umlData, challengeContext) {
    const formattedUML = UMLFormatter.formatForAI(umlData.nodes, umlData.edges);

    const systemPrompt = `You are an expert software architect and educator specializing in UML diagram analysis. 
Your task is to:
1. Analyze the provided UML diagram for correctness and best practices
2. Evaluate how well it solves the given challenge
3. Suggest specific improvements
4. Check for SOLID principle violations
5. Assess the overall design quality

Format your response in clear sections:
- Overall Assessment
- Design Strengths
- Areas for Improvement
- SOLID Principles Analysis
- Specific Recommendations`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `
Challenge Title: ${challengeContext.title}
Challenge Description: ${challengeContext.description}

${formattedUML}

Please provide a comprehensive analysis of this UML diagram in relation to the challenge.`
          }
        ],
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }
}

module.exports = OpenAIService;
