import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

type CommentFormProps = {
  parentId?: number;
  onSubmit: (parentId: number | undefined, text: string) => void;
};

const CommentForm = ({ parentId, onSubmit }: CommentFormProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof text !== "string" || !text.trim()) return;
    onSubmit(parentId, text);
    setText("");
  };

  return (
    <Card className="mt-3">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="commentForm">
            <Form.Control
              as="textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-2">
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CommentForm;
