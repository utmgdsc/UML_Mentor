import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import SolutionCard from '../components/SolutionCard';
import "./Profile.css"

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>({});
  const [recentSolutions, setRecentSolutions] = useState<any[]>([]);
	const [recentComments, setRecentComments] = useState<any[]>([]);

	// Hardcode recentSolutions and recentComments for now.
  useEffect(() => {
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
    ];

		const sampleRecentComments = [
			{
				id: 1,
				content: "This solution is amazing!",
				createdAt: "wednesday",
			}
		];

    setRecentSolutions(sampleRecentSolutions);
		setRecentComments(sampleRecentComments);
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
          <h1 className="username">{userData.username}</h1>
          <h3 className="preferedName">{userData.preferedName}</h3>
          <p>{userData.email}</p>
          <p>Score: {userData.score}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Recent Solutions</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {recentSolutions.map(solution => (
              <Col key={solution.id}>
                <div className="solution-card">
                  <SolutionCard 
                    title={solution.title} 
                    description={solution.description} 
                    imgSrc={solution.imgSrc} 
                    href={`/solution/${solution.id}`}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Recent Comments</h2>
          {recentComments.map(comment => (
            <div key={comment.id} className="comment-box">
							<p className="comment-title">Solution Title: {comment.id}</p>
              <p className="comment-date">{comment.createdAt}</p>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
