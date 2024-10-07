/* eslint-disable @typescript-eslint/no-unused-vars */

import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ChallengeDetails } from "../types/challengeDetails";
import { StarFill } from "react-bootstrap-icons";
import InstructionsPopup from '../components/InstructionsPopup';

const Challenge = () => {
  const [details, setDetails] = useState<ChallengeDetails>();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [showInstructions, setShowInstructions] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch user role
  useEffect(() => {
    fetch("/api/users/whoami")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<{ role: string }>;
      })
      .then((data) => {
        setUserRole(data.role);
      })
      .catch((err: Error) => {
        console.error("Failed fetching the user role. Error message: " + err.message);
      });
  }, []);

  // Show instructions popup only once
  useEffect(() => {
    const instructionsShown = localStorage.getItem('instructionsShown');
    if (!instructionsShown) {
      setShowInstructions(true);
      localStorage.setItem('instructionsShown', 'true');
    }
  }, []);

  // Fetch challenge details
  useEffect(() => {
    fetch("/api/challenges/" + id)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<ChallengeDetails>;
      })
      .then((data) => {
        setDetails(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        console.error("Failed fetching the challenge number: " + id + "\nError message: " + err.message);
      });
  }, [id]);

  // Generate stars based on difficulty
  const difficultyStars = useMemo(
    () =>
      details && details.difficulty >= 0 ? (
        Array.from({ length: details.difficulty + 1 }, (_, i) => (
          <StarFill key={i} className="text-warning" />
        ))
      ) : null,
    [details],
  );

  if (isLoading) return <p>Loading...</p>;
  if (details === undefined) return <p>Failed to load challenge details</p>;
  if (details.hidden && userRole !== "admin") return <p>The challenge is hidden</p>;

  return (
    <Container fluid>
      <section className="p-3">
        <Row className="mb-4">
          <Col>
            <header className="text-center bg-light text-dark p-4 rounded">
              <h1 className="fw-bold">{details.title}</h1>
              <h2 className="text-dark fw-semibold fs-4">{details.outcome}</h2>
              <div className="mt-2">{difficultyStars}</div>
              {details.completed && (
                <span className="mt-2 badge bg-success text-white">Completed</span>
              )}
            </header>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={6}>
            <h3 className="fs-5">Description:</h3>
            <p>{details.generalDescription}</p>
          </Col>
          <Col md={6}>
            <h3 className="fs-5">Expected Functionality:</h3>
            <ul>
              {Object.entries(details.expectedFunctionality).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3 className="fs-5">Usage Scenarios:</h3>
            <ul>
              {Object.entries(details.usageScenarios).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </Col>
        </Row>
        {details.completed && (
          <Row>
            <h3 className="fs-5 text-success">Key Design Patterns:</h3>
            <ul>
              {details.keyPatterns.map((pattern, index) => (
                <li key={index}>{pattern + (pattern.slice(-1) !== "." ? "." : "")}</li>
              ))}
            </ul>
          </Row>
        )}
      </section>
      <InstructionsPopup show={showInstructions} handleClose={() => setShowInstructions(false)} />
    </Container>
  );
};

export default Challenge;
