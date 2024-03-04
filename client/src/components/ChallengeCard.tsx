import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";
import { StarFill } from "react-bootstrap-icons";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort.ts";
import { useMemo } from "react";

function ChallengeCard({
  title,
  generalDescription,
  id,
  difficulty,
}: ChallengeDetailsShort) {
  const difficultyStars = useMemo(
    () =>
      Array.from({ length: difficulty + 1 }, (_, i) => <StarFill key={i} />),
    [difficulty],
  );

  return (
    <Card>
      <Card.Header>{difficultyStars}</Card.Header>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{generalDescription}</Card.Text>
        <Button href={"/challenge/" + id}>Solve</Button>
      </Card.Body>
    </Card>
  );
}

export default ChallengeCard;
