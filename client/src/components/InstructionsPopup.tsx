import { useState } from 'react';
import { Modal, Card, Button } from 'react-bootstrap';

type InstructionsPopupProps = {
  show: boolean;
  handleClose: () => void;
};

const instructions = [
    { 
      title: 'Understand the Problem',
      body: 'Begin by thoroughly understanding the problem statement. A clear grasp of the situation is crucial for crafting an effective solution.',
      imgSrc: '/images/InstructionsDesc.png'
    },
    { 
      title: 'Check the Difficulty',
      body: 'The number of stars indicates the difficulty of the challenge. More stars mean a greater challenge!',
      imgSrc: '/images/InstructionDifficulty.png'
    },
    { 
      title: 'Design Your Solution',
      body: 'Use our integrated drawing tool to diagram your solution. A well-thought-out design is key to addressing the challenge effectively.',
      imgSrc: '/images/InstructionsEditor.png'
    },
    { 
      title: 'Submit Your Work',
      body: 'Once you are satisfied with your design, go ahead and submit it. Your innovative solutions are what were looking forward to seeing.',
      imgSrc: '/images/InstructionsPostSol.png'
    },
    { 
      title: 'Collaborate and Provide Feedback',
      body: 'Engage with your peers by reviewing their solutions. Constructive feedback fosters learning and innovation within our community.',
      imgSrc: '/images/InstructionsViewSol.png'
    }
    // Add more instructions as needed
  ];
  


function InstructionsPopup({ show, handleClose }: InstructionsPopupProps) {
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);

  const handleNext = () => {
    setCurrentInstructionIndex((prevIndex) => (prevIndex + 1) % instructions.length);
  };

  const handlePrev = () => {
    setCurrentInstructionIndex((prevIndex) => (prevIndex - 1 + instructions.length) % instructions.length);
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
