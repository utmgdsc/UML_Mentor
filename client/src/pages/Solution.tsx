import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SolutionData } from "../types/SolutionData.ts";
import { CommentData } from "../types/CommentData.ts";
import Card from "react-bootstrap/Card";
import Button from "../components/Button.tsx";
import Comment from "../components/Comment.tsx";
import dayjs from 'dayjs'; 
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
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

const Solution = () => {
  const { id } = useParams(); // Id is the solution id
  const [solutionData, setSolutionData] = useState<SolutionData>();
  const [comments, setComments] = useState<CommentData[]>();

  const handleSubmit = (parentId: number, text: string) => {
    let promise = null;
    if (parentId) {
      promise = fetch(`/api/comments/reply/${parentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solutionId: solutionData?.id,
          text,
        }),
      });
    } else {
      promise = fetch(`/api/comments/${solutionData?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solutionId: solutionData?.id,
          text,
        }),
      });
    }

    promise
      .then(() => {
        loadComments(id, setComments);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (id) {
      loadSolution(id, setSolutionData);
      loadComments(id, setComments);
    }
  }, [id]);

  return (
    <Container className={"my-5"} fluid={"sm"}>
      <Row md={12} className={"justify-content-center"}>
        <Col md={6}>
          <h2>Solution</h2>
          {solutionData && (
            <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span><strong>{solutionData.userId}</strong></span>
              <span>{dayjs(solutionData.createdAt).format('MMMM D, YYYY')}</span>
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
            </Card>
          )}
        </Col>
      </Row>
      <Row className={"mt-5 justify-content-center"} md={12}>
        <Col md={6}>
          <h2>Comments</h2>
          <Comment editable={true} onSubmit={handleSubmit} />
          {comments &&
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                editable={false}
                onSubmit={handleSubmit}
              />
            ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Solution;
