import { ChallengeDifficulties } from './challengeDifficulties';

export type ChallengeDetails = {
    title: string;
    outcome: string;
    difficulty: ChallengeDifficulties;
    generalDescription: string;
    keyPatterns: Array<string>;
    expectedFunctionality: object;
    usageScenarios: object;
}