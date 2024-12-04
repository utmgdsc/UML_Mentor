import React, { useState, useEffect } from "react";
import {
  Col,
  Container,
  Row,
  Stack,
  Button as BootstrapButton,
} from "react-bootstrap";
import Button from "../components/Button.tsx";
import SolutionCard from "../components/SolutionCard.tsx";
import ChallengeCard from "../components/ChallengeCard.tsx";
import { ArrowUpRightSquare } from "react-bootstrap-icons";
import NewUserPopup from "../components/NewUserPopup";
import { SolutionData } from "../types/SolutionData.ts";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort.ts";

function Home() {
  const [solutions, setSolutions] = useState<SolutionData[]>([]);
  const [challenges, setChallenges] = useState<ChallengeDetailsShort[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Fetch the recent solutions
    fetch("/api/solutions/recent/3")
      .then((resp) => resp.json())
      .then((data) => {
        setSolutions(data);
      })
      .catch((err) => {
        console.error(err);
      });

    // Fetch the suggested challenges
    fetch("/api/challenges/suggested")
      .then((resp) => resp.json())
      .then((data) => {
        setChallenges(data);
      })
      .catch((err) => {
        console.error(err);
      });

    // Check if the user has accepted the privacy policy
    const privacyAccepted = localStorage.getItem("privacyAccepted") === "true";
    if (!privacyAccepted) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("privacyAccepted", "true");
    setShowPopup(false);
  };

  return (
    <section>
      {/* Recent Solutions */}
      <Container className="mt-5 recent-solutions-container">
        <h2 className="section-title mb-3">Recent Solutions</h2>
        <Row sm={1} lg={3} className="gx-4 gy-4">
          {solutions.map((solution) => (
            <Col key={solution.id}>
              <SolutionCard
                imgSrc={solution.diagram}
                title={solution.title}
                id={solution.id.toString()}
                description={solution.description}
                author={solution.User.username}
                createdAt={solution.createdAt}
              />
            </Col>
          ))}
        </Row>
        <BootstrapButton
          variant="outline-primary"
          className="mt-3 see-more-btn"
          href="/solutions"
        >
          See More <ArrowUpRightSquare style={{ marginLeft: "0.5rem" }} />
        </BootstrapButton>
      </Container>
      <hr className="section-divider" /> {/* Divider between sections */}
      {/* Suggested Challenges */}
      <Container className="my-5 suggested-challenges-container">
        <Stack direction="horizontal" className="justify-content-between mb-3">
          <h2 className="section-title">Suggested Challenges</h2>
          <BootstrapButton
            variant="outline-primary"
            className="see-more-btn"
            href="/challenges"
          >
            See More <ArrowUpRightSquare style={{ marginLeft: "0.5rem" }} />
          </BootstrapButton>
        </Stack>
        <Row sm={1} lg={3} className="gx-4 gy-4">
          {challenges.map((challenge) => (
            <Col key={challenge.id}>
              <ChallengeCard
                title={challenge.title}
                difficulty={challenge.difficulty}
                generalDescription={challenge.generalDescription}
                id={challenge.id}
                keyPatterns={challenge.keyPatterns}
                solutionCount={challenge.solutionCount}
              />
            </Col>
          ))}
        </Row>
      </Container>
      <NewUserPopup show={showPopup} handleClose={handleClose} />
    </section>
  );
}

export default Home;
