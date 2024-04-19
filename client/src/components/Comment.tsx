import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";
import { CommentData } from "../types/CommentData.ts";
import { Form } from "react-bootstrap";
import { useState } from "react";

type CommonProps = {
  isAdmin: boolean;
  handleDelete: (commentId: number) => void;
};

type CommentProps = NonEditableCommentProps | EditableCommentProps;


type NonEditableCommentProps = {
  comment: CommentData;
  onSubmit: (parentId: number, text: string) => void;
  editable: false;
};

type EditableCommentProps = {
  parentId?: number;
  onSubmit: (parentId: number, text: string) => void;
  editable: true;
};

const NonEditableComment = ({ comment, onSubmit, isAdmin, handleDelete }: NonEditableCommentProps & CommonProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);
  const repliesAvailable = comment.replies.length > 0;

  return (
    <>
      <Card className="mt-3">
        <Card.Body>
          <Card.Text>{comment.text}</Card.Text>
          <div className="d-flex justify-content-start">
            {isAdmin && (
              <Button
                variant="danger"
                onClick={() => handleDelete(comment.id)}
                className="me-2"
              >
                Delete
              </Button>
            )}
            <Button variant="primary" onClick={() => setIsReplying(prev => !prev)}>Reply</Button>
            {repliesAvailable && (
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => setRepliesOpen(prev => !prev)}
              >
                {repliesOpen ? "Close Replies" : "See Replies"}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
      <div className="ms-3 mt-3">
        {isReplying && (
          <Comment editable={true} onSubmit={onSubmit} parentId={comment.id} isAdmin={isAdmin} handleDelete={handleDelete} />
        )}
        {repliesAvailable && repliesOpen && comment.replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            onSubmit={onSubmit}
            editable={false}
            isAdmin={isAdmin}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </>
  );
};


const EditableComment = ({ onSubmit, parentId }: EditableCommentProps) => {
  const [newComment, setNewComment] = useState<string>("");
  return (
    <Card>
      <Card.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setNewComment("");
            onSubmit(parentId, newComment);
          }}
        >
          <Form.Group controlId="commentForm">
            <Form.Control
              as="textarea"
              rows={3}
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
              }}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className={"mt-2"}>
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

const Comment = ({ editable, ...otherProps }: CommentProps) => {
  return editable ? (
    <EditableComment {...otherProps} />
  ) : (
    <NonEditableComment {...otherProps} />
  );
};

export default Comment;
