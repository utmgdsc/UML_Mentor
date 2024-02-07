/* eslint-disable @typescript-eslint/no-unused-vars */

import { Container, Row, Col, ButtonToolbar, Button } from "react-bootstrap";
import { FC, useState } from "react";


interface ChallengeProps {
    id: number
};

interface ExpectedFunctionProps {
    name: string,
    description: string
}

const Challenge:FC<ChallengeProps> = ({id}) => {

    const [completed, setCompleted] = useState(true);

    //fetch data about the challenge with the provided "id" here... (useEffect)

    const challenge_details = {
        "id": 12,
        "title": "Hotel Room Booking System",
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

    return(
    <Container>
        <section>
        <Row>
            <header className="text-center bg-secondary bg-gradient text-light p-5 my-4">
                <h1>{challenge_details.title}</h1>
                <h2>{challenge_details.outcome}</h2>
            </header> 
        </Row>
        <Row className="">
            <Col className="col-8">
                <h3>Description:</h3>
                <p>{challenge_details.generalDescription}</p>
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
  