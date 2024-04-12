import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SolutionData } from "../types/SolutionData.ts";
import { CommentData } from "../types/CommentData.ts";
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
      console.log("here");
    })
    .catch((err) => {
      console.error(err);
    });
}

const Solution = () => {
  const { id } = useParams();
  const [solutionData, setSolutionData] = useState<SolutionData>();
  const [comments, setComments] = useState<CommentData[]>();

  const handleDelete = (commentId) => {
    fetch(`/api/comments/${commentId}`, {
      method: 'DELETE'
    }).then(() => {
      setComments(currentComments => currentComments.filter(comment => comment.id !== commentId));
    }).catch(err => {
      console.error('Failed to delete comment', err);
    });
  };
    
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
          {comments &&
            comments.map((comment) => (
              <div key={comment.id}>
                <Comment
                  comment={comment}
                  editable={false}
                  onSubmit={handleSubmit}
                />
                <Button variant="danger" onClick={() => handleDelete(comment.id)}>Delete</Button>
              </div>
            ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Solution;
