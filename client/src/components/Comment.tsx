import React, { useState, useEffect } from "react";
import { Card, Button, Form, Dropdown, Modal } from "react-bootstrap";
import { useRemark } from "react-remark";
import { CaretUpFill, CaretUp } from "react-bootstrap-icons";
import dayjs from "dayjs";
import { CommentData } from "../types/CommentData";
import CommentForm from "./CommentForm";

type CommentProps = {
  comment: CommentData;
  onSubmit: (parentId: number, text: string) => void;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number, newText: string) => void;
  depth: number;
  currentUserId: string;
  isAdmin: boolean;
};

const Comment = ({
  comment,
  onSubmit,
  onDelete,
  onEdit,
  depth,
  currentUserId,
  isAdmin,
}: CommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [newText, setNewText] = useState(comment.text);
  const [renderedMarkdown, setMarkdownSource] = useRemark();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setMarkdownSource(comment.text);
  }, [comment.text]);

  const handleReply = (_: never, text: string) => {
    if (typeof text !== "string" || !text.trim()) return;
    onSubmit(comment.id, text);
    setIsReplying(false);
  };

  const handleEdit = () => {
    if (typeof newText !== "string" || !newText.trim()) return;
    onEdit(comment.id, newText);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(comment.id);
    setShowDeleteModal(false);
  };

  const handleUpvote = () => {
    fetch(`/api/comments/upvote/${comment.id}`, {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to upvote comment: ${response.statusText}`);
        }
        // Optionally update UI optimistically or refetch comments
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <Card className="mt-3">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{comment.userId}</strong> {/* Displaying username */}
              <small className="ms-2">
                {dayjs(comment.createdAt).format("MMM D, YYYY")}
              </small>{" "}
              {/* Formatting and displaying date */}
            </div>
            {(comment.userId === currentUserId || isAdmin) && (
              <Dropdown>
                <Dropdown.Toggle
                  as={Button}
                  variant="link"
                  className="text-dark p-0"
                >
                  <i className="bi bi-three-dots"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleShowDeleteModal}>
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          {isEditing ? (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit();
              }}
            >
              <Form.Group controlId="editCommentForm">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newText}
                  onChange={(e) => {
                    setNewText(e.target.value);
                  }}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-2 mb-2">
                Save
              </Button>
            </Form>
          ) : (
            <Card.Text>{renderedMarkdown}</Card.Text>
          )}
          <div className="d-flex align-items-center">
            <Button
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              variant={"outline-secondary"}
              onClick={handleUpvote}
              disabled={comment.hasUserUpvoted}
            >
              {comment.hasUserUpvoted ? <CaretUpFill /> : <CaretUp />}
              {comment.upVotes}
            </Button>
            {depth === 0 && (
              <Button
                variant="link"
                onClick={() => {
                  setIsReplying(!isReplying);
                }}
              >
                {isReplying ? "Cancel" : "Reply"}
              </Button>
            )}
            {depth === 0 && comment.replies.length > 0 && (
              <Button
                variant="link"
                onClick={() => {
                  setRepliesOpen(!repliesOpen);
                }}
              >
                {repliesOpen
                  ? "Hide Replies"
                  : `Show Replies (${comment.replies.length})`}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
      {isReplying && (
        <div className="mt-3 ms-3">
          <CommentForm parentId={comment.id} onSubmit={handleReply} />
        </div>
      )}
      {repliesOpen && (
        <div className="mt-3 ms-3">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onSubmit={onSubmit}
              onDelete={onDelete}
              onEdit={onEdit}
              depth={depth + 1}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Comment;
