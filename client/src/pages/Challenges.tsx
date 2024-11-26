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
  const [selectedChallengeTypes, setSelectedChallengeTypes] = useState<
    string[]
  >([]);

  const { isAdmin } = useCheckRole();
  const query = useQuery();

  // Pattern categories
  const patternCategories = {
    Creational: ["Builder", "Simple Factory"],
    Structural: ["Adapter", "Decorator", "Facade"],
    Behavioral: ["Strategy", "Observer", "Iterator"],
  };
  const [extraPatterns, setExtraPatterns] = useState<string[]>([]); // Extra patterns not in the known categories

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
      .then(async (data) => {
        // Fetch the number of solutions for each challenge
        fetch("/api/solutions/counts")
          .then((response) => {
            if (!response.ok) {
              console.error("Response status:", response.status); // Log the status
              throw new Error("Failed to fetch solution counts");
            }
            return response.json();
          })
          .then((solutionCounts) => {
            const challengesWithSolutionCount = data.map((challenge) => {
              const count =
                solutionCounts.find((sc) => sc.challengeId === challenge.id)
                  ?.solutionCount || 0; // Default to 0 if not found
              return { ...challenge, solutionCount: count };
            });
            setChallengesData(challengesWithSolutionCount);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Failed fetching the challenges.", err.message);
          });

        // Extract challenge types from keyPatterns and categorize them
        const patternTypesSet = new Set<string>();
        const detectedExtraPatterns = new Set<string>();
        data.forEach((challenge) => {
          if (challenge.keyPatterns) {
            challenge.keyPatterns.forEach((patternList) => {
              const words = patternList.split(" ");
              const patternIndex = words.findIndex(
                (word) => word.toLowerCase() === "pattern"
              );
              const patternType =
                patternIndex !== -1
                  ? words.slice(0, patternIndex).join(" ")
                  : patternList;

              if (
                !Object.values(patternCategories).flat().includes(patternType)
              ) {
                detectedExtraPatterns.add(patternType); // Add to extra if not in known categories
              }
              patternTypesSet.add(patternType);
            });
          }
        });
        setExtraPatterns(Array.from(detectedExtraPatterns));
      })
      .catch((err) => {
        console.error(
          "Failed fetching the challenges." + "\nError message: " + err.message
        );
      });
  }, [query]);

  // Sort challengesData by difficulty
  useEffect(() => {
    if (challengesData != undefined) {
      const sortedChallengesData = handleSortByDifficulty(challengesData);
      setChallengesData(sortedChallengesData);
    }
  }, [sortByDifficulty]);

  const makeGrid = useCallback((): JSX.Element[] => {
    if (challengesData?.length === 0)
      return [
        <h2 key="no-challenges" className="text-center">
          No challenges found
        </h2>,
      ];

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
      // Filter out challenges by type if none selected or if not in the selected list
      if (
        selectedChallengeTypes.length > 0 &&
        challenge.keyPatterns &&
        !challenge.keyPatterns.some((pattern) => {
          const words = pattern.split(" ");
          const patternIndex = words.findIndex(
            (word) => word.toLowerCase() === "pattern"
          );
          const patternType =
            patternIndex !== -1
              ? words.slice(0, patternIndex).join(" ")
              : pattern;
          return selectedChallengeTypes.includes(patternType);
        })
      ) {
        continue;
      }

      // Make sure the challenge is not filtered out by difficulty
      if (!filter.includes(challenge.difficulty) && filter.length > 0) {
        continue;
      }

      // Filter out completed challenges if hideComplete is enabled
      if (hideComplete && challenge.completed) {
        continue;
      }

      challenge.isAdmin = isAdmin;

      row.push(
        <Col lg={4} key={i} className="mb-4">
          <ChallengeCard
            title={challenge.title}
            generalDescription={challenge.generalDescription}
            id={challenge.id}
            difficulty={challenge.difficulty}
            completed={challenge.completed}
            isAdmin={isAdmin}
            hidden={challenge.hidden}
            keyPatterns={challenge.keyPatterns}
            solutionCount={
              challenge.solutionCount > 0 ? challenge.solutionCount : null
            }
          />
        </Col>
      );
      i++;
      if (i % 3 === 0) {
        grid.push(
          <Row sm={1} lg={3} key={i}>
            {row}
          </Row>
        );
        row = [];
      }
    }
    if (row.length > 0) {
      grid.push(<Row key={i}>{row}</Row>);
    }
    return grid;
  }, [
    isLoading,
    challengesData,
    filter,
    hideComplete,
    selectedChallengeTypes,
    isAdmin,
  ]);

  function handleSortByDifficulty(prevChallengesData: ChallengeDetailsShort[]) {
    const sortedChallengesData = [...prevChallengesData];
    if (!sortByDifficulty) {
      sortedChallengesData.sort((a, b) => a.difficulty - b.difficulty);
    } else {
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

  // Handle selection of multiple challenge types
  function handleChallengeTypeSelect(type: string) {
    if (selectedChallengeTypes.includes(type)) {
      setSelectedChallengeTypes(
        selectedChallengeTypes.filter((t) => t !== type)
      );
    } else {
      setSelectedChallengeTypes([...selectedChallengeTypes, type]);
    }
  }

  if (query.get("hidden") === "true" && !isAdmin)
    return (
      <h1 className="text-center">You are not authorized to view this page</h1>
    );

  return (
    <section>
      <Container>
        <header>
          <Row className="my-2">
            <Col>
              <h1 className="fs-2">
                {query.get("hidden") === "true"
                  ? "Hidden Challenges"
                  : "Challenges"}
              </h1>
              <h2 className="fs-5">
                {query.get("hidden") === "true"
                  ? "Challenges not accessible by regular users"
                  : "Choose a challenge to start solving!"}
              </h2>
            </Col>
            <Col>
              {/* Flex container to keep all buttons in one row */}
              <div className="d-flex justify-content-end align-items-center flex-wrap">
                {/* Dropdown for sorting by difficulty */}
                <Dropdown className="mx-2 mb-2">
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

                <Dropdown
                  className="mx-2 mb-2"
                  style={{ marginBottom: "1rem" }}
                >
                  {" "}
                  {/* Adds 1rem space below the button */}
                  <Dropdown.Toggle
                    variant="primary"
                    id="dropdown-basic"
                    style={{ borderRadius: "8px" }} // Adds slight curve to the main button
                  >
                    Filter by Challenge Type
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{ padding: "0.5rem", borderRadius: "8px" }}
                  >
                    {" "}
                    {/* Adds slight curve to edges */}
                    {/* Creational Patterns */}
                    <Dropdown drop="end">
                      <Dropdown.Toggle
                        variant="light"
                        className="full-width-toggle"
                        style={{
                          marginBottom: "0.5rem",
                          borderRadius: "8px",
                          width: "100%",
                        }} // Adds curved edges to the selection box
                      >
                        Creational Patterns
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="dropdown-menu-custom"
                        style={{ borderRadius: "8px", marginLeft: "0.5rem" }} // Slight curve and offset to the right
                      >
                        {patternCategories.Creational.map((pattern) => (
                          <Form.Check
                            key={pattern}
                            type="checkbox"
                            label={pattern}
                            checked={selectedChallengeTypes.includes(pattern)}
                            onChange={() => handleChallengeTypeSelect(pattern)}
                            style={{ marginLeft: "0.5rem" }} // Left margin for patterns
                          />
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    {/* Structural Patterns */}
                    <Dropdown drop="end">
                      <Dropdown.Toggle
                        variant="light"
                        className="full-width-toggle"
                        style={{
                          marginBottom: "0.5rem",
                          borderRadius: "8px",
                          width: "100%",
                        }} // Adds curved edges to the selection box
                      >
                        Structural Patterns
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="dropdown-menu-custom"
                        style={{ borderRadius: "8px", marginLeft: "0.5rem" }} // Slight curve and offset to the right
                      >
                        {patternCategories.Structural.map((pattern) => (
                          <Form.Check
                            key={pattern}
                            type="checkbox"
                            label={pattern}
                            checked={selectedChallengeTypes.includes(pattern)}
                            onChange={() => handleChallengeTypeSelect(pattern)}
                            style={{ marginLeft: "0.5rem" }} // Left margin for patterns
                          />
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    {/* Behavioral Patterns */}
                    <Dropdown drop="end">
                      <Dropdown.Toggle
                        variant="light"
                        className="full-width-toggle"
                        style={{
                          marginBottom: "0.5rem",
                          borderRadius: "8px",
                          width: "100%",
                        }} // Adds curved edges to the selection box
                      >
                        Behavioral Patterns
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="dropdown-menu-custom"
                        style={{ borderRadius: "8px", marginLeft: "0.5rem" }} // Slight curve and offset to the right
                      >
                        {patternCategories.Behavioral.map((pattern) => (
                          <Form.Check
                            key={pattern}
                            type="checkbox"
                            label={pattern}
                            checked={selectedChallengeTypes.includes(pattern)}
                            onChange={() => handleChallengeTypeSelect(pattern)}
                            style={{ marginLeft: "0.5rem" }} // Left margin for patterns
                          />
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    {/* Extra Patterns */}
                    <Dropdown drop="end">
                      <Dropdown.Toggle
                        variant="light"
                        className="full-width-toggle"
                        style={{ borderRadius: "8px", width: "100%" }} // Adds curved edges to the selection box
                      >
                        Extra Patterns
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="dropdown-menu-custom"
                        style={{ borderRadius: "8px", marginLeft: "0.5rem" }} // Slight curve and offset to the right
                      >
                        {extraPatterns.map((pattern) => (
                          <Form.Check
                            key={pattern}
                            type="checkbox"
                            label={pattern}
                            checked={selectedChallengeTypes.includes(pattern)}
                            onChange={() => handleChallengeTypeSelect(pattern)}
                            style={{ marginLeft: "0.5rem" }} // Left margin for patterns
                          />
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Dropdown.Menu>
                </Dropdown>

                {/* Dropdown for filtering by difficulty */}
                <Dropdown className="mx-2 mb-2">
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    Filter by Difficulty
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

                {/* Button for hiding/showing completed challenges */}
                <Button
                  className={
                    "mx-2 mb-2 " +
                    (!hideComplete ? "btn-primary" : "btn-danger")
                  }
                  onClick={() => {
                    setHideComplete(!hideComplete);
                  }}
                >
                  {!hideComplete ? "Showing Completed" : "Hiding Completed"}
                </Button>
              </div>
            </Col>
          </Row>
        </header>
        {makeGrid()}
      </Container>
    </section>
  );
}

export default Challenges;
