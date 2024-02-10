import { ChallengeDifficulties } from "./types/challengeDifficulties";

export function getDifficulty(difficulty: ChallengeDifficulties): string{
    switch(difficulty){
        case ChallengeDifficulties.EASY:
            return "var(--bs-teal)";
        case ChallengeDifficulties.MEDIUM:
            return "var(--bs-warning)";
        case ChallengeDifficulties.HARD:
            return "var(--bs-danger)";
    }
}