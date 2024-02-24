/* eslint-disable @typescript-eslint/no-unused-vars */

import { Container, Row, Col, ButtonToolbar, Button, AccordionItem, AccordionHeader, AccordionBody, Accordion } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChallengeDetails } from "../types/challengeDetails";
// import { getDifficulty } from "../utils";
import DifficultyBadge from "../components/DifficultyBadge";

const Challenge = () => {
    //TODO: Fetch this value from the server
    const [completed, setCompleted] = useState(true); //TODO: This value should be fetched from the server
    const [details, setDetails] = useState<ChallengeDetails>();
    const [isLoading, setIsLoading] = useState(true);

    const { id } = useParams();


    //TODO: Refactor once the API is ready
    //TODO: Refactor once the API is ready
    useEffect(() => {   
        //fetch data about the challenge with the provided "id"
        fetch('/api/challenges/' + id).then((response) => {
            if(!response.ok){
                throw new Error(response.statusText);                
            }
            return response.json() as Promise<ChallengeDetails>; //THIS LINE MAY CAUSE ERRORS. Need to test with proper server.
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

    if (isLoading) return <p>Loading...</p>;
    if (details == undefined) return <p>Failed to load challenge details</p>;
    return (
    <Container>
        <section>
        <Row>
            <header className="text-center  bg-dark text-light p-5 pb-3 mb-4 mt-2">
                <h1 className="fw-semibold" >{details.title}</h1>
                <h2 className=" text-light fw-normal fs-3">{details.outcome}</h2>
                <div className="mt-4 me-n4">
                    <DifficultyBadge difficulty={details.difficulty}></DifficultyBadge>
                </div>
            </header> 
        </Row>
        <Row >
            <Col xl={{offset: 11}}>
            </Col>
        </Row>
        {completed &&
        <Row>
            {/* If completed, allow to view design patterns. */}
            <Col xl={{span:2, order:2}}> 
                <span className="fs-5 mb-2 float-end text-success">
                    <strong>Completed</strong>
                </span>
            </Col>
            <Col xl={{span:10, order: 1}}>
                <Accordion className="mb-2">
                    <AccordionItem eventKey="0">
                        <AccordionHeader className="fs-4">
                            <h3 className="fs-4">Key Design Patterns</h3>
                        </AccordionHeader>
                        <AccordionBody>
                            <ul>
                                {details.keyPatterns.map((pattern, index) => {
                                    return <li key={index}>{pattern + (pattern[-1] != "." && ".")}</li>
                                })}
                            </ul>
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </Col>
        </Row>}
        <Row >
            <Col xl={10} >
                <h3 className="fs-4">Description:</h3>
                <p>{details.generalDescription}</p>
            </Col>
        </Row>
        <Row>
            <Col xl={10}>
                <h3 className="fs-4">Expected functionality:</h3>
                <ul>    
                    {Object.entries(details.expectedFunctionality).map(([key, value]) => {
                        return <li key={key}><strong>{key}:</strong> {value}</li>;
                    })}            
                </ul>
            </Col>
        </Row>
        <Row>
            <Col xl={10}>
            <h3 className="fs-4">Usage Scenarios</h3>
            <ul>
            {Object.entries(details.usageScenarios).map(([key, value]) => {
                    return <li key={key}><strong>{key}:</strong> {value}</li>;
                })}  
            </ul>
            </Col>
        </Row>
        <Row className="mt-4">
            <ButtonToolbar className="d-flex justify-content-evenly">
                <Button className="m-1" target="_blank" href="/editor">Open Editor</Button>
                <Button className="m-1" href={"/solutions/post/" + id}>Post a Solution</Button>
                <Button className="m-1" target="_blank" href={"/solutions/challenge/" + id}>View Solutions</Button>
            </ButtonToolbar>
        </Row>
        </ section>
    </Container>);
  };
  
  export default Challenge;
  