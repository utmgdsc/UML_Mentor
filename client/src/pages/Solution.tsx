import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button as BootstrapButton,
  Dropdown,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SolutionData } from "../types/SolutionData";
import { CommentData } from "../types/CommentData";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import useCheckRole from "../hooks/useCheckRole"; 
import dayjs from "dayjs";
import Avatar from "../components/Avatar"; 

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

const Solution: React.FC = () => {
  const { id } = useParams();
  const [solutionData, setSolutionData] = useState<SolutionData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const { isAdmin, isLoading } = useCheckRole();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImage, setShowImage] = useState(true); // New state for image visibility

  useEffect(() => {
    if (id) {
      loadSolution(id, setSolutionData, setForbidden);
      loadComments(id, setComments);
    }
  }, [id]);

  console.log(comments);

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

  useEffect(() => {
    if (solutionData) {
      console.log("Diagram path:", solutionData.diagram);
    }
  }, [solutionData]);

  const handleDeleteSolution = () => {
    if (!isAdmin && solutionData?.userId !== currentUserId) return;
    fetch(`/api/solutions/${id}`, { method: "DELETE" })
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Failed to delete solution", err);
      });
  };

  const toggleImage = () => {
    setShowImage(!showImage);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (forbidden) {
    return <div>Access denied</div>;
  }

  const handleDelete = (commentId: string) => {
    if (!isAdmin) return;
    fetch(`/api/comments/${commentId}`, { method: "DELETE" })
      .then(() => {
        setComments((comments) =>
          comments.filter((comment) => comment.id !== commentId)
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
      : `/api/comments/`;
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

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

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
            <Card>
              <Card.Header>
                <div className="d-flex align-items-center">
                  <Avatar username={solutionData.userId} size={40} />
                  <div className="ms-3">
                    <strong>{solutionData.userId}</strong>
                    <div className="text-muted">
                      Score: {solutionData.User?.score || 0}
                    </div>
                  </div>
                  <small className="ms-auto">
                    {dayjs(solutionData.createdAt).format("MMMM D, YYYY")}
                  </small>
                </div>
              </Card.Header>
              <Card.Body>
                <Card.Title>{solutionData.title}</Card.Title>
                <Card.Text>{solutionData.description}</Card.Text>

                {solutionData.diagram && (
                  <>
                    <BootstrapButton 
                      variant="outline-primary" 
                      onClick={toggleImage} 
                      className="mb-3"
                    >
                      {showImage ? "Hide Image" : "Show Image"}
                    </BootstrapButton>
                    {showImage && (
                      <Card.Img
                        variant="bottom"
                        src={`/api/solutions/diagrams/${solutionData.diagram}`}
                        alt="Solution Diagram"
                      />
                    )}
                  </>
                )}
              </Card.Body>
              {(isAdmin || solutionData.userId === currentUserId) && (
                <Card.Footer>
                  <BootstrapButton variant="danger" onClick={handleDeleteSolution}>
                    Delete Solution
                  </BootstrapButton>
                </Card.Footer>
              )}
            </Card>
          )}
        </Col>
      </Row>
      <Row className="mt-5 justify-content-center">
        <Col md={8}>
          <h2>Student's Answers</h2>
          {Array.isArray(comments) &&
            comments.map((comment) => (
              <div key={comment.id}>
                <Comment
                  comment={comment}
                  editable={false}
                  onSubmit={handleSubmitComment}
                  depth={0}
                />
                {isAdmin && (
                  <BootstrapButton
                    variant="danger"
                    onClick={() => handleDelete(comment.id)}
                  >
                    Delete
                  </BootstrapButton>
                )}
              </div>
            ))}
          <CommentForm
            onSubmit={(parentId, text) => {
              handleSubmitComment(parentId, text);
            }}
          />
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
