import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Container, Row, Button, Col, Card, Form } from 'react-bootstrap';
import { UserData } from '../types/UserData';
import { SolutionData } from '../types/SolutionData';
import { CommentData } from '../types/CommentData';
import { ChallengeDetailsShort } from '../types/ChallengeDetailsShort';
import SolutionCard from '../components/SolutionCard';
import ChallengeCard from '../components/ChallengeCard';
import MasonryGrid from '../components/MasonryGrid';

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState<UserData>();
  const [filteredSolutions, setFilteredSolutions] = useState<SolutionData[]>([]);
  const [filteredUsername, setFilteredUsername] = useState<string>('');
  //const [comments, setComments] = useState([]);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();
  const [myProfile, setMyProfile] = useState<boolean>(false);
  const [solutions, setSolutions] = useState<SolutionData[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [challenges, setChallenges] = useState<ChallengeDetailsShort[]>([]);

  // Fetch user data
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
  }, [username]);

  // Check if the profile is the user's own profile
  useEffect(() => {
    fetch('/api/users/whoami').then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user data:(');
      }
      return response.json() as Promise<{username: string}>;
    }
    ).then(data => {
      if (data.username === username) {
        setMyProfile(true);
      }
    }).catch(error => {
      console.error('Error fetching user data: ', error);
    });
  }, [username]);

  // Fetch user solutions
  useEffect(() => {
    fetch(`/api/solutions/user/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch solutions:(');
        }
        return response.json() as Promise<SolutionData[]>;
      })
      .then(data => {
        setSolutions(data);
      })
      .catch(error => {
        console.error('Error fetching solutions: ', error);
      });
  }, [username]);

  // Fetch user comments
  useEffect(() => {
    fetch(`/api/comments/user/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch comments:(');
        }
        return response.json() as Promise<CommentData[]>;
      })
      .then(data => {
        setComments(data);
      })
      .catch(error => {
        console.error('Error fetching comments: ', error);
      });
  }, [username]);

  // Fetch user challenges for which a diagram exists
  useEffect(() => {
    fetch(`/api/challenges/inprogress/user/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch challenges:(');
        }
        return response.json() as Promise<ChallengeDetailsShort[]>;
      })
      .then(data => {
        setChallenges(data);
      })
      .catch(error => {
        console.error('Error fetching challenges: ', error);
      });
  }, [username]);

  return (
    <Container>
      {error && <div>{error}</div>} {/* Display error message if there's an error */}
      {user && (
        <Row className="bg-secondary-subtle text-dark p-4">
          <Col>
            <h1 className="">{user.username}</h1>
            <h2 className="fs-5">{user.email}</h2>
          </Col>
        </Row>
      )}
      {user && user.role === "user" && <Button onClick={() => navigate("/admin")}>Admin Dashboard</Button>}
      {
        myProfile && 
        <>
          <h2 className="mt-4 mb-2">My Challenges in Progress</h2>
          <Row>
            <MasonryGrid sm={1} lg={3}>
              {challenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    title={challenge.title}
                    difficulty={challenge.difficulty}
                    generalDescription={challenge.generalDescription}
                    id={challenge.id}
                    completed={challenge.completed}
                  />
              ))}
            </MasonryGrid>
          </Row>
        </>
      }
      <h2 className="mt-4 mb-2">Solutions</h2>
      <MasonryGrid sm={1} lg={3}>
        {solutions.map(solution => (
            <SolutionCard
              key={solution.id}
              title={solution.title}
              description={solution.description}
              imgSrc={solution.diagram}
              id={solution.id.toString()}
              author={solution.User.username}
              createdAt={solution.createdAt}
            />
        ))}
      </MasonryGrid>
      <h2 className="mt-4 mb-2">Comments</h2>          
      <MasonryGrid sm={1} lg={3} className="mb-4">
        {comments.map(comment => (
          // NOTE: This is a temporary solution to display comments
          // I will wait for Eren to refactor the Comment component before I properly implement this
            <Card key={comment.id}> 
              <Card.Body>
                <Card.Text>{comment.text}</Card.Text>
              </Card.Body>
            </Card>
        ))}
      </MasonryGrid>
    </Container>
  );
};

export default Profile;