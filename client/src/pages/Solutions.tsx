import { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import SolutionCard from "../components/SolutionCard.tsx";
import { SolutionData } from "../types/SolutionData.ts";
import MasonryGrid from "../components/MasonryGrid.tsx";

const Solutions = () => {
  const [solutions, setSolutions] = useState<SolutionData[]>([]);
  const [showingSolutions, setShowingSolutions] = useState<SolutionData[]>([]);
  const [challengeNames, setChallengeNames] = useState<string[]>([]);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [thisUser, setThisUser] = useState<{ username: string; role: string }>({
    username: "",
    role: "",
  });

  // fetch the username and all solved challenges (we need the challenge titles)
  useEffect(() => {
    fetch("/api/users/whoami")
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json() as Promise<{ username: string; role: string }>;
      })
      .then((data) => {
        setThisUser(data);
        console.log(
          "fetching: /api/users/" + data.username + "/solvedChallenges"
        );
        return fetch("/api/users/" + data.username + "/solvedChallenges");
      })
      .then((res: Response) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json() as Promise<string[]>;
      })
      .then((data) => {
        console.log("Solved challenges");
        setSolvedChallenges(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // fetch all available solutions
  useEffect(() => {
    fetch("/api/solutions")
      .then((resp) => resp.json())
      .then((data: SolutionData[]) => {
        setSolutions(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // fetch all challenges (we need the challenge titles)
  useEffect(() => {
    fetch("/api/challenges")
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json() as Promise<{ id: number; title: string }[]>;
      })
      .then((data) => {
        setChallengeNames(data.map((challenge) => challenge.title));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    setShowingSolutions(solutions);
  }, [solutions]);

  return (
    <Container>
      <header>
        <Row className="my-2">
          <Col>
            <h1 className="fs-2">Solutions</h1>
            <h2 className="fs-5">View the solutions from the community!</h2>
          </Col>
          <Col>
            <Form className="mt-1">
              <Form.Group controlId="filterByChallenge">
                <Form.Label>Solutions to a challenge</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => {
                    const challengeTitle = e.target.value;
                    if (challengeTitle === "All") {
                      setShowingSolutions(solutions);
                    } else {
                      setShowingSolutions(
                        solutions.filter(
                          (solution) =>
                            solution.challengeTitle === challengeTitle
                        )
                      );
                    }
                  }}
                >
                  <option>All</option>
                  {challengeNames.map((challengeName) => (
                    <option
                      disabled={
                        !(thisUser.role === "admin") &&
                        !solvedChallenges.includes(challengeName)
                      }
                      key={challengeName}
                    >
                      {challengeName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </header>
      {solutions.length !== 0 ? (
        <MasonryGrid sm={1} lg={3}>
          {showingSolutions.map((solution) => (
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
        </MasonryGrid>
      ) : (
        "No solutions found :("
      )}
    </Container>
  );
};

export default Solutions;
