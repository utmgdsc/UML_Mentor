import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Container, Row, Button, Col, Card, Form } from 'react-bootstrap';
import { UserData } from '../types/UserData';
import { SolutionData } from '../types/SolutionData';
import SolutionCard from "../components/SolutionCard.tsx";

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState<UserData>();
  const [filteredSolutions, setFilteredSolutions] = useState<SolutionData[]>([]);
  const [filteredUsername, setFilteredUsername] = useState<string>('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

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
    
    // Admin - Filter solutions by username 
    fetch(`/api/solutions?username=${filteredUsername}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch solution data');
        }
        return response.json() as Promise<SolutionData[]>;
      })
      .then(data => {
        setFilteredSolutions(data);
      })
      .catch(error => {
        setError('Error fetching solution data: ' + error.message);
      });
  }, [username, filteredUsername]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredUsername(event.target.value);
  };

  const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    navigate('/admin');
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
      {user && user.role === "user" && <Button onClick={() => navigate("/admin")}>Admin Dashboard</Button>}
    </Container>
  );
};

export default Profile;