import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap";
import Button from "../components/Button.tsx";
import { useNavigate } from "react-router-dom";
import { UserData } from "../types/UserData.ts";

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
  
  const [user, setUser] = useState<UserData>();
  useEffect(() => {
    fetch("/api/users/whoami")
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching current user ID: ", error);
      });
  }, []);

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
                value={postSolutionState.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={postSolutionState.description}
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
