import React, { useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap";
import Button from "../components/Button.tsx";

interface FormData {
  title: string;
  description: string;
  diagram: File | null;
}

// TODO: Add form validation
// TODO: Include data about the challenge like title

const PostSolution: React.FC = () => {
  const userId = 0; // TODO: change this when auth is added!
  const { id: challengeId } = useParams();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    diagram: null,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prevData) => ({
        ...prevData,
        diagram: file,
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    console.log(challengeId);

    fetch(`/api/solutions`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        challengeId: Number(challengeId),
        userId,
        ...formData,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(`Successfully posted solution`, data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Container>
      <Row className={"my-5 justify-content-center"}>
        <Col md={4} className={"bg-gray-200 rounded py-5 px-md-5"}>
          <h2>Submit Your Solution!</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="diagram">
              <Form.Label>Diagram</Form.Label>
              <Form.Control
                type="file"
                name="diagram"
                onChange={handleFileChange}
                accept="image/*"
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
