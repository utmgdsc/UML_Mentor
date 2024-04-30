import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SolutionData } from "../types/SolutionData.ts";
import { CommentData } from "../types/CommentData.ts";
import Button from "../components/Button.tsx";
import Comment from "../components/Comment.tsx";
import useCheckRole from '../hooks/useCheckRole';  // Make sure the path is correct
import dayjs from 'dayjs';

function loadSolution(id, setter) {
  fetch(`/api/solutions/${id}`)
    .then(resp => resp.json())
    .then(data => setter(data))
    .catch(err => console.error(err));
}

function loadComments(id, setter) {
  fetch(`/api/comments/${id}`)
    .then(resp => resp.json())
    .then(data => setter(data))
    .catch(err => console.error(err));
}

const Solution = () => {
  const { id } = useParams();
  const [solutionData, setSolutionData] = useState(null);
  const [comments, setComments] = useState([]);
  const { isAdmin, isLoading } = useCheckRole();

  useEffect(() => {
    if (id) {
      loadSolution(id, setSolutionData);
      loadComments(id, setComments);
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = (commentId) => {
    if (!isAdmin) return;
    fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
      .then(() => setComments(comments => comments.filter(comment => comment.id !== commentId)))
      .catch(err => console.error('Failed to delete comment', err));
  };

  const handleSubmit = (parentId, text) => {
    const endpoint = parentId ? `/api/comments/reply/${parentId}` : `/api/comments/${solutionData.id}`;
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solutionId: solutionData.id, text })
    })
    .then(() => loadComments(id, setComments))
    .catch(err => console.error(err));
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
                  <small>{dayjs(solutionData.createdAt).format('MMMM D, YYYY')}</small>
                </div>
              </Card.Header>
              <Card.Body>
                <Card.Title>{solutionData.title}</Card.Title>
                <Card.Text>{solutionData.description}</Card.Text>
 
                {solutionData.diagram && (
                  <Card.Img variant="bottom" src={`/api/solutions/diagrams/${solutionData.diagram}`} alt="Solution Diagram" />
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <Row className="mt-5 justify-content-center">
        <Col md={6}>
          <h2>Comments</h2>
          <Comment editable={true} onSubmit={handleSubmit} />ç
          {comments.map(comment => (
            <div key={comment.id}>
              <Comment comment={comment} editable={false} onSubmit={handleSubmit} />
              {isAdmin && <Button variant="danger" onClick={() => handleDelete(comment.id)}>Delete</Button>}
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Solution;
