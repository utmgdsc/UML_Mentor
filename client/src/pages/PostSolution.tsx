import { useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap";
import Button from "../components/Button.tsx";
import { useNavigate } from "react-router-dom";

type FormData = {
  title: string;
  description: string;
  diagram: File | null;
};

// TODO: Add form validation
// TODO: Include data about the challenge like title

const PostSolution = () => {
  const navigate = useNavigate();
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
    // TODO: Form validation
    const data = new FormData();
    data.append("userId", `${userId}`);
    data.append("challengeId", `${challengeId}`);

    data.append("title", formData.title);

    data.append("description", formData.description);
    data.append("diagram", formData.diagram);

    fetch(`/api/solutions`, {
      method: "POST",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        navigate(`/solution/${data.id}`);
        console.log("did not redirect");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Container>
      <Row className={"my-5 justify-content-center"}>
        <Col md={6} className={"bg-gray-200 rounded py-5 px-md-5"}>
          <h1>Submit Your Solution!</h1>
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
