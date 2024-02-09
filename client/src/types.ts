export enum ChallengeDifficulties {
    EASY,
    MEDIUM,
    HARD
}

export type ChallengeDetails = {
    title: string;
    outcome: string;
    difficulty: ChallengeDifficulties;
    generalDescription: string;
    keyPatterns: Array<string>;
    expectedFunctionality: object;
    usageScenarios: object;
}