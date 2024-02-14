/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import { Container, Row, Col, Button, Stack, Dropdown, Form, FormCheck} from "react-bootstrap";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort";
import { ChallengeDifficulties } from "../types/challengeDifficulties";
// START FOR TESTING ONLY
const challengesDemo: ChallengeDetailsShort[] = [
    {
        title: "Demo Challenge Card",
        generalDescription:
            "In this demo challenge you will be demoing our platform. From creating UML diagrams to submitting" +
            " and getting review, we provide you all you need to become a Software Architecture monster!",
        id: 0,
        difficulty: ChallengeDifficulties.HARD,
    },
    {
        title: "Demo Challenge Card",
        generalDescription:
            "In this demo challenge you will be demoing our platform. From creating UML diagrams to submitting" +
            " and getting review, we provide you all you need to become a Software Architecture monster!",
        id: 1,
        difficulty: ChallengeDifficulties.MEDIUM,
    },
    {
        title: "Demo Challenge Card",
        generalDescription:
            "In this demo challenge you will be demoing our platform. From creating UML diagrams to submitting" +
            " and getting review, we provide you all you need to become a Software Architecture monster!",
        id: 2,
        difficulty: ChallengeDifficulties.EASY,
    },
    {
        title: "Demo Challenge Card",
        generalDescription:
            "In this demo challenge you will be demoing our platform. From creating UML diagrams to submitting" +
            " and getting review, we provide you all you need to become a Software Architecture monster!",
        id: 3,
        difficulty: ChallengeDifficulties.HARD,
    },
    {
        title: "Demo Challenge Card",
        generalDescription:
            "In this demo challenge you will be demoing our platform. From creating UML diagrams to submitting" +
            " and getting review, we provide you all you need to become a Software Architecture monster!",
        id: 4,
        difficulty: ChallengeDifficulties.MEDIUM,
    }
]
// END FOR TESTING ONLY

function Challenges() {
    const [challengesData, setChallengesData] = useState([] as ChallengeDetailsShort[]);
    const [sortByDifficulty, setSortByDifficulty] = useState(false);
    const [filterByDifficulty, setFilterByDifficulty] = useState([] as ChallengeDifficulties[]);
    const [hideComplete, setHideComplete] = useState(false);

    function makeGrid(challenges: ChallengeDetailsShort[]): JSX.Element[] {
        const grid: JSX.Element[] = [];
        let row: JSX.Element[] = [];
        let i = 0;
        for (const challenge of challenges) {
            row.push(
                <Col lg={4} key={i} className="mb-4">
                    <ChallengeCard {...challenge} />
                </Col>
            );
            i++;
            if (i % 3 === 0) {
                grid.push(<Row sm={1} lg={3} key={i}>{row}</Row>);
                row = [];
            }
        }
        if (row.length > 0) {
            grid.push(<Row key={i}>{row}</Row>);
        }
        return grid;
    }

    useEffect(() => {    
        //NEXT LINE IS FOR TESTING ONLY
        setChallengesData(challengesDemo);
    }, [hideComplete, sortByDifficulty, filterByDifficulty]);

    const handleSortByDifficulty = () => {
        setSortByDifficulty(!sortByDifficulty);
        if (sortByDifficulty) {
            // Sort challengesData in ascending order by difficulty
            setChallengesData([...challengesData].sort((a, b) => a.difficulty - b.difficulty));
        } else {
            // Sort challengesData in descending order by difficulty
            setChallengesData([...challengesData].sort((a, b) => b.difficulty - a.difficulty));
        }
    };

    function handleFilterByDifficulty() {
        return ;
    }

    return(
        <section>
            <Container>
                <Row className="my-2">
                    <Col>
                    <header>
                        <h1 className="fs-2">Challenges</h1>
                        <h2 className="fs-5">Choose a challenge to start solving!</h2>
                        </header>
                    </Col>
                    <Col>
                        <Dropdown className="mt-4 float-end "> 
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                Sort by Difficulty
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleSortByDifficulty}>
                                    {sortByDifficulty ? "Easier First" : "Harder First"}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="mt-4 mx-2 float-end">
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                Filter by
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Form className="ms-2">
                                    <Form.Label>Difficulty</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        label="Easy"
                                        onChange={handleFilterByDifficulty}
                                        // checked={filterByDifficulty.includes(ChallengeDifficulties.EASY)}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Medium"
                                        onChange={handleFilterByDifficulty}
                                        // checked={filterByDifficulty.includes(ChallengeDifficulties.MEDIUM)}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Hard"
                                        onChange={handleFilterByDifficulty}
                                        // checked={filterByDifficulty.includes(ChallengeDifficulties.HARD)}
                                    />
                                    </Form>
                                </Dropdown.Menu>
                            </Dropdown>
                        <Button 
                            className={"mt-4 float-end " + (hideComplete ? "btn-primary" : "btn-danger")}
                            onClick={() => {setHideComplete(!hideComplete)}}
                            >
                            {hideComplete ? "Showing Completed" : "Hiding Completed"}
                        </Button>        
                    </Col>
                </Row>
                {makeGrid(challengesData)}
            </Container>
        </section>
    );
}


export default Challenges;