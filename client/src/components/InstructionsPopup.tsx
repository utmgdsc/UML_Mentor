import { useState } from 'react';
import { Modal, Card, Button } from 'react-bootstrap';

type InstructionsPopupProps = {
  show: boolean;
  handleClose: () => void;
};

const instructions = [
  { title: 'Grasp the Challenge', body: 'Begin by thoroughly understanding the problem statement. A clear grasp of the situation is crucial for crafting an effective solution.' },
  { title: 'Difficulty of Challenge', body: 'The stars shown on the challenge indicates the difficulty. The more starts the more difficulty' },
  { title: 'Design Your Solution', body: 'Use our integrated drawing tool to diagram your solution. A well-thought-out design is key to addressing the challenge effectively.' },
  { title: 'Submit Your Work', body: 'Once you are satisfied with your design, go ahead and submit it. Your innovative solutions are what we looking forward to seeing.' },
  { title: 'Collaborate and Feedback', body: 'Engage with your peers by reviewing their solutions. Constructive feedback fosters learning and innovation within our community.' }
  // add more as needed
];


function InstructionsPopup({ show, handleClose }: InstructionsPopupProps) {
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const instructionCount = `${currentInstructionIndex + 1}/${instructions.length}`;

  const handleNext = () => {
    setCurrentInstructionIndex((prevIndex) => (prevIndex + 1) % instructions.length);
  };

  const handlePrev = () => {
    setCurrentInstructionIndex((prevIndex) => (prevIndex - 1 + instructions.length) % instructions.length);
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="xl">
      <Card>
        <Card.Header>{instructions[currentInstructionIndex].title}</Card.Header>
        <Card.Body>
          <Card.Text>{instructions[currentInstructionIndex].body}</Card.Text>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handlePrev}>Previous</Button>
            <Button variant="primary" onClick={handleNext}>Next</Button>
          </div>
        </Card.Body>
        <Card.Footer>
          <Button variant="outline-danger" onClick={handleClose} style={{float: 'right'}}>
            Close
          </Button>
        </Card.Footer>
      </Card>
    </Modal>
  );
}

export default InstructionsPopup;
