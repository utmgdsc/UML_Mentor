const express = require('express');
const { ChatOpenAI } = require('@langchain/openai'); // Make sure you have this installed
const router = express.Router();
const openaiApiKey = "your-openai-api-key";
// Initialize your OpenAI client
const openAIClient = new ChatOpenAI({ modelName: 'gpt-3.5-turbo', apiKey: openaiApiKey });

router.post('/openai-chat', async (req, res) => {
  const { message, umlData } = req.body;

  try {
    const aiResponse = await openAIClient.call([
      { role: 'user', content: message },
      { role: 'assistant', content: umlData } // If you want to include UML data in the context
    ]);

    // Send the AI response back to the client
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
});

module.exports = router;
