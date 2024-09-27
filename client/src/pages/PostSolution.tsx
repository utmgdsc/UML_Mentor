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
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
              />
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
