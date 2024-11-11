// server/controllers/guardrails-controller.js
const axios = require('axios');

require('dotenv').config();
const API_KEY = process.env.API_KEY;

const PERSPECTIVE_API_URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;

class GuardrailsController {
    async analyzeText(req, res) {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        try {
            const response = await axios.post(PERSPECTIVE_API_URL, {
                comment: { text },
                languages: ['en'],
                requestedAttributes: {
                    TOXICITY: {},
                    INSULT: {},
                    FLIRTATION: {},
                    IDENTITY_ATTACK: {},
                    PROFANITY: {}
                }
            });

            var check = true;

            const attributes = response.data.attributeScores;
            const toxicity = attributes.TOXICITY.summaryScore.value;
            const insult = attributes.INSULT.summaryScore.value;
            const flirtation = attributes.FLIRTATION.summaryScore.value;
            const identityAttack = attributes.IDENTITY_ATTACK.summaryScore.value;
            const off_topic = attributes.IDENTITY_ATTACK.summaryScore.value;

            const result = toxicity > 0.3 || insult > 0.3 || flirtation > 0.3 || 
                          identityAttack > 0.3 || off_topic > 0.6
                ? 'The Solution may be off-topic, rude, or irrelevant.'
                : 'The Solution appears to be relevant.';

            if (toxicity > 0.3 || insult > 0.3 || flirtation > 0.6 || 
            identityAttack > 0.3 || off_topic > 0.6){
                check = false;
            }

            return res.json({ 
                result,
                scores: {
                    toxicity,
                    insult,
                    flirtation,
                    identityAttack,
                    off_topic
                }
            });
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            return res.status(500).json({ error: 'Failed to analyze text' });
        }
    }
}

module.exports = new GuardrailsController();