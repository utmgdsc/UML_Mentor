import React, { useState } from "react";
import { Modal, Button, Card, Accordion } from "react-bootstrap";
import InstructionsPopup from "./InstructionsPopup";
import { umlDiagramInstructions } from "./instructionsData";

type NewUserPopupProps = {
  show: boolean;
  handleClose: () => void;
};

const NewUserPopup = ({ show, handleClose }: NewUserPopupProps) => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg" scrollable>
        <Card>
          <Card.Header>
            <strong>UML Mentor Help</strong>
          </Card.Header>
          <Card.Body style={{ maxHeight: "400px", overflowY: "scroll" }}>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  1. Introduction to Software Architecture
                </Accordion.Header>
                <Accordion.Body>
                  Software architecture plays a critical role in the development
                  of robust and scalable applications. By understanding the
                  foundational elements, students can build more efficient and
                  maintainable systems.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>2. What is UML Mentor?</Accordion.Header>
                <Accordion.Body>
                  UML Mentor is a collaborative learning platform that offers a
                  unique approach to mastering software design through practical
                  challenges, peer feedback, and a supportive community.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  3. Getting Started with UML Mentor
                </Accordion.Header>
                <Accordion.Body>
                  To start, visit the UML Mentor website and log in using
                  shibboleth. Familiarize yourself with the dashboard to access
                  challenges, view your contribution points, and participate in
                  the community.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>4. UML Editor Tutorial</Accordion.Header>
                <Accordion.Body>
                  Learn how to use the UML editor through our step-by-step
                  tutorial.
                  <Button
                    variant="primary"
                    className="ms-2"
                    onClick={() => setShowInstructions(true)}
                  >
                    Launch Tutorial
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>5. Browsing Challenges</Accordion.Header>
                <Accordion.Body>
                  Challenges on UML Mentor cover a range of topics and
                  difficulties. They're designed to test your application of
                  design patterns and principles in creating UML diagrams.
                  Select a challenge that aligns with your interests or areas
                  you wish to improve. Challenge difficulty ranges from
                  easy(questions with 1 star on the challenge card) to
                  hard(questions with 3 stars on the challenge card).
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="5">
                <Accordion.Header>6. Submitting Solutions</Accordion.Header>
                <Accordion.Body>
                  Create your solution through the built-in editor on the right
                  side of the screen and press submit solution to submit your
                  solution to a question. Submitted solutions can be viewed and
                  commented by other users.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="6">
                <Accordion.Header>
                  7. UML Diagrams and Design Principles
                </Accordion.Header>
                <Accordion.Body>
                  Your solutions will be based on UML diagrams, which are a
                  critical aspect of software design. They help visualize the
                  structure and behavior of systems.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="7">
                <Accordion.Header>
                  8. Understanding the Points System
                </Accordion.Header>
                <Accordion.Body>
                  Points are awarded based on your participation in solving
                  challenges. They serve as a metric for your growth and
                  contributions to the community. Points are awarded based on
                  difficulty:
                  <br />
                  - Easy challenges (★): 1 point
                  <br />
                  - Medium challenges (★★): 2 points
                  <br />
                  - Hard challenges (★★★): 3 points
                  <br />
                  The difficulty level is indicated by the number of stars next
                  to a challenge.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="8">
                <Accordion.Header>
                  9. Community Feedback and Interaction
                </Accordion.Header>
                <Accordion.Body>
                  Engage with solutions posted by others by commenting and
                  discussing different approaches. Providing useful feedback
                  helps build a supportive learning community and helps others
                  improve their solutions.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="9">
                <Accordion.Header>
                  10. Managing Your Submissions
                </Accordion.Header>
                <Accordion.Body>
                  You can view and manage your submissions from your profile.
                  You may delete, or update your solutions as needed.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="10">
                <Accordion.Header>
                  11. Data Privacy and User Conduct
                </Accordion.Header>
                <Accordion.Body>
                  UML Mentor uses your UTORid for authentication and display.
                  Your UTORid and submissions will be visible to other users of
                  the platform, instructors, and TAs. Your solutions, comments,
                  and profile information (including UTORid) are publicly
                  visible to other users of the platform. While your work will
                  not be used for grading, please be mindful that your
                  contributions are visible to the course community.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="11">
                <Accordion.Header>12. Support</Accordion.Header>
                <Accordion.Body>
                  If there are issues or suggestions for the platform, feel free
                  to write to us through your course instructor. We appreciate
                  your feedback!
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="12">
                <Accordion.Header>
                  13. Credits and Acknowledgements
                </Accordion.Header>
                <Accordion.Body>
                  UML Mentor is made possible by the dedicated efforts of our
                  team:
                  <br />
                  Faculty Supervisor:
                  <br />
                  Rutwa Engineer
                  <br />
                  Mentors:
                  <br />
                  Arthur Ng
                  <br />
                  Developers:
                  <br />
                  Omar Khamis, Vlad Yaremchuk, Alex Apostolu, Eren Suner,
                  Rajveer Singh Anand, Krit Kasikpan, Tham Paweewan, Harsimar
                  Singh
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </Card.Footer>
        </Card>
      </Modal>

      <InstructionsPopup
        show={showInstructions}
        handleClose={() => setShowInstructions(false)}
        instructions={umlDiagramInstructions}
      />
    </>
  );
};

export { NewUserPopup };
export default NewUserPopup;
