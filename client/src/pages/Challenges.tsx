/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import { Container, Row, Col, Button, Stack, Dropdown, Form, FormCheck} from "react-bootstrap";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort";
import { ChallengeDifficulties } from "../types/challengeDifficulties";


function Challenges() {
    const challengesData = useRef<ChallengeDetailsShort[]>();

    const [grid, setGrid] = useState([] as JSX.Element[]);
    const [isLoading, setIsLoading] = useState(true);

    const [sortByDifficulty, setSortByDifficulty] = useState(false);
    const [filter, setFilter] = useState([] as ChallengeDifficulties[]);
    const [hideComplete, setHideComplete] = useState(false);


    /**
     * Handles the sorting of challenges by difficulty
     */
    const handleSortByDifficulty = useCallback((prevChallengesData: ChallengeDetailsShort[]) => {
        const sortedChallengesData = [...prevChallengesData];
        if (!sortByDifficulty) {
            // Sort challengesData in ascending order by difficulty
            sortedChallengesData.sort((a, b) => a.difficulty - b.difficulty);
        } else {
            // Sort challengesData in descending order by difficulty
            sortedChallengesData.sort((a, b) => b.difficulty - a.difficulty);
        }
        return sortedChallengesData;
    }, [sortByDifficulty]);
    

    /**
     * Create the grid of challenges based on the filter
     * @param challenges the challenges data
     * @returns the grid of ChallengeCards
     */
    const makeGrid = useCallback((): JSX.Element[] => {
        if (challengesData.current === undefined) {
            return [];
        }

        const grid: JSX.Element[] = [];
        let row: JSX.Element[] = [];
        let i = 0;
        for (const challenge of challengesData.current) {
            //make sure the challenge is not filtered out
            if(!(filter.includes(challenge.difficulty)) && filter.length > 0) {
                // console.log("Filtering out: " + challenge.difficulty);
                // console.log(filter);
                continue;
            }
            
            // if(hideComplete && challenge.completed) { //TODO: add completed field to challengeDetailsShort
            //     // console.log("Filtering out: " + challenge.title);
            //     continue;
            // }

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
    }, [filter]);


    useEffect(() => {   
        //fetch data about the challenge with the provided "id"
        setIsLoading(true);
        fetch('/api/challenges').then((response) => {
            if(!response.ok){
                throw new Error(response.statusText);                
            }
            return response.json() as Promise<ChallengeDetailsShort[]>;
        }).then((data) => {
            challengesData.current = data;
            console.log(data);
            setIsLoading(false);
            return;
        }).catch((err) => {
            console.log();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error("Failed fetching the challenges." + "\nError message: " + err.message)
        });
   }, []);

   
    useEffect(() => {    
        if (challengesData.current != undefined) {
            const sortedChallengesData = handleSortByDifficulty(challengesData.current);
            challengesData.current = sortedChallengesData;
        }
        const newGrid = makeGrid();
        setGrid(newGrid);
        console.log("Grid updated");
    }, [hideComplete, makeGrid, handleSortByDifficulty, challengesData, filter, isLoading]);

    
    function handleFilter(difficulty: ChallengeDifficulties) {
        if (filter.includes(difficulty)) {
            setFilter(filter.filter((d) => d !== difficulty));
        }
        else {
            setFilter([...filter, difficulty]);
        }
    }


    return(
        <section>
            <Container>
                <header>
                    <Row className="my-2">
                        <Col>
                            <h1 className="fs-2">Challenges</h1>
                            <h2 className="fs-5">Choose a challenge to start solving!</h2>
                        </Col>
                        <Col>
                            <Dropdown className="mt-4 float-end "> 
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    Sort by Difficulty
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={ () => {
                                        setSortByDifficulty(!sortByDifficulty);
                                    }}>
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
                                            onClick={() => {
                                                handleFilter(ChallengeDifficulties.EASY);
                                            }}
                                            // checked={filterByDifficulty.includes(ChallengeDifficulties.EASY)}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Medium"
                                            onClick={
                                                () => {
                                                    handleFilter(ChallengeDifficulties.MEDIUM);
                                                }}
                                            // checked={filterByDifficulty.includes(ChallengeDifficulties.MEDIUM)}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Hard"
                                            onClick={
                                                () => {
                                                    handleFilter(ChallengeDifficulties.HARD);
                                                }}
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
                </header>

                {grid}
            </Container>
        </section>
    );
}


export default Challenges;