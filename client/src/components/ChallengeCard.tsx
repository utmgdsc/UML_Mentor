import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";
import { StarFill } from "react-bootstrap-icons";

enum Difficulty {
  easy = "easy",
  medium = "medium",
  hard = "hard",
}

// TODO: extract challenge into its own type

type ChallengeCardProps = {
  title: string;
  description: string;
  href: string;
  difficulty: Difficulty;
};

const DIFFICULTY_TO_STARCOUNT = {
  easy: 1,
  medium: 2,
  hard: 3,
};

function ChallengeCard({
  title,
  description,
  href,
  difficulty,
}: ChallengeCardProps) {
  return (
    <Card>
      <Card.Header>
        {Array(DIFFICULTY_TO_STARCOUNT[difficulty]).map((_, index) => (
          <StarFill key={index} />
        ))}
      </Card.Header>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button href={href}>Solve</Button>
      </Card.Body>
    </Card>
  );
}

export type { ChallengeCardProps };
export default ChallengeCard;
