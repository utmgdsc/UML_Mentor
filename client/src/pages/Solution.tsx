import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SolutionData } from "../types/SolutionData.ts";
import { CommentData } from "../types/CommentData.ts";
import Card from "react-bootstrap/Card";
import Button from "../components/Button.tsx";
import Comment from "../components/Comment.tsx";

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

    fetch(`/api/comments/${solutionData?.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        solutionId: solutionData?.id,
        text: newComment,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        loadComments(id, setComments);
      })
      .catch((err) => {
        console.error(err);
      });

    setNewComment("");
  };

  useEffect(() => {
    if (id) {
      loadSolution(id, setSolutionData);
      loadComments(id, setComments);
    }
  }, [id]);

  // useEffect(() => {
  //   console.log("solution data", solutionData);
  //   console.log("comments", comments);
  // }, [solutionData, comments]);

  return (
    <Container className={"my-5"} fluid={"sm"}>
      <Row>
        <Col className="">
          <h2>Solution</h2>
          {solutionData && (
            <Card>
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
            </Card>
          )}
        </Col>
      </Row>
      <Row className={"mt-5"}>
        <Col>
          <h2>Comments</h2>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="commentForm">
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
              <Comment key={comment.id} comment={comment} />
            ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Solution;
