const axios = require('axios');


const API_KEY = 'AIzaSyAkMHNxid9V_4NhKfiqM4qgxpHZFt7PJAA';
const PERSPECTIVE_API_URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;



export async function judgeComment(text: string): Promise<string> {
  console.log('text:', text);
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

       const attributes = response.data.attributeScores;
       const toxicity = attributes.TOXICITY.summaryScore.value;
       const insult = attributes.INSULT.summaryScore.value;
       const flirtation = attributes.FLIRTATION.summaryScore.value;
       const identityAttack = attributes.IDENTITY_ATTACK.summaryScore.value;


       // Thresholds can be adjusted based on your tolerance level
       if (toxicity > 0.7 || insult > 0.6 || flirtation > 0.5 || identityAttack > 0.6) {
           return 'The comment may be off-topic, rude, or irrelevant.';
       } else {
           return 'The comment appears to be relevant.';
       }
   } catch (error) {
       console.error('Error:', error.response ? error.response.data : error.message);
       return 'An error occurred while analyzing the comment.';
   }
}

