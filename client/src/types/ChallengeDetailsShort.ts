import { ChallengeDifficulties } from './challengeDifficulties';

export type ChallengeDetailsShort = {
    title: string;
    difficulty: ChallengeDifficulties;
    generalDescription: string;
    id: number;
    completed: boolean;
    admin: boolean; // Used for displaying the delete & hide buttons
    hidden: boolean;
}