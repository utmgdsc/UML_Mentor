import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { Container, Row, Button, Col, Card, Form } from 'react-bootstrap';
import { UserData } from '../types/UserData';
import { SolutionData } from '../types/SolutionData';
import SolutionCard from "../components/SolutionCard.tsx";

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState<UserData>();
  const [solutions, setSolutions] = useState<SolutionData[]>([]);
  const [filteredUsername, setFilteredUsername] = useState<string>('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data :(');
        }
        return response.json() as Promise<UserData>;
      })
      .then(data => {
        setUser(data);
      })
      .catch(error => {
        console.error('Error fetching user data: ', error);
      });
    
    const fetchUrl = filteredUsername ? `/api/solutions?username=${filteredUsername}` : '/api/solutions';
    fetch(fetchUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch solution data');
        }
        return response.json() as Promise<SolutionData[]>;
      })
      .then(data => {
        setSolutions(data);
      })
      .catch(error => {
        setError('Error fetching solution data: ' + error.message);
      });

    fetch('/api/solutions') // Fetch all solutions initially
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch solution data');
        }
        return response.json() as Promise<SolutionData[]>;
      })
      .then(data => {
        setSolutions(data);
      })
      .catch(error => {
        setError('Error fetching solution data: ' + error.message);
      });

    // fetch('/api/solutions/1')
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch solution data');
    //     }
    //     return response.json() as SolutionData[];
    //   })
    //   .then(data => {
    //     setSolutions(data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching solution data:', error);
    //   });

    // fetch('/api/comments/1')
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch comment data :(');
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     setComments(data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching comment data:', error);
    //   });
  }, [username, filteredUsername]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredUsername(event.target.value);
  };

  const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Filter solutions by username
    const filteredSolutions = solutions.filter(solution => solution.userId === filteredUsername);
    setSolutions(filteredSolutions);
  };

  return (
    <Container>
      {error && <div>{error}</div>} {/* Display error message if there's an error */}
      {user && (
        <Row className="bg-secondary-subtle text-dark p-4 mb-5">
          <Col>
            <h1 className="">{user.username}</h1>
            <h2 className="fs-5">{user.email}</h2>
          </Col>
          <Col>
            {/* <h3>Score: {user.score}</h3> */}
          </Col>
        </Row>
      )}
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
            <Button variant="primary" type="submit">Filter</Button>
          </Form>
        </Col>
      </Row>
      <Row className="mb-5 border-0 rounded-3 overflow-hidden shadow-sm">
        <Col>
          <h2 className="mb-4">Recent Solutions</h2>
          {solutions.length !== 0 ? (
            <Row sm={1} lg={3}>
              {solutions.map((solution) => (
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

export default Profile;