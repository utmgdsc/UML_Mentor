import React, { useState, useEffect } from 'react';
import { Container, Row, Button, Col, Card } from 'react-bootstrap';
import SolutionCard from '../components/SolutionCard';
import { User } from '../../../server/models/User';
import "./Profile.css";

const Profile = () => {
const sampleUser = {
  username: 'Alexander Apostolu',
  preferredName: 'Alex',
  email: 'apostolu240@gmail.com',
  score: 100
};

const sampleSolutions = [
  {
    id: 1,
    title: "Solution 1",
    description: "Description of Solution 1",
    imgSrc: "https://example.com/image1.jpg",
    difficulty: "medium"
  },
  {
    id: 2,
    title: "Solution 2",
    description: "Description of Solution 2",
    imgSrc: "https://example.com/image2.jpg",
    difficulty: "hard"
  },
];

const sampleComments = [
  {
    name: "Factory Design Pattern",
    content: "This solution is amazing!",
    createdAt: "Wednesday",
  },
  {
    name: "Builder Design Pattern",
    content: "jobizdan",
    createdAt: "Thursday",
  }
];

const [user, setUser] = useState(sampleUser);
const [solutions, setSolutions] = useState(sampleSolutions);
const [comments, setComments] = useState(sampleComments);

useEffect(() => {
  fetch('/api/users/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    })
    .then(data => {
      setUser(data);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });

  fetch('/api/solutions/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch solution data');
      }
      return response.json();
    })
    .then(data => {
      setSolutions(data);
    })
    .catch(error => {
      console.error('Error fetching solution data:', error);
    });

  fetch('/api/comments/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch comment data');
      }
      return response.json();
    })
    .then(data => {
      setComments(data);
    })
    .catch(error => {
      console.error('Error fetching comment data:', error);
    });
  }, []);

  return (
    <Container>
      <Row className="p-4 mb-5" style={{ backgroundColor: 'rgb(175, 175, 175)' }}>
        <Col>
          <h1 className="">{user.username}</h1>
          <h3 className="">{user.preferredName}</h3>
          <p>{user.email}</p>
        </Col>
        <Col>
          <h3>Score: {user.score}</h3>
        </Col>
      </Row>
      <Row className="mb-5 border-0 rounded-3 overflow-hidden shadow-sm">
        <Col>
          <h2 className="mb-4">Solutions</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {solutions.map(solution => (
              <Col key={solution.id}>
                <Card className="transition-hover">
                  <Card.Img variant="top" src={solution.imgSrc} />
                  <Card.Body>
                    <Card.Title>{solution.title}</Card.Title>
                    <Card.Text>
                      {solution.description}
                    </Card.Text>
                    <Button variant="primary" href={`/solution/${solution.id}`}>View Solution</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row className="border-0 rounded-3 overflow-hidden shadow-sm">
        <Col>
          <h2 className="mb-4">Comments</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {comments.map(comment => (
              <Col key={comment.name}>
                <Card className="mb-3 transition-hover">
                  <Card.Body>
                    <Card.Title className="">{comment.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{comment.createdAt}</Card.Subtitle>
                    <Card.Text className="">{comment.content}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;

