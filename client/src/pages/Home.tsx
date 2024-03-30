import { useState, useEffect } from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";
import Button from "../components/Button.tsx";
import SolutionCard from "../components/SolutionCard.tsx";
import ChallengeCard from "../components/ChallengeCard.tsx";
import { ArrowUpRightSquare } from "react-bootstrap-icons";
import NewUserPopup from '../components/NewUserPopup';
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
        const privacyAccepted = localStorage.getItem('privacyAccepted') === 'true';
        if (!privacyAccepted) {
            setShowPopup(true);
        }
    }, []);

    const handleAcceptPrivacy = () => {
        localStorage.setItem('privacyAccepted', 'true');
        setShowPopup(false);
    };

    return (
        <section>
            {/* Recent Solutions */}
            <Container className="mt-5">
                <h2 className="mb-3">Recent Solutions</h2>
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
                <Button variant="outline-primary" className="mt-3" href="/solutions">
                    See More <ArrowUpRightSquare style={{ marginLeft: "0.5rem" }} />
                </Button>
            </Container>

            {/* Suggested Challenges */}
            <Container className="my-5">
                <Stack direction="horizontal" className="justify-content-between mb-3">
                    <h2>Suggested Challenges</h2>
                    <Button variant="outline-primary" href="/challenges">
                        See More <ArrowUpRightSquare style={{ marginLeft: "0.5rem" }} />
                    </Button>
                </Stack>
                <Row sm={1} lg={3} className="gx-4 gy-4">
                    {challenges.map((challenge) => (
                        <Col key={challenge.id}>
                            <ChallengeCard
                                title={challenge.title}
                                difficulty={challenge.difficulty}
                                generalDescription={challenge.generalDescription}
                                id={challenge.id}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
            <NewUserPopup show={showPopup} onAccept={handleAcceptPrivacy} />
        </section>
    );
}

export default Home;
