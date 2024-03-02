import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SolutionCard from "../components/SolutionCard.tsx";
import { SolutionData } from "../types/SolutionData.ts";

const Solutions: React.FC = () => {
  const [solutions, setSolutions] = useState<SolutionData[]>([]);
  // TODO: use a storage service for diagrams
  const diagram =
    "https://images.unsplash.com/photo-1573166364266-356ef04ae798";
  useEffect(() => {
    // Fetching solutions data
    fetch("/api/solutions")
      .then((resp) => resp.json())
      .then((data) => {
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
                imgSrc={diagram}
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
