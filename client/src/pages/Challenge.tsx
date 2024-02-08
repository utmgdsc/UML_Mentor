/* eslint-disable @typescript-eslint/no-unused-vars */

import { Container, Row, Col, ButtonToolbar, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

enum ChallengeDifficulties {
    EASY,
    MEDIUM,
    HARD
}

type ChallengeDetails = {
    title: string;
    outcome: string;
    difficulty: ChallengeDifficulties;
    generalDescription: string;
    keyPatterns: Array<string>;
    expectedFunctionality: object;
    usageScenarios: object;
}

const Challenge = () => {

    const [completed, setCompleted] = useState(true);
    const [details, setDetails]  = useState<ChallengeDetails>();
    //fetch data about the challenge with the provided "id" here... (useEffect)
    const { id } = useParams();

    useEffect(() => {
    
        //NEEDS TESTING
        //get the challenge details
        fetch('/api/challenge/' + id).then((response) => {
            if(!response.ok){
                throw new Error(response.statusText);                
            }
            console.log(response);
            return response.json() as Promise<{data : ChallengeDetails}>; //THIS LINE MAY CAUSE ERRORS. Need to test with proper server.
        }).then((data) => {
            console.log(data);
            setDetails(data.data);
            return;
        }).catch((err) => {
            console.log();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error("Failed fetching the challenge number: " + id + "\nError message: " + err.message)
        });
   }, [id])


    const challenge_details: ChallengeDetails = {
        "title": "Hotel Room Booking System",
        "difficulty": ChallengeDifficulties.MEDIUM,
        "outcome": "A system for managing hotel room reservations.",
        "keyPatterns": [
          "Factory Method pattern for creating different types of rooms",
          "Singleton pattern for central reservation management"
        ],
        "generalDescription": "Develop a reservation system for 'Sunrise Hotels' that can handle bookings for various room types, including standard, deluxe, and suite. The system should centralize booking operations to maintain consistency and reliability across the hotel chain.",
        "expectedFunctionality": {
          "BookRoom": "Reserve a specific type of room for guests.",
          "CancelBooking": "Cancel an existing reservation.",
          "ViewBookings": "Display current bookings and their statuses."
        },
        "usageScenarios": {
          "OnlineRoomSelection": "Guests browse available rooms, filter by room type, amenities, and price, and then book their preferred room online.",
          "BookingModification": "Guests easily modify their existing bookings, such as changing the room type or dates, through the system without the need to call the hotel.",
          "ReservationOverview": "Hotel staff access a centralized dashboard to view all current and upcoming bookings, manage room availability, and respond to customer inquiries about reservations."
        }
      };


    //START FOR TESTING ONLY
    if (details == undefined){
        setDetails(challenge_details);  
    } 
    //END FOR TESTING ONLY
    if (details != undefined)
    return(
    <Container>
        <section>
        <Row>
            <header className="text-center bg-secondary bg-gradient text-light p-5 my-4">
                <h1>{details.title}</h1>
                <h2>{details.outcome}</h2>
            </header> 
        </Row>
        <Row className="">
            <Col className="col-8">
                <h3>Description:</h3>
                <p>{details.generalDescription}</p>
            </Col>
            <Col className="text-center align-middle">
                {completed && <div className="">
                    <p className="text-success"><strong>Completed</strong></p>
                    <Button>View Key Patterns</Button>
                </div>}
            </Col>
        </Row>
        <Row>
            <Col className="col-8">
                <h3>Expected functionality:</h3>
                <ul>    
                    {Object.entries(challenge_details.expectedFunctionality).map(([key, value]) => {
                        return <li key={key}><strong>{key}:</strong> {value}</li>;
                    })}            
                </ul>
            </Col>
        </Row>
        <Row>
            <Col className="col-8">
            <h3>Usage Scenarios</h3>
            <ul>
            {Object.entries(challenge_details.usageScenarios).map(([key, value]) => {
                    return <li key={key}><strong>{key}:</strong> {value}</li>;
                })}  
            </ul>
            </Col>
        </Row>
        <Row className="my-4">
            <ButtonToolbar className="d-flex justify-content-evenly">
                <Button>Open Editor</Button>
                <Button>Post a Solution</Button>
                <Button>View Solutions</Button>
            </ButtonToolbar>
        </Row>
        </ section>
    </Container>)
  }
  
  export default Challenge;
  