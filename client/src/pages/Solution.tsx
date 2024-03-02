import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SolutionData } from "../types/SolutionData.ts";
import { CommentData } from "../types/CommentData.ts";
import Card from "react-bootstrap/Card";
import Button from "../components/Button.tsx";

// export type SolutionData = {
//     id: number;
//     challengeId: number;
//     userId: number;
//     description: string;
//     title: string;
//     diagram: string;
// };

// export type CommentData = {
//     id: number;
//     solutionId: number;
//     userId: number;
//     text: string;
//     helpful: boolean;
// };

function loadSolution(
  id: string,
  setter: React.Dispatch<React.SetStateAction<SolutionData | undefined>>,
) {
  fetch(`/api/solutions/${id}`)
    .then((resp) => resp.json())
    .then((data: SolutionData) => {
      setter(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

function loadComments(
  id: string,
  setter: React.Dispatch<React.SetStateAction<CommentData[] | undefined>>,
) {
  fetch(`/api/comments/${id}`)
    .then((resp) => resp.json())
    .then((data: CommentData[]) => {
      setter(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

const Solution = () => {
  const { id } = useParams();
  const [solutionData, setSolutionData] = useState<SolutionData>();
  const [comments, setComments] = useState<CommentData[]>();
  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would implement the logic to submit the new comment to the backend
    console.log("New Comment:", newComment);
    // Clear the comment input field after submission
    setNewComment("");
  };

  useEffect(() => {
    if (id) {
      loadSolution(id, setSolutionData);
      loadComments(id, setComments);
    }
  }, [id]);

  console.log("solution data", solutionData);
  console.log("comments", comments);

  return (
    <Container>
      <Row sm={2} className="mt-4">
        <Col>
          {solutionData && (
            <Card>
              <Card.Body>
                <Card.Title>{solutionData.title}</Card.Title>
                <Card.Text>{solutionData.description}</Card.Text>
                {solutionData.diagram && (
                  <Card.Img
                    variant="bottom"
                    src={solutionData.diagram}
                    alt="Solution Diagram"
                  />
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col>
          <h2>Comments</h2>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="commentForm">
                  <Form.Label>Add a Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newComment}
                    onChange={handleCommentChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className={"mt-2"}>
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
          {comments &&
            comments.map((comment) => (
              <Card key={comment.id} className="mt-3">
                <Card.Body>
                  <Card.Text>{comment.text}</Card.Text>
                  <Button variant="success">Helpful</Button>
                </Card.Body>
              </Card>
            ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Solution;
