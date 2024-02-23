import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import SolutionCard from '../components/SolutionCard';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>({});
  const [recentSolutions, setRecentSolutions] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user/1');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Simulate recent solutions data
    const sampleRecentSolutions = [
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
      // Add more sample recent solutions as needed
    ];

    setRecentSolutions(sampleRecentSolutions);
    fetchUserData();
  }, []);

  // Sample user data for testing
  userData.username = "Alex Apostolu";
  userData.preferedName = "Alex";
  userData.email = "apostolu240@gmail.com";
  userData.score = 200;

  return (
    <Container>
      <Row className="my-5">
        <Col>
          <h1>{userData.username}</h1>
          <h3>{userData.preferedName}</h3>
          <p><strong>Email:</strong> {userData.email}</p>
          <p>Score: {userData.score}</p>
          {/* Render other user data as needed */}
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Recent Solutions</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {recentSolutions.map(solution => (
              <Col key={solution.id}>
                <SolutionCard 
                  title={solution.title} 
                  description={solution.description} 
                  imgSrc={solution.imgSrc} 
                  href={`/solution/${solution.id}`} 
                  difficulty={solution.difficulty} 
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
