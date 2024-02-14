import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";
import { StarFill } from "react-bootstrap-icons";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort.ts";
// TODO: extract challenge into its own type
import { Link } from "react-router-dom";


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
