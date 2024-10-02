import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner, ListGroup } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import useCheckRole from "../hooks/useCheckRole";

interface SolutionSummary {
  id: string;
  username: string;
  title: string;
  submittedAt: string;
}

const Solutions: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [solutions, setSolutions] = useState<SolutionSummary[]>([]);
  const { isAdmin, isLoading: isRoleLoading } = useCheckRole();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      if (!questionId) {
        setError('Question ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/questions/${questionId}/solutions`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSolutions(data);
        setIsLoading(false);
      } catch (err) {
        setError(`Failed to fetch solutions: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    fetchSolutions();
  }, [questionId]);

  if (isLoading || isRoleLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2>Solutions for Question {questionId}</h2>
      {solutions.length === 0 ? (
        <Alert variant="info">No solutions submitted yet.</Alert>
      ) : (
        <ListGroup>
          {solutions.map((solution) => (
            <ListGroup.Item key={solution.id}>
              <Link to={`/solution/${solution.id}`}>
                <h5>{solution.title}</h5>
                <p>Submitted by: {solution.username}</p>
                <p>Submitted at: {new Date(solution.submittedAt).toLocaleString()}</p>
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default Solutions;
