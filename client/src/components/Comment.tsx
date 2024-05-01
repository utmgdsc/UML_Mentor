import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";
import { CommentData } from "../types/CommentData.ts";
import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { CaretUpFill, CaretUp } from "react-bootstrap-icons";
import { useRemark } from "react-remark";
import dayjs from "dayjs";

type CommentProps = NonEditableCommentProps | EditableCommentProps;

type NonEditableCommentProps = {
  comment: CommentData;
  onSubmit: (parentId: number, text: string) => void;
  editable: false;
  depth: number;
};

type EditableCommentProps = {
  parentId?: number;
  onSubmit: (parentId: number, text: string) => void;
  editable: true;
};

type UpvoterProps = {
  commentId: number;
  upVotes: number;
  hasUpvoted: boolean;
};

const Upvoter = ({ commentId, upVotes, hasUpvoted }: UpvoterProps) => {
  const [upVotesState, setUpVotesState] = useState(upVotes);
  const [hasUpvotedState, setHasUpvotedState] = useState(hasUpvoted);
  return (
    <Button
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      className={"me-3"}
      variant={"outline-secondary"}
      onClick={() => {
        console.log(`Upvoting ${commentId}`);
        fetch(`/api/comments/upvote/${commentId}`).catch(() => {});
        setUpVotesState((p) => p + 1);
        setHasUpvotedState(true);
      }}
      disabled={hasUpvotedState}
    >
      {hasUpvotedState ? <CaretUpFill /> : <CaretUp />}
      {upVotesState}
    </Button>
  );
};

const NonEditableComment = ({
  comment,
  onSubmit,
  depth,
}: NonEditableCommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);
  const repliesAvailable = comment.replies.length !== 0;
  const [renderedMarkdown, setMarkdownSource] = useRemark();

  useEffect(() => {
    setMarkdownSource(comment.text);
  }, [comment.text]);

  console.log(comment);

  return (
    <>
      <Card className="mt-3">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <strong>{comment.userId}</strong> {/* Displaying username */}
            <small>{dayjs(comment.createdAt).format("MMM D, YYYY")}</small>{" "}
            {/* Formatting and displaying date */}
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text>{renderedMarkdown}</Card.Text>
          <div>
            <Upvoter
              commentId={comment.id}
              upVotes={comment.upVotes}
              hasUpvoted={comment.hasUserUpvoted}
            />
            {depth === 0 && (
              <>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsReplying((prev) => !prev);
                  }}
                >
                  {isReplying ? "Stop Replying" : "Reply"}
                </Button>
                {repliesAvailable && (
                  <Button
                    variant="secondary"
                    className="ms-3"
                    onClick={() => {
                      setRepliesOpen((prev) => !prev);
                    }}
                  >
                    {repliesOpen ? "Close Replies" : "See Replies"}
                  </Button>
                )}
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      {depth === 0 && (
        <div className={"mt-3 ms-3"}>
          {isReplying && (
            <Comment
              editable={true}
              onSubmit={onSubmit}
              parentId={comment.id}
            />
          )}
          {repliesAvailable &&
            repliesOpen &&
            comment.replies.map((c) => (
              <Comment
                key={c.id}
                comment={c}
                onSubmit={onSubmit}
                editable={false}
                depth={depth + 1}
              />
            ))}
        </div>
      )}
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
