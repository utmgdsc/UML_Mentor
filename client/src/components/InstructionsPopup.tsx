import { useState } from "react";
import { Modal, Card, Button } from "react-bootstrap";

type InstructionsPopupProps = {
  show: boolean;
  handleClose: () => void;
  instructions: Instruction[];
};

type Instruction = {
  title: string;
  body: string;
  imgSrc: string;
};

function InstructionsPopup({
  show,
  handleClose,
  instructions,
}: InstructionsPopupProps) {
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);

  const handleNext = () => {
    setCurrentInstructionIndex(
      (prevIndex) => (prevIndex + 1) % instructions.length
    );
  };

  const handlePrev = () => {
    setCurrentInstructionIndex(
      (prevIndex) => (prevIndex - 1 + instructions.length) % instructions.length
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <div>{instructions[currentInstructionIndex].title}</div>
            <div>
              <span className="badge bg-secondary">
                {currentInstructionIndex + 1}/{instructions.length}
              </span>
            </div>
          </div>
        </Card.Header>
        <Card.Img
          variant="top"
          src={instructions[currentInstructionIndex].imgSrc}
        />
        <Card.Body>
          <Card.Text>{instructions[currentInstructionIndex].body}</Card.Text>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handlePrev}>
              Previous
            </Button>
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          </div>
        </Card.Body>
        <Card.Footer>
          <Button
            variant="outline-danger"
            onClick={handleClose}
            style={{ float: "right" }}
          >
            Close
          </Button>
        </Card.Footer>
      </Card>
    </Modal>
  );
}

export default InstructionsPopup;
export type { Instruction };
