import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import useCheckRole from '../hooks/useCheckRole';

const PostSolution: React.FC = () => {
  const { id: challengeId } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
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

    if (imageUrl) {
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

  const { isAdmin, isLoading } = useCheckRole();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) {
      formData.append('diagram', file);
    }
    formData.append('challengeId', challengeId || '');


    fetch('/api/solutions', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Solution posted:', data);
        navigate(`/solution/${data.id}`);
        localStorage.removeItem('uml-diagram-image'); // Clear image from local storage after submission
      })
      .catch((error) => {
        console.error('Error posting solution:', error);
      });
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2>Post a Solution</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Diagram</Form.Label>

              <Form.Control
                type="file"
                name="diagram"
                accept="image/*"
                onChange={handleFileChange}

              <Form.Control 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 

              />
              <Form.Text className="text-muted">
                {postSolutionState.diagram ? postSolutionState.diagram.name : 'Automatically attached from local storage'}
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Post Solution
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PostSolution;
