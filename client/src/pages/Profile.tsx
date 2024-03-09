import React, { useState, useEffect } from 'react';
import { Container, Row, Button, Col, Card } from 'react-bootstrap';
import SolutionCard from '../components/SolutionCard';
import { User } from '../../../server/models/User';
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch('/api/users/1')
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
        console.error('Error fetching user data: ', error);
      });

    fetch('/api/solutions/1')
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

    fetch('/api/comments/1')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch comment data :(');
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
      {user && (
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
      )}
      <Row className="mb-5 border-0 rounded-3 overflow-hidden shadow-sm">
        <Col>
          <h2 className="mb-4">Solutions</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {solutions.map(solution => (
              <Col key={solution.challengeId}>
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
                    <Card.Title className="">{comment.solutionId}</Card.Title>
                    <Card.Text className="">{comment.text}</Card.Text>
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