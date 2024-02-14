import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";
import { StarFill } from "react-bootstrap-icons";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort.ts";
// TODO: extract challenge into its own type



function ChallengeCard({
  title,
  generalDescription,
  id,
  difficulty,
}: ChallengeDetailsShort) {

  function getDifficulty(): JSX.Element[] {
    const difficultyList: JSX.Element[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    for (let i = 0; i <= difficulty; i++) {
      difficultyList.push(<StarFill key={i} />);
    }
    return difficultyList;
  }

  return (
    <Card>
      <Card.Header>
        {getDifficulty()}
      </Card.Header>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{generalDescription}</Card.Text>
        <Button href={"/challenge/" + id}>Solve</Button>
      </Card.Body>
    </Card>
  );
}

export default ChallengeCard;
