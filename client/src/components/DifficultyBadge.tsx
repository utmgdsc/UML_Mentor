import { ChallengeDifficulties } from '../types/challengeDifficulties';
import { Badge } from 'react-bootstrap';

function getDifficulty(difficulty: ChallengeDifficulties): string{
    switch(difficulty){
        case ChallengeDifficulties.EASY:
            return "success";
        case ChallengeDifficulties.MEDIUM:
            return "warning";
        case ChallengeDifficulties.HARD:
            return "danger";
    }
}

type DifficultyBadgeProps = {
    difficulty: ChallengeDifficulties;
};

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
    const badgeColor: string = getDifficulty(difficulty);
    let badgeText: string;

    switch (difficulty) {
        case ChallengeDifficulties.EASY:
            badgeText = "EASY";
            break;
        case ChallengeDifficulties.MEDIUM:
            badgeText = "MEDIUM";
            break;
        case ChallengeDifficulties.HARD:
            badgeText = "HARD";
            break;
    }

    return (
        <div className="float-end">
            <Badge 
              className={"bg-" + badgeColor + " fw-bold p-2  border border-1 " + "border-" + badgeColor}
              style={{fontSize: "1rem", width: "6rem"}}
            >
                {badgeText}
            </Badge>
            <span className="visually-hidden">difficulty level</span>
        </div>
    );
};

export default DifficultyBadge;