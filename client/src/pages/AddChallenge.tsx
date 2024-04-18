import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';
import { useState } from 'react';
import { Container, Row, Col, Alert, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { InfoCircle } from "react-bootstrap-icons";


type NewChallenge = {
    title: string,
    difficulty: string,
    outcome: string,
    keyPatterns: string[],
    generalDescription: string,
    expectedFunctionality: object,
    usageScenarios: object,
}

const PLACEHOLDER = {
    "title": "Challenge Title",
    "difficulty": "Easy | Medium | Hard",
    "outcome": "Short description of the expected outcome of the challenge",
    "keyPatterns": [
        "Pattern 1",
        "Pattern 2",
    ],
    "generalDescription": "Detailed description of the challenge and its requirements.",
    "expectedFunctionality": {
        "FunctionNumber1": "Description of the function and what it does.",
        "FunctionNumber2": "Description of the function and what it does.",
    },
    "usageScenarios": {
        "UserStory1": "As [a user persona], when I [perform this action] I expect to [accomplish this goal].",
        "UserStory2": "As [a user persona], when I [perform this action] I expect to [accomplish this goal].",
    }
}

function validateChallenge(obj: NewChallenge): [boolean, string] {
    // Check if all required properties exist
    if (!obj.title) {
        return [false, "Missing required property: title"];
    }

    if (!obj.difficulty) {
        return [false, "Missing required property: difficulty"];
    }

    if (!obj.outcome) {
        return [false, "Missing required property: outcome"];
    }

    if (!obj.generalDescription) {
        return [false, "Missing required property: generalDescription"];
    }

    // Check if keyPatterns is an array
    if (!Array.isArray(obj.keyPatterns)) {
        return [false, "keyPatterns must be an array"];
    }

    // Check if expectedFunctionality is an object
    if (typeof obj.expectedFunctionality !== 'object') {
        return [false, "expectedFunctionality must be an object"];
    }

    // Check if usageScenarios is an object
    if (typeof obj.usageScenarios !== 'object') {
        return [false, "usageScenarios must be an object"];
    }

    return [true, "Challenge is valid!"];
}

function AddChallenge() {
    const [json, setJson] = useState(PLACEHOLDER);
    const [message, setMessage] = useState<string>("The challenge is valid!");
    const [valid, setValid] = useState<boolean>(true);

    return (
        <Container>
            <Row>
                <header className='d-flex flex-row justfi-content-center align-items-center'>
                    <h1 className="fs-2">Add Challenge</h1>
                    <OverlayTrigger
                        
                        placement="right"
                        overlay={
                            <Tooltip id="tooltip-info">
                                Click outside the editor to validate the challenge.
                            </Tooltip>}
                    >
                        <InfoCircle className="mx-3" />
                    </OverlayTrigger>
                </header>
            </Row>
            <Row className="align-items-stretch mb-2">
                <Col lg="8">
                    <JSONInput
                        style={{ body: { fontSize: '1rem' } }}
                        id='json-editor'
                        placeholder={json} // Data to edit
                        locale={locale}
                        height='600px'
                        confirmGood={true}
                        width="100%"
                        onBlur={(data) => {
                            console.log(data.jsObject)
                            console.log(data.error)
                            if (data.error) {
                                setMessage(data.error.reason);
                                setValid(false);
                            } 
                            const [isValid, message] = validateChallenge(data.jsObject);
                            setMessage(message);
                            setValid(isValid);
                            setJson(data.jsObject);
                        }}
                    />
                </Col>
                <Col className="d-flex flex-column justify-content-between ">
                    <Alert variant={valid ? "primary" : "danger"}>
                        {message}
                    </Alert>
                    <Button disabled={!valid} className="my-2 align-self-start">Add Challenge</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default AddChallenge;
