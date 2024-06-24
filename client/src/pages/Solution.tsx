import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Modal, Button as BootstrapButton, Dropdown } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SolutionData } from "../types/SolutionData";
import { CommentData } from "../types/CommentData";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import useCheckRole from "../hooks/useCheckRole"; // Make sure the path is correct
import dayjs from "dayjs";

function loadSolution(id, setter, setForbidden) {
  fetch(`/api/solutions/${id}`)
    .then((resp) => {
      if (!resp.ok) {
        if (resp.status === 403) {
          setForbidden(true);
          throw new Error("Access denied");
        } else {
          throw new Error(`Failed to fetch solution: ${resp.status}`);
        }
      }
      return resp.json();
    })
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
  const [forbidden, setForbidden] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadSolution(id, setSolutionData, setForbidden);
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

  const handleDeleteComment = (commentId) => {
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

  const handleEditComment = (commentId, newText) => {
    fetch(`/api/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    })
      .then(() => {
        loadComments(id, setComments);
      })
      .catch((err) => {
        console.error("Failed to edit comment", err);
      });
  };

  const handleSubmitComment = (parentId, text) => {
    const endpoint = parentId
      ? `/api/comments/reply/${parentId}`
      : `/api/comments`;
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

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (forbidden) {
    return <div>Access denied</div>;
  }

  return (
    <Container className="my-5" fluid="sm">
      <Row className="justify-content-center">
        <Col md={8}>
          {solutionData && (
            <>
              <h1>
                {solutionData.challengeTitle} - Solution #{solutionData.id}
              </h1>
              <Card className="mb-4">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{solutionData.userId}</strong>
                      <small className="ms-2 text-muted">
                        {dayjs(solutionData.createdAt).format("MMMM D, YYYY")}
                      </small>
                    </div>
                    {(isAdmin || solutionData.userId === currentUserId) && (
                      <Dropdown>
                        <Dropdown.Toggle as={BootstrapButton} variant="link" className="text-dark p-0">
                          <i className="bi bi-three-dots"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={handleShowDeleteModal}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
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
              </Card>
            </>
          )}
        </Col>
      </Row>
      <Row className="mt-5 justify-content-center">
        <Col md={8}>
          <h2>Student's Answers</h2>
          {Array.isArray(comments) && comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onSubmit={(parentId, text) => handleSubmitComment(parentId, text)}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
              depth={0}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
          <CommentForm onSubmit={(parentId, text) => handleSubmitComment(parentId, text)} />
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this solution?</Modal.Body>
        <Modal.Footer>
          <BootstrapButton variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </BootstrapButton>
          <BootstrapButton variant="danger" onClick={handleDeleteSolution}>
            Delete
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Solution;
