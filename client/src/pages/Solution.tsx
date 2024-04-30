import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SolutionData } from "../types/SolutionData.ts";
import { CommentData } from "../types/CommentData.ts";
import Button from "../components/Button.tsx";
import Comment from "../components/Comment.tsx";
import useCheckRole from "../hooks/useCheckRole"; // Make sure the path is correct
import dayjs from "dayjs";

function loadSolution(id, setter) {
  fetch(`/api/solutions/${id}`)
    .then((resp) => resp.json())
    .then((data) => setter(data))
    .catch((err) => {
      console.error(err);
    });
}

function loadComments(id, setter) {
  fetch(`/api/comments/${id}`)
    .then((resp) => resp.json())
    .then((data) => setter(data))
    .catch((err) => {
      console.error(err);
    });
}

const Solution = () => {
  const { id } = useParams();
  const [solutionData, setSolutionData] = useState<SolutionData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const { isAdmin, isLoading } = useCheckRole();
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (id) {
      loadSolution(id, setSolutionData);
      loadComments(id, setComments);
    }
  }, [id]);

  useEffect(() => {
    fetch("/api/users/whoami")
      .then((response) => response.json())
      .then((data) => {
        setCurrentUserId(data.username);
      })
      .catch((error) => {
        console.error("Error fetching current user ID:", error);
      });
  }, []);

  const handleDeleteSolution = () => {
    if (!isAdmin && solutionData.userId !== currentUserId) return;
    fetch(`/api/solutions/${id}`, { method: "DELETE" })
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Failed to delete solution", err);
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = (commentId) => {
    if (!isAdmin) return;
    fetch(`/api/comments/${commentId}`, { method: "DELETE" })
      .then(() => {
        setComments((comments) =>
          comments.filter((comment) => comment.id !== commentId),
        );
      })
      .catch((err) => {
        console.error("Failed to delete comment", err);
      });
  };

  const handleSubmit = (parentId, text) => {
    const endpoint = parentId
      ? `/api/comments/reply/${parentId}`
      : `/api/comments/${solutionData.id}`;
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solutionId: solutionData.id, text }),
    })
      .then(() => {
        loadComments(id, setComments);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Container className="my-5" fluid="sm">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2>Solution</h2>
          {solutionData && (
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>By: {solutionData.userId}</strong>
                  <small>
                    {dayjs(solutionData.createdAt).format("MMMM D, YYYY")}
                  </small>
                </div>
              </Card.Header>
              <Card.Body>
                <Card.Title>{solutionData.title}</Card.Title>
                <Card.Text>{solutionData.description}</Card.Text>

                {solutionData.diagram && (
                  <Card.Img
                    variant="bottom"
                    src={`/api/solutions/diagrams/${solutionData.diagram}`}
                    alt="Solution Diagram"
                  />
                )}
              </Card.Body>
              {isAdmin || solutionData.userId === currentUserId ? (
                <Card.Footer>
                  <Button variant="danger" onClick={handleDeleteSolution}>
                    Delete Solution
                  </Button>
                </Card.Footer>
              ) : null}
            </Card>
          )}
        </Col>
      </Row>
      <Row className="mt-5 justify-content-center">
        <Col md={6}>
          <h2>Comments</h2>
          <Comment editable={true} onSubmit={handleSubmit} />
          {comments &&
            comments.map((comment) => (
              <div key={comment.id}>
                <Comment
                  comment={comment}
                  editable={false}
                  onSubmit={handleSubmit}
                />
                {isAdmin && (
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleDelete(comment.id);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Solution;
