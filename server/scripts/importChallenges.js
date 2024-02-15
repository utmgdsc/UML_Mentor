const db = require("../models/index");
const Challenge = db.Challenge;
const challenges = require("../../challenges.json"); // Import the challenges data

// Sync the challenges data with the database

module.exports = async function importChallenges() {
    

    const easyChallenges = challenges.challenges.easy;
    const mediumChallenges = challenges.challenges.medium;
    const hardChallenges = challenges.challenges.hard;

    // console.log(challenges);

    try {
        easyChallenges.forEach(async (challenge) => {
            const newEasyChallenge = {
                title: challenge.title,
                id: challenge.id,
                difficulty: "easy",
                description: JSON.stringify({
                    outcome: challenge.outcome,
                    keyPatterns: challenge.keyPatterns,
                    generalDescription: challenge.generalDescription,
                    usageScenarios: challenge.usageScenarios
                })
            };

            await Challenge.create(newEasyChallenge);
            });
        }
    catch (error) {
        console.error("Error importing easy challenges: " + error);
    }
    try {
        mediumChallenges.forEach(async (challenge) => {
            const newMediumChallenge = {
                title: challenge.title,
                id: challenge.id,
                difficulty: "medium",
                description: JSON.stringify({
                    outcome: challenge.outcome,
                    keyPatterns: challenge.keyPatterns,
                    generalDescription: challenge.generalDescription,
                    usageScenarios: challenge.usageScenarios
                })
            };

            await Challenge.create(newMediumChallenge);
        });
    } catch (error) {
        console.error("Error importing medium challenges: " + error);
    }
    try {
        hardChallenges.forEach(async (challenge) => {
            const newHardChallenge = {
                title: challenge.title,
                id: challenge.id,
                difficulty: "hard",
                description: JSON.stringify({
                    outcome: challenge.outcome,
                    keyPatterns: challenge.keyPatterns,
                    generalDescription: challenge.generalDescription,
                    usageScenarios: challenge.usageScenarios
                })
            };

            await Challenge.create(newHardChallenge);
        });
    } catch (error) {
        console.error("Error importing hard challenges: " + error);
    }
}