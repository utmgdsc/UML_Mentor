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
  const [postSolutionState, setPostSolutionState] = useState<PostSolutionState>({
    title: "",
    description: "",
    diagram: null,
  });

  useEffect(() => {
    // Retrieve the image from local storage
    const imageUrl = localStorage.getItem('uml-diagram-image');

    if (imageUrl && imageUrl.startsWith('data:image/png;base64,')) {
      // Convert the base64 string to a Blob
      const byteString = atob(imageUrl.split(',')[1]);
      const mimeString = imageUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "uml-diagram.png", { type: mimeString });
      
      setPostSolutionState((prevData) => ({
        ...prevData,
        diagram: file, // Set the diagram state to the generated image file
      }));
    }
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
        diagram: file, // Update the diagram with the selected file
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        localStorage.removeItem('uml-diagram-image'); // Clear image from local storage after submission
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
                accept="image/*"
                onChange={handleFileChange}
              />
              <Form.Text className="text-muted">
                {postSolutionState.diagram ? postSolutionState.diagram.name : ''}
              </Form.Text>
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
