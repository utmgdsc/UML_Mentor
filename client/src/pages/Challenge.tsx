/* eslint-disable @typescript-eslint/no-unused-vars */

import { Container, Row, Col, ButtonToolbar, Button } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ChallengeDetails } from "../types/challengeDetails";
import { StarFill } from "react-bootstrap-icons";
import InstructionsPopup from '../components/InstructionsPopup';


const Challenge = () => {
    // We can query the db for solutions with the current user id and the challenge id
    const [details, setDetails] = useState<ChallengeDetails>();
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    // Setting the state true initally to show the instructions
    const [showInstructions, setShowInstructions] = useState(false);

    const [userRole, setUserRole] = useState<string | null>(null); 
    //fetch the user role from the server
    useEffect(() => {
      fetch("/api/users/whoami")
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json() as Promise<{role: string}>;
        })
        .then((data) => {
          setUserRole(data.role);
        })
        .catch((err: Error) => { // Add the error type 'Error'
          console.error("Failed fetching the user role.\nError message: " + err.message);
        });
    }, []);

    useEffect(() => {
      const instructionsShown = localStorage.getItem('instructionsShown');
      if (!instructionsShown) {
        setShowInstructions(true);
        localStorage.setItem('instructionsShown', 'true');
      }
    }, []);
     
  useEffect(() => {
    //fetch data about the challenge with the provided "id"
    fetch("/api/challenges/" + id)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<ChallengeDetails>;
      })
      .then((data) => {
        setDetails(data);
        setIsLoading(false);
        // console.log(details);
        return;
      })
      .catch((err: Error) => {
        console.log();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.error(
          "Failed fetching the challenge number: " +
            id +
            "\nError message: " +
            err.message,
        );
      });
  }, [id]);

    useEffect(() => {   
        //fetch data about the challenge with the provided "id"
        fetch('/api/challenges/' + id).then((response) => {
            if(!response.ok){
                throw new Error(response.statusText);                
            }
            return response.json() as Promise<ChallengeDetails>;
        }).then((data) => {
            setDetails(data);
            setIsLoading(false);
            // console.log(details);
            return;
        }).catch((err) => {
            console.log();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error("Failed fetching the challenge number: " + id + "\nError message: " + err.message)
        });
   }, [id]);

  const difficultyStars = useMemo(
    () =>
      details &&
      Array.from({ length: details.difficulty + 1 }, (_, i) => (
        <StarFill key={i} />
      )),
    [details],
  );

  if (isLoading) return <p>Loading...</p>;
  if (details == undefined) return <p>Failed to load challenge details</p>;
  if (details.hidden && userRole != "admin") return <p>The challenge is hidden</p>;
  return (
    <Container>
      <section>
        <Row>
          <header className="text-center bg-secondary-subtle text-dark p-5 pb-3 mb-4 mt-2">
            <h1 className="fw-bold">{details.title}</h1>
            <h2 className=" text-dark fw-semibold fs-3">{details.outcome}</h2>
            <div className="mt-4 me-n4 float-start ">{difficultyStars}</div>
            {details.completed && (
              <span className=" mt-4 float-end text-success">
                <strong>Completed</strong>
              </span>
            )}
          </header>
        </Row>
        <Row>
          <Col lg={{ span: 6, offset: 0 }} xl={{ span: 5, offset: 1 }}>
            <h3 className="fs-4">Description:</h3>
            <p>{details.generalDescription}</p>
          </Col>
          <Col lg={6} xl={5}>
            <h3 className="fs-4">Expected functionality:</h3>
            <ul>
              {Object.entries(details.expectedFunctionality).map(
                ([key, value]) => {
                  return (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  );
                },
              )}
            </ul>
          </Col>
        </Row>
        <Row className={!details.completed ? "align-items-end mb-4" : ""}>
          <Col lg={{ span: 6, offset: 0 }} xl={{ span: 5, offset: 1 }}>
            <h3 className="fs-4">Usage Scenarios</h3>
            <ul>
              {Object.entries(details.usageScenarios).map(([key, value]) => {
                return (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                );
              })}
            </ul>
          </Col>
          {
            //if completed, display key patterns, otherwise display buttons
            details.completed ? (
              <Col lg={{ span: 6, offset: 0 }} xl={{ span: 5 }}>
                <h3 className="fs-4 text-success">Key Design Patterns</h3>
                <ul>
                  {details.keyPatterns.map((pattern, index) => {
                    return (
                      <li key={index}>
                        {pattern + (pattern[-1] !== "." && ".")}
                      </li>
                    );
                  })}
                </ul>
              </Col>
            ) : (
              <Col lg={{ span: 6, offset: 0 }} xl={{ span: 5 }}>
                <ButtonToolbar className="d-flex align-items-end justify-content-between">
                  <Button className="m-1" target="_blank" href={"/editor?type=challenge&id=" + id}>
                    Open Editor
                  </Button>
                  <Button className="m-1" href={"/solutions/post/" + id}>
                    Post a Solution
                  </Button>
                  <Button className="m-1" onClick={() => setShowInstructions(true)}>
                    Instructions
                  </Button>
                </ButtonToolbar>
              </Col>
            )
          }
        </Row>
        {
          // If completed, display buttons at the bottom
          details.completed && (
            <Row>
              <ButtonToolbar className="d-flex align-items-end justify-content-around my-4">
                <Button className="m-1" target="_blank" href={"/editor?type=challenge&id=" + id}>
                  Open Editor
                </Button>
                <Button className="m-1" href={"/solutions/post/" + id}>
                  Post a Solution
                </Button>
                <Button
                  className="m-1"
                  target="_blank"
                  href={"/solutions"}
                >
                  View Solutions
                </Button>
                <Button className="m-1" onClick={() => setShowInstructions(true)}>
                    Instructions
                  </Button>
              </ButtonToolbar>
            </Row>
          )
        }
      </section>
        <InstructionsPopup show={showInstructions} handleClose={() => { setShowInstructions(false) }} />
    </Container>
  );
};

export default Challenge;
