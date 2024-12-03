import React from "react";
import { Modal, Button, Card, Accordion } from "react-bootstrap";
import { useTour } from "../context/TourContext";
import { useNavigate } from "react-router-dom";

type NewUserPopupProps = {
  show: boolean;
  handleClose: () => void;
};

const NewUserPopup = ({ show, handleClose }: NewUserPopupProps) => {
  const { setRunTour, setStepIndex, setTourType } = useTour();
  const navigate = useNavigate();

  const handleStartLandingTour = () => {
    handleClose();
    setTourType("landing");
    setRunTour(false);
    setStepIndex(0);
    navigate("/");
    setTimeout(() => {
      setRunTour(true);
    }, 800);
  };

  const handleStartEditorTour = () => {
    setTourType("editor");
    setRunTour(false);
    setStepIndex(0);
    handleClose();

    // Get the most recent challenge from localStorage
    const recentChallenge = localStorage.getItem("lastVisitedChallenge");
    const challengePath = recentChallenge
      ? `/challenge/${recentChallenge}`
      : "/challenge/1";

    navigate(challengePath);
    setTimeout(() => {
      setRunTour(true);
    }, 800);
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" scrollable>
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <strong>UML Mentor</strong>
            <div>
              <Button
                variant="primary"
                onClick={handleStartLandingTour}
                className="mx-2"
              >
                Take Website Tour
              </Button>
              <Button
                variant="info"
                onClick={handleStartEditorTour}
                className="mx-2"
              >
                Take Editor Tour
              </Button>
              <Button
                variant="secondary"
                onClick={handleClose}
                className="mx-2"
              >
                Close
              </Button>
            </div>
          </div>
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
                challenges, view your points, and participate in the community.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>4. Browsing Challenges</Accordion.Header>
              <Accordion.Body>
                Challenges on UML Mentor cover a range of topics and
                difficulties. They're designed to test your application of
                design patterns and principles in creating UML diagrams. Select
                a challenge that aligns with your interests or areas you wish to
                improve.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>6. Submitting Solutions</Accordion.Header>
              <Accordion.Body>
                Provide your solution by uploading a UML diagram and
                accompanying description. Ensure that your submissions are
                thorough and reflect the challenge requirements. You can also
                use the built-in editor to create your solutions!
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>
                7. UML Diagrams and Design Principles
              </Accordion.Header>
              <Accordion.Body>
                Your solutions will be based on UML diagrams, which are a
                critical aspect of software design. They help visualize the
                structure and behavior of systems.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="6">
              <Accordion.Header>
                8. Understanding the Points System
              </Accordion.Header>
              <Accordion.Body>
                Points are awarded based on the complexity of the challenge
                difficulty. They serve as a metric for your growth and
                contributions to the community. 10 points are for easy
                questions, 20 points are for medium questions, and 30 points for
                hard questions. The difficulty level is indicated by the number
                of stars next to a challenge. The more stars, the more
                difficult.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="7">
              <Accordion.Header>
                9. Community Feedback and Interaction
              </Accordion.Header>
              <Accordion.Body>
                Engage with solutions posted by others by commenting and
                discussing different approaches. Useful feedback is incentivized
                with points, encouraging a helpful community. You will earn 20
                points by providing feedback to your peers!
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="8">
              <Accordion.Header>10. Managing Your Submissions</Accordion.Header>
              <Accordion.Body>
                You can view and manage your submissions from your profile.
                Edit, delete, or update your solutions as needed.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="9">
              <Accordion.Header>
                12. Achievements and Leaderboards
              </Accordion.Header>
              <Accordion.Body>
                Unlock achievements as you progress and climb the leaderboards
                by actively participating and excelling in challenges.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="10">
              <Accordion.Header>
                13. Data Privacy and User Conduct
              </Accordion.Header>
              <Accordion.Body>
                Anything you upload to UML Mentor will be visible to the
                instructors and TAs of the course, however, your uploads will
                not be used for grading.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="11">
              <Accordion.Header>14. Contact and Support</Accordion.Header>
              <Accordion.Body>
                <ul>
                  <li>Omar Khamis: omar.khamis@mail.utoronto.ca</li>
                  <li>Vlad Yaremchuk: vlad@mail.utoronto.ca</li>
                  <li>Alex Apostolu: alex@mail.utoronto.ca</li>
                  <li>Eren Suner: eren@mail.utoronto.ca</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="12">
              <Accordion.Header>
                15. Credits and Acknowledgements
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
                Omar Khamis, Vlad Yaremchuk, Alex Apostolu, Eren Suner
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>
    </Modal>
  );
};

export { NewUserPopup };
export default NewUserPopup;
