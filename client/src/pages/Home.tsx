import { Col, Container, Row, Stack } from "react-bootstrap";
import Button from "../components/Button.tsx";
import SolutionCard, {
  SolutionCardProps,
} from "../components/SolutionCard.tsx";
import { ArrowUpRightSquare } from "react-bootstrap-icons";
import ChallengeCard from "../components/ChallengeCard.tsx";
import { ChallengeDifficulties } from "../types/challengeDifficulties.ts";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort.ts";

const DEMO_SOLUTION_CARDS: SolutionCardProps[] = Array(5).fill({
  title: "Example Challenge 1: Airport Management System",
  description:
    "Some quick example text to build on the card title and make up the bulk of the card's content.",
  imgSrc:
    "https://images.unsplash.com/photo-1596496181871-9681eacf9764?q=80&w=2086&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  href: "/home",
});

const DEMO_CHALLENGE_CARDS: ChallengeDetailsShort[] = Array(3).fill({
  title: "Demo Challenge Card",
  generalDescription:
    "In this demo challenge you will be demoing our platform. From creating UML diagrams to submitting" +
    " and getting review, we provide you all you need to become a Software Architecture monster!",
  id: 0,
  difficulty: ChallengeDifficulties.MEDIUM,
});

function Home() {
  // TODO: fetch the solutions
  return (
    <section>
      {/* Recent Solutions */}
      <Container className={"mt-5"}>
        <h2 className={"mb-3"}>Recent Solutions</h2>
        <Row sm={1} lg={3} className={"gx-4 gy-4"}>
          {DEMO_SOLUTION_CARDS.map((solutionCardProps) => (
            <Col key={solutionCardProps.href}>
              <SolutionCard {...solutionCardProps} />
            </Col>
          ))}
        </Row>
        {/* See more solutions button */}
        <Button variant={"outline-primary"} className={"mt-3"} href={"/home"}>
          See More <ArrowUpRightSquare style={{ marginLeft: "0.5rem" }} />
        </Button>
      </Container>

      {/* Suggested Challenges */}
      <Container className={"mt-5"}>
        <Stack
          direction={"horizontal"}
          className={"justify-content-between mb-3"}
        >
          <h2>Suggested Challenges</h2>
          {/* See more challenges button */}
          <Button variant={"outline-primary"} href={"/home"}>
            See More <ArrowUpRightSquare style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Stack>
        <Row sm={1} lg={3} className={"gx-4 gy-4"}>
          {DEMO_CHALLENGE_CARDS.map((challengeCardProps) => (
            <Col key={challengeCardProps.id}>
              <ChallengeCard {...challengeCardProps} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Home;
