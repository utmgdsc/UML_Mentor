import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Container, Row, Button, Col, Card, Form } from 'react-bootstrap';
import { UserData } from '../types/UserData';
import { SolutionData } from '../types/SolutionData';
import SolutionCard from "../components/SolutionCard.tsx";

const Admin = () => {
  const { username } = useParams();
  const [user, setUser] = useState<UserData>();
  const [filteredSolutions, setFilteredSolutions] = useState<SolutionData[]>([]);
  const [filteredUsername, setFilteredUsername] = useState<string>('');
  const [filteredTimestamp, setFilteredTimestamp] = useState<[string, string]>(['', '']);


  const [comments, setComments] = useState([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Filter soltuions by username and timestamp
    fetch(`/api/solutions?username=${filteredUsername}`)
      .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch solution data');
          }
          return response.json() as Promise<SolutionData[]>;
      })
      .then(data => {
        const filteredSolutionsByDate = data.filter(solution => {
          // Assuming solution.date is a string in format "YYYY-MM-DD"
          const date1 = solution.createdAt.split('T')[0];
          return (filteredUsername === "" || solution.userId === filteredUsername) &&
                 (filteredTimestamp[0] === "" || date1 >= filteredTimestamp[0]) &&
                 (filteredTimestamp[1] === "" || date1 <= filteredTimestamp[1]);
        });
        setFilteredSolutions(filteredSolutionsByDate);
      })
      .catch(error => {
        setError('Error fetching solution data: ' + error.message);
      });
  }, [username, filteredUsername, filteredTimestamp]);

  const navigate = useNavigate();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredUsername(event.target.value);
  };

  const handleTimestampChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newTimestamp = [...filteredTimestamp];
    newTimestamp[index] = event.target.value;
    setFilteredTimestamp(newTimestamp);
  };

  const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Container>
      <h1>Admin Page</h1>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
      <Row className="mb-3">
        <Col>
          <Form onSubmit={handleFilterSubmit}>
            <Form.Group controlId="usernameFilter">
              <Form.Label>Filter by Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={filteredUsername}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="timestampFilterStart">
              <Form.Label>Filter by Start Timestamp</Form.Label>
              <Form.Control
                type="date"
                value={filteredTimestamp[0]}
                onChange={(event) => handleTimestampChange(event, 0)}
              />
            </Form.Group>
            <Form.Group controlId="timestampFilterEnd">
              <Form.Label>Filter by End Timestamp</Form.Label>
              <Form.Control
                type="date"
                value={filteredTimestamp[1]}
                onChange={(event) => handleTimestampChange(event, 1)}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className="mb-5 border-0 rounded-3 overflow-hidden shadow-sm">
        <Col>
          <h2 className="mb-4">Recent Solutions</h2>
          {filteredSolutions.length !== 0 ? (
            <Row sm={1} lg={3}>
              {filteredSolutions.map((solution) => (
                <Col key={solution.id} className="mb-4">
                  <SolutionCard
                    title={solution.title}
                    description={solution.description}
                    imgSrc={solution.diagram}
                    id={solution.id.toString()}
                    author={solution.User.username}
                    createdAt={solution.createdAt}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            "No solutions found :("
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
