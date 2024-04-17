import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';
import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

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


function AddChallenge() {
    const [json, setJson] = useState(PLACEHOLDER);

    
    return (
        <Container>
            <Row>
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
                            setJson(data.jsObject)
                        }}
                    />
                </Col>
                <Col>
                </Col>
            </Row>
        </Container>
    );
}

export default AddChallenge;
