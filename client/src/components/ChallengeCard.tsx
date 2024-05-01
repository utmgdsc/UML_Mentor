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
  isAdmin,
  hidden,
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

  function handleHide(hidden: boolean) {
    console.log("/api/challenges/hide/" + id);

    fetch("/api/challenges/hide/" + id, {
      method: "PUT",
      body: JSON.stringify({
        hidden: hidden
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      console.log(response);
      if (response.ok) {
        console.log("Challenge hidden");
        // unmount the challenge card
        setDeleted(true);
      } else {
        console.log("Failed to hide challenge");
      }
      return response.json();
    }).then((data) => {
      console.log(data);
    })
    .catch((err) => {
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
          <div>
            {isAdmin && hidden && <Button variant="dark" className="mx-2" onClick={() => {handleHide(false)}}>Unhide</Button>}
            {isAdmin && !hidden && <Button variant="dark" className="mx-2" onClick={() => {handleHide(true)}}>Hide</Button>}
            {isAdmin && <Button variant="danger" onClick={() => {handleDelete()}}>Delete</Button>}
          </div>
        </ButtonToolbar>
        
      </Card.Body>
    </Card>
  );
}

export default ChallengeCard;
