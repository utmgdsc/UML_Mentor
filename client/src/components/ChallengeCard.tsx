import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";
import { StarFill } from "react-bootstrap-icons";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort.ts";
import { Link } from "react-router-dom";
import { useCallback } from "react";

function ChallengeCard({
  title,
  generalDescription,
  id,
  difficulty,
}: ChallengeDetailsShort) {

  const getDifficultyStars = useCallback((difficulty: number) => {
    return Array.from({ length: difficulty + 1 }, (_, i) => <StarFill key={i} />);
  }, [difficulty]);

  return (
    <Card>
      <Card.Header>
         {getDifficultyStars(difficulty)}
      </Card.Header>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{generalDescription}</Card.Text>
        <Link style={{textDecoration: "none"}} to={"/challenge/" + id}>
          <Button>
            Solve
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default ChallengeCard;
