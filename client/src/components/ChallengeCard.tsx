import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";
import { StarFill } from "react-bootstrap-icons";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort.ts";
import { useMemo, useState } from "react";
import { ButtonToolbar, Badge } from "react-bootstrap";

function ChallengeCard({
  title,
  generalDescription,
  id,
  difficulty,
  completed,
  isAdmin,
  hidden,
  keyPatterns,
  solutionCount,
}: ChallengeDetailsShort) {
  const [deleted, setDeleted] = useState(false);

  const difficultyStars = useMemo(
    () =>
      Array.from({ length: difficulty + 1 }, (_, i) => (
        <StarFill
          key={i}
          style={{
            color:
              difficulty === 0
                ? "green"
                : difficulty === 1
                  ? "#DAA520"
                  : difficulty === 2
                    ? "red"
                    : "black", // Default to black for other cases
          }}
        />
      )),
    [difficulty]
  );

  const backgroundColor = completed ? "bg-success-subtle" : "";

  function handleDelete() {
    if (
      !window.confirm(
        "Are you sure you want to delete the challenge '" + title + "'?"
      )
    ) {
      return;
    }

    fetch("/api/challenges/" + id, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Challenge deleted");
          setDeleted(true);
        } else {
          console.log("Failed to delete challenge");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleHide(hidden: boolean) {
    fetch("/api/challenges/hide/" + id, {
      method: "PUT",
      body: JSON.stringify({ hidden }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Challenge hidden");
          setDeleted(true);
        } else {
          console.log("Failed to hide challenge");
        }
        return response.json();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  if (deleted) {
    return null;
  }

  // Split pattern names from keyPatterns and render them as tags
  const patternTags = keyPatterns.map((pattern, index) => {
    const patternName = pattern.split(" ")[0]; // Get only the first word (e.g., "Strategy", "Factory", etc.)
    return (
      <Badge
        key={index}
        bg="light"
        text="dark"
        style={{
          border: "1px solid #ccc", // Rectangle boundary
          padding: "5px 10px", // Padding inside the tags
          marginRight: "5px",
          marginBottom: "5px",
          whiteSpace: "nowrap",
          borderRadius: "5px", // Rounded corners for a cleaner look
        }}
      >
        {patternName}
      </Badge>
    );
  });

  return (
    <Card>
      <Card.Header className={backgroundColor}>{difficultyStars}</Card.Header>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        {/* Render tags in a flexbox container */}
        <div
          className="d-flex flex-wrap"
          style={{
            gap: "5px", // Gap between the tags
          }}
        >
          {patternTags}
          <Badge
            pill
            bg={"secondary"}
            style={{
              border: "1px solid #ccc", // Rectangle boundary
              padding: "5px 10px", // Padding inside the tags
              marginRight: "5px",
              marginBottom: "5px",
              whiteSpace: "nowrap",
              borderRadius: "5px", // Rounded corners for a cleaner look
            }}
          >
            {`${solutionCount || 0}`}
          </Badge>
        </div>
        <Card.Text className="mt-3">{generalDescription}</Card.Text>
        <ButtonToolbar className="d-flex justify-content-between">
          <Button href={"/challenge/" + id}>Solve</Button>
          <div>
            {isAdmin && hidden && (
              <Button
                variant="dark"
                className="mx-2"
                onClick={() => {
                  handleHide(false);
                }}
              >
                Unhide
              </Button>
            )}
            {isAdmin && !hidden && (
              <Button
                variant="dark"
                className="mx-2"
                onClick={() => {
                  handleHide(true);
                }}
              >
                Hide
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="danger"
                onClick={() => {
                  handleDelete();
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </ButtonToolbar>
      </Card.Body>
    </Card>
  );
}

export default ChallengeCard;
