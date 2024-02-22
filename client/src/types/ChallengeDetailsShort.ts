import { ChallengeDifficulties } from './challengeDifficulties';

export type ChallengeDetailsShort = {
    title: string;
    difficulty: ChallengeDifficulties;
    generalDescription: string;
    id: number;
}