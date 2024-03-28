import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";
import { CommentData } from "../types/CommentData.ts";

type CommentProps = {
  comment: CommentData;
};
const Comment = ({ comment }: CommentProps) => {
  console.log(comment);
  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Text>{comment.text}</Card.Text>
        <Button variant="success">Reply</Button>
      </Card.Body>
    </Card>
  );
};

export default Comment;
