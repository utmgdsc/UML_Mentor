import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";
import { CommentData } from "../types/CommentData.ts";
import { Form } from "react-bootstrap";
import { useState } from "react";

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

const NonEditableComment = ({ comment, onSubmit }: NonEditableCommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);
  const repliesAvailable = comment.replies.length !== 0;

  return (
    <>
      <Card className="mt-3">
        <Card.Body>
          <Card.Text>{comment.text}</Card.Text>
          <div className="">
            <Button
              variant="primary"
              onClick={() => {
                setIsReplying((p) => !p);
              }}
            >
              Reply
            </Button>
            {repliesAvailable && (
              <Button
                variant={"secondary"}
                className={"ms-3"}
                onClick={() => {
                  setRepliesOpen((p) => !p);
                }}
              >
                {repliesOpen ? "Close Replies" : "See Replies"}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
      <div className={"mt-3 ms-3"}>
        {isReplying && (
          <Comment editable={true} onSubmit={onSubmit} parentId={comment.id} />
        )}
        {repliesAvailable &&
          repliesOpen &&
          comment.replies.map((c) => (
            <Comment
              key={c.id}
              comment={c}
              onSubmit={onSubmit}
              editable={false}
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
          onSubmit={() => {
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