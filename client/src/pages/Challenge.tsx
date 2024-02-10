/* eslint-disable @typescript-eslint/no-unused-vars */

import { Container, Row, Col, ButtonToolbar, Button, AccordionItem, AccordionHeader, AccordionBody, Accordion } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChallengeDetails } from "../types/challengeDetails";
import { ChallengeDifficulties } from "../types/challengeDifficulties";
// import { getDifficulty } from "../utils";
import DifficultyBadge from "../components/DifficultyBadge";

//FOR TESTING ONLY
const challengeDetails: ChallengeDetails = {
    difficulty: ChallengeDifficulties.HARD,
    "title": "Intelligent Urban Planning Simulation",
    "outcome": "A simulation tool for urban planners to model and visualize the impact of development projects on city infrastructure.",
    "keyPatterns": [
      "Strategy pattern for different simulation algorithms",
      "Factory Method pattern for creating various urban model components",
      "Observer pattern for monitoring changes in the simulation environment",
      "Mediator pattern for coordinating interactions between simulation components",
      "Prototype pattern for cloning existing urban models for new simulations"
    ],
    "generalDescription": "UrbanSim is a cutting-edge simulation tool that enables urban planners to create detailed models of urban development projects and assess their potential impacts on traffic, population density, public services, and the environment. By offering a variety of components and dynamic interactions, UrbanSim provides a comprehensive view of potential urban transformations.",
    "expectedFunctionality": {
      "ModelCreation": "Design comprehensive urban models with diverse components including residential areas, commercial zones, transportation networks, and public services.",
      "ImpactAnalysis": "Analyze the effects of proposed developments on city infrastructure, such as traffic congestion, environmental sustainability, and public service accessibility.",
      "SimulationVariants": "Generate and compare different development scenarios to identify optimal urban layouts and policies."
    },
    "usageScenarios": {
      "CloningForExpansionProjects": "Urban planners use UrbanSim to clone the existing urban model as a baseline for proposed expansions. This cloned model is then augmented with new residential areas, commercial centers, and transportation networks. This enables a direct comparison of potential future developments against the current state.",
      "NewPublicTransportSystem": "Planners simulate the introduction of a new public transport system, evaluating its effects on traffic flow and commuter times. The simulation includes various transport modes and their integration into the existing urban fabric.",
      "UrbanRenewalProjects": "UrbanSim models the impact of a major urban renewal project, providing insights into potential challenges and benefits for the community. This includes revitalizing old districts, adding green spaces, and improving public amenities.",
      "PopulationGrowthAdaptation": "Planners use UrbanSim to anticipate changes due to population growth, simulating the expansion of housing, schools, hospitals, and transportation systems to maintain quality of life for residents."
    }
  };

const Challenge = () => {
    //TODO: Fetch this value from the server
    const [completed, setCompleted] = useState(true);
    const [details, setDetails]  = useState<ChallengeDetails>();

    const { id } = useParams();


    //TODO: Refactor once the API is ready
    useEffect(() => {   
        //fetch data about the challenge with the provided "id"
        fetch('/api/challenge/' + id).then((response) => {
            if(!response.ok){
                throw new Error(response.statusText);                
            }
            return response.json() as Promise<{data : ChallengeDetails}>; //THIS LINE MAY CAUSE ERRORS. Need to test with proper server.
        }).then((data) => {
            setDetails(data.data);
            return;
        }).catch((err) => {
            console.log();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error("Failed fetching the challenge number: " + id + "\nError message: " + err.message)
        });
   }, [id])

    //START FOR TESTING ONLY

    if (details == undefined){
        setDetails(challengeDetails);  
    } 

    //END FOR TESTING ONLY

    if (details != undefined)
    return(
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
                    {Object.entries(challengeDetails.expectedFunctionality).map(([key, value]) => {
                        return <li key={key}><strong>{key}:</strong> {value}</li>;
                    })}            
                </ul>
            </Col>
        </Row>
        <Row>
            <Col xl={10}>
            <h3 className="fs-4">Usage Scenarios</h3>
            <ul>
            {Object.entries(challengeDetails.usageScenarios).map(([key, value]) => {
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
  