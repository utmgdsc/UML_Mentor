import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";
import { StarFill } from "react-bootstrap-icons";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort.ts";
import { useMemo, useState } from "react";
import { ButtonToolbar } from "react-bootstrap";

function ChallengeCard({
  title,
  generalDescription,
  id,
  difficulty,
  completed,
  admin
}: ChallengeDetailsShort) {
  const [deleted, setDeleted] = useState(false);

  const difficultyStars = useMemo(
    () =>
      Array.from({ length: difficulty + 1 }, (_, i) => <StarFill key={i} />),
    [difficulty],
  );

  const backgroundColor = completed ? "bg-success-subtle" : "";

  function handleDelete() {
    // ask the user to confirm the deletion
    if (!window.confirm("Are you sure you want to delete the challenge '" + title + "'?")) {
      return;
    }

    fetch("/api/challenges/" + id, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        console.log("Challenge deleted");
        // unmount the challenge card
        setDeleted(true);
      } else {
        console.log("Failed to delete challenge");
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  if (deleted) {
    return null;
  }
  return (
    <Card>
      <Card.Header className={backgroundColor}>
        {difficultyStars}
      </Card.Header>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{generalDescription}</Card.Text>
        <ButtonToolbar className="d-flex justify-content-between">
          <Button href={"/challenge/" + id}>Solve</Button>
          {admin && <Button variant="danger" onClick={() => {handleDelete()}}>Delete</Button>}
        </ButtonToolbar>
        
      </Card.Body>
    </Card>
  );
}

export default ChallengeCard;
