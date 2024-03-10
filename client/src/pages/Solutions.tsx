import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SolutionCard from "../components/SolutionCard.tsx";
import { SolutionData } from "../types/SolutionData.ts";

const Solutions = () => {
  const [solutions, setSolutions] = useState<SolutionData[]>([]);
  useEffect(() => {
    // Fetching solutions data
    fetch("/api/solutions")
      .then((resp) => resp.json())
      .then((data: SolutionData[]) => {
        setSolutions(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <Container>
      <h1 className="mt-5 mb-4">Solutions</h1>
      {solutions.length !== 0 ? (
        <Row sm={1} lg={3}>
          {solutions.map((solution) => (
            <Col key={solution.id} className="mb-4">
              <SolutionCard
                title={solution.title}
                description={solution.description}
                imgSrc={`/api/solutions/diagrams/${solution.diagram}`}
                href={`/solution/${solution.id}`}
              />
            </Col>
          ))}
        </Row>
      ) : (
        "No solutions found :("
      )}
    </Container>
  );
};

export default Solutions;
