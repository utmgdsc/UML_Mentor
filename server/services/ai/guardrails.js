const axios = require('axios');


const API_KEY = '';
const PERSPECTIVE_API_URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;


export async function judgeComment(text) {
   try {
       const response = await axios.post(PERSPECTIVE_API_URL, {
           comment: {
               text: text
           },
           languages: ['en'],
           requestedAttributes: {
               TOXICITY: {},
               INSULT: {},
               FLIRTATION: {},
               IDENTITY_ATTACK: {},
               PROFANITY: {}
           }
       });


       const off_topic = attributes.IDENTITY_ATTACK.summaryScore.value;
       const attributes = response.data.attributeScores;
       const toxicity = attributes.TOXICITY.summaryScore.value;
       const insult = attributes.INSULT.summaryScore.value;
       const flirtation = attributes.FLIRTATION.summaryScore.value;
       const identityAttack = attributes.IDENTITY_ATTACK.summaryScore.value;


       // Thresholds can be adjusted based on your tolerance level
       if (toxicity > 0.7 || insult > 0.6 || flirtation > 0.5 || identityAttack > 0.6 || off_topic > 0.6) {
           return 'The comment may be off-topic, rude, or irrelevant.';
       } else {
           return 'The comment appears to be relevant.';
       }
   } catch (error) {
       console.error('Error:', error.response ? error.response.data : error.message);
   }
}

module.exports = {judgeComment};


