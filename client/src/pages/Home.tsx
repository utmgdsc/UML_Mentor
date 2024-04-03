import { Col, Container, Row, Stack } from "react-bootstrap";
import { useState, useEffect } from "react";
import Button from "../components/Button.tsx";
import SolutionCard from "../components/SolutionCard.tsx";
import { ArrowUpRightSquare } from "react-bootstrap-icons";
import ChallengeCard from "../components/ChallengeCard.tsx";
import { SolutionData } from "../types/SolutionData.ts";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort.ts";


function Home() {
    const [solutions, setSolutions] = useState<SolutionData[]>([]);
    const [challenges, setChallenges] = useState<ChallengeDetailsShort[]>([]);

    //fetch the recent solutions
    useEffect(() => {
        fetch("/api/solutions/recent/3")
            .then((resp) => resp.json() as Promise<SolutionData[]>)
            .then((data: SolutionData[]) => {
                setSolutions(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    //fetch the suggested challenges
    useEffect(() => {
        fetch("/api/challenges/suggested")
            .then((resp) => resp.json() as Promise<ChallengeDetailsShort[]>)
            .then((data: ChallengeDetailsShort[]) => {
                setChallenges(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <section>
            {/* Recent Solutions */}
            <Container className={"mt-5"}>
                <h2 className={"mb-3"}>Recent Solutions</h2>
                <Row sm={1} lg={3} className={"gx-4 gy-4"}>
                    {solutions.map((solution: SolutionData) => {
                        return (
                            <Col key={solution.title}>
                                <SolutionCard
                                    imgSrc={solution.diagram}
                                    title={solution.title}
                                    id={solution.id.toString()}
                                    description={solution.description}
                                    author={solution.User.username}
                                    createdAt={solution.createdAt}
                                />
                            </Col>
                        );
                    })}
                </Row>
                {/* See more solutions button */}
                <Button variant={"outline-primary"} className={"mt-3"} href={"/solutions"}>
                    See More <ArrowUpRightSquare style={{ marginLeft: "0.5rem" }} />
                </Button>
            </Container>

            {/* Suggested Challenges */}
            <Container className={"my-5"}>
                <Stack
                    direction={"horizontal"}
                    className={"justify-content-between mb-3"}
                >
                    <h2>Suggested Challenges</h2>
                    {/* See more challenges button */}
                    <Button variant={"outline-primary"} href={"/challenges"}>
                        See More <ArrowUpRightSquare style={{ marginLeft: "0.5rem" }} />
                    </Button>
                </Stack>
                <Row sm={1} lg={3} className={"gx-4 gy-4"}>
                    {challenges.map((challenge: ChallengeDetailsShort) => {
                        return (
                            <Col key={challenge.id}>
                                <ChallengeCard
                                    title={challenge.title}
                                    difficulty={challenge.difficulty}
                                    generalDescription={challenge.generalDescription}
                                    id={challenge.id}
                                />
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </section>
    );
}

export default Home;
