import React, { useState, useEffect } from 'react';
import { Container, Accordion, Card } from 'react-bootstrap';

// Define the structure of each instruction
interface Instruction {
  title: string;
  body: string;
}

const InstructionsPage: React.FC = () => {
  const [instructions, setInstructions] = useState<Instruction[]>([]);

  useEffect(() => {
    // Fetch the instructions from the backend to display
    fetch('/api/instructions')
      .then(response => response.json())
      .then((data: Instruction[]) => setInstructions(data))
      .catch(error => console.error('Error fetching instructions:', error));
  }, []);

  return (
    <Container className="mt-5">
      <h1>Instructions</h1>
      <Accordion defaultActiveKey="0">
        {instructions.map((instruction, index) => (
          <Card key={index}>
            <Accordion.Item eventKey={String(index)}>
              <Accordion.Header>
                {instruction.title}
              </Accordion.Header>
              <Accordion.Body>
                {instruction.body}
              </Accordion.Body>
            </Accordion.Item>
          </Card>
        ))}
      </Accordion>
    </Container>
  );
};

export default InstructionsPage;
