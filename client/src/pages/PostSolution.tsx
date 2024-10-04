import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap";
import Button from "../components/Button.tsx";
import { useNavigate } from "react-router-dom";
import { UserData } from "../types/UserData.ts";
import ReactMarkdown from 'react-markdown';

type PostSolutionState = {
  title: string;
  description: string;
  diagram: File | null;
};

const PostSolution = () => {
  const navigate = useNavigate();
  const { id: challengeId } = useParams();
  const [postSolutionState, setPostSolutionState] = useState<PostSolutionState>(
    {
      title: "",
      description: "",
      diagram: null,
    },
  );
  const [showPreview, setShowPreview] = useState(false);
  const [description, setDescription] = useState('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPostSolutionState((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPostSolutionState((prevData) => ({
        ...prevData,
        diagram: file,
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Form validation
    const data = new FormData();
    data.append("challengeId", `${challengeId}`);

    data.append("title", postSolutionState.title);

    data.append("description", postSolutionState.description);
    data.append("diagram", postSolutionState.diagram);

    fetch(`/api/solutions`, {
      method: "POST",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        navigate(`/solution/${data.id}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <Container>
      <Row className={"my-5 justify-content-center"}>
        <Col md={6} className={"bg-gray-200 rounded py-5 px-md-5"}>
          <h1>Submit Your Solution!</h1>
          <p>
            The solution retrospective helps you think about your project and share it with the community. Answer the questions below to talk about your project, what you learned, and where you need support. Clear details help others understand and give useful feedback.
          </p>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Solution Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={postSolutionState.title}
                onChange={handleChange}
                required
                placeholder="Enter a concise, descriptive title for your design pattern implementation (e.g., 'Observer Pattern for Event Handling System')"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Solution Description</Form.Label>
              <p>Provide a brief overview of your design pattern implementation. Include:</p>
              <ul>
                <li>The specific design pattern you used</li>
                <li>The problem it solves</li>
                <li>Key components of your implementation</li>
                <li>How it adheres to design pattern principles</li>
              </ul>
              <div>
                <Button variant="secondary" onClick={togglePreview}>
                  {showPreview ? 'Edit' : 'Preview'}
                </Button>
              </div>
              {showPreview ? (
                <div className="preview">
                  <ReactMarkdown>{postSolutionState.description}</ReactMarkdown>
                </div>
              ) : (
                <Form.Control
                  as="textarea"
                  name="description"
                  value={postSolutionState.description}
                  onChange={handleChange}
                  rows={6}
                  required
                  placeholder="Provide a brief overview of your design pattern implementation. Include:
- The specific design pattern you used
- The problem it solves
- Key components of your implementation
- How it adheres to design pattern principles"
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="diagram">
              <Form.Label>Solution Diagram</Form.Label>
              <Form.Control
                type="file"
                name="diagram"
                onChange={handleFileChange}
                accept="image/*"
              />
              <Form.Text className="text-muted">
                Upload a diagram illustrating the structure and relationships of your design pattern implementation. Use UML or a similar notation to clearly show classes, interfaces, and their interactions.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="proud">
              <Form.Label>What are you most proud of, and what would you do differently next time?</Form.Label>
              <Form.Control
                as="textarea"
                name="proud"
                onChange={handleChange}
                rows={4}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="challenges">
              <Form.Label>What challenges did you encounter, and how did you overcome them?</Form.Label>
              <Form.Control
                as="textarea"
                name="challenges"
                onChange={handleChange}
                rows={4}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PostSolution;
