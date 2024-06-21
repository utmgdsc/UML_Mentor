/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Dropdown,
  Form,
} from "react-bootstrap";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort";
import { ChallengeDifficulties } from "../types/challengeDifficulties";
import { useQuery } from "../hooks/useQuery";
import useCheckRole from "../hooks/useCheckRole";


function Challenges() {
  const [challengesData, setChallengesData] =
    useState<ChallengeDetailsShort[]>();

  const [isLoading, setIsLoading] = useState(true);

  const [sortByDifficulty, setSortByDifficulty] = useState(false);
  const [filter, setFilter] = useState([] as ChallengeDifficulties[]);
  const [hideComplete, setHideComplete] = useState(false);

  const {isAdmin} = useCheckRole();
  const query = useQuery();

  // Fetch challenges from the server
  useEffect(() => {
    setIsLoading(true);

    let url = "/api/challenges";
    if (query.get("hidden") === "true") url = "/api/challenges/hidden";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<ChallengeDetailsShort[]>;
      })
      .then((data) => {
        setChallengesData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.error(
          "Failed fetching the challenges." + "\nError message: " + err.message,
        );
      });
  }, [query]);

  // Sort challengesData by difficulty
  useEffect(() => {
    if (challengesData != undefined) {
      const sortedChallengesData = handleSortByDifficulty(challengesData);
      setChallengesData(sortedChallengesData);
    }
    console.log("Challenges sorted");
  }, [sortByDifficulty]);

  /**
   * Make a grid of ChallengeCards depending on the challengesData
   * @returns a bootstrap grid of ChallengeCards
   */
  const makeGrid = useCallback((): JSX.Element[] => {
    if(challengesData?.length === 0) return [<h2 key="no-challenges" className="text-center">No challenges found</h2>];

    if (isLoading || challengesData === undefined) {
      return [
        <Row key="spinner" className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Row>,
      ];
    }

    const grid: JSX.Element[] = [];
    let row: JSX.Element[] = [];
    let i = 0;
    for (const challenge of challengesData) {
      //make sure the challenge is not filtered out
      if (!filter.includes(challenge.difficulty) && filter.length > 0) {
        // console.log("Filtering out: " + challenge.difficulty);
        // console.log(filter);
        continue;
      }

      if(hideComplete && challenge.completed) {
          // console.log("Filtering out: " + challenge.title);
          continue;
      }

      challenge.isAdmin = isAdmin;

      row.push(
        <Col lg={4} key={i} className="mb-4">
          <ChallengeCard {...challenge} />
        </Col>,
      );
      i++;
      if (i % 3 === 0) {
        grid.push(
          <Row sm={1} lg={3} key={i}>
            {row}
          </Row>,
        );
        row = [];
      }
    }
    if (row.length > 0) {
      grid.push(<Row key={i}>{row}</Row>);
    }
    return grid;
  }, [isLoading, challengesData, filter, hideComplete, isAdmin]);

  function handleSortByDifficulty(prevChallengesData: ChallengeDetailsShort[]) {
    const sortedChallengesData = [...prevChallengesData];
    if (!sortByDifficulty) {
      // Sort challengesData in ascending order by difficulty
      sortedChallengesData.sort((a, b) => a.difficulty - b.difficulty);
    } else {
      // Sort challengesData in descending order by difficulty
      sortedChallengesData.sort((a, b) => b.difficulty - a.difficulty);
    }
    return sortedChallengesData;
  }

  function handleFilter(difficulty: ChallengeDifficulties) {
    if (filter.includes(difficulty)) {
      setFilter(filter.filter((d) => d !== difficulty));
    } else {
      setFilter([...filter, difficulty]);
    }
  }


  if(query.get("hidden") === "true" && !isAdmin) return <h1 className="text-center">You are not authorized to view this page</h1>;
  return (
    <section>
      <Container>
        <header>
          <Row className="my-2">
            <Col>
              <h1 className="fs-2">{query.get("hidden") === "true" ? "Hidden Challenges" : "Challenges"}</h1>
              <h2 className="fs-5">{query.get("hidden") === "true" ? "Challenges not accessbile by regular users" : "Choose a challenge to start solving!"}</h2>
            </Col>
            <Col>
              <Dropdown className="mt-4 float-end ">
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  Sort by Difficulty
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      setSortByDifficulty(!sortByDifficulty);
                    }}
                  >
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
                    />
                    <Form.Check
                      type="checkbox"
                      label="Medium"
                      onClick={() => {
                        handleFilter(ChallengeDifficulties.MEDIUM);
                      }}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Hard"
                      onClick={() => {
                        handleFilter(ChallengeDifficulties.HARD);
                      }}
                    />
                  </Form>
                </Dropdown.Menu>
              </Dropdown>
              <Button
                className={
                  "mt-4 float-end " +
                  (!hideComplete ? "btn-primary" : "btn-danger")
                }
                onClick={() => {
                  setHideComplete(!hideComplete);
                }}
              >
                {!hideComplete ? "Showing Completed" : "Hiding Completed"}
              </Button>
            </Col>
          </Row>
        </header>
        {makeGrid()}
      </Container>
    </section>
  );
}

export default Challenges;
