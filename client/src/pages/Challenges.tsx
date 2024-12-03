import { useCallback, useEffect, useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import FloatingStats from "../components/FloatingStats";
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
import { FiBarChart2 } from "react-icons/fi";
import { IoFilterSharp } from "react-icons/io5";

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
  const [showStats, setShowStats] = useState(false); // State to control the visibility of FloatingStats

  const { isAdmin } = useCheckRole();
  const query = useQuery();
  // truncate description to three line
  function truncateDescription(description, maxLength = 140) {
    // maxLength is an approximation of 3 lines based on font size and layout
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  }
  // Pattern categories
  const patternCategories = {
    Creational: ["Builder", "Simple Factory"],
    Structural: ["Adapter", "Decorator", "Facade"],
    Behavioral: ["Strategy", "Observer", "Iterator"],
  };
  const [extraPatterns, setExtraPatterns] = useState<string[]>([]);

  // Counters for each difficulty level
  const [difficultyCounts, setDifficultyCounts] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  const [completedCounts, setCompletedCounts] = useState({
    completedEasy: 0,
    completedMedium: 0,
    completedHard: 0,
  });
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

        // Calculate counts for each difficulty level
        const easyCount = data.filter(
          (challenge) => challenge.difficulty === 0
        ).length;
        const mediumCount = data.filter(
          (challenge) => challenge.difficulty === 1
        ).length;
        const hardCount = data.filter(
          (challenge) => challenge.difficulty === 2
        ).length;
        setDifficultyCounts({
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount,
        });
        // Calculate completed challenges
        const completedEasy = data.filter(
          (challenge) => challenge.completed && challenge.difficulty === 0
        ).length;
        const completedMedium = data.filter(
          (challenge) => challenge.completed && challenge.difficulty === 1
        ).length;
        const completedHard = data.filter(
          (challenge) => challenge.completed && challenge.difficulty === 2
        ).length;

        setCompletedCounts({
          completedEasy,
          completedMedium,
          completedHard,
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

      if (!filter.includes(challenge.difficulty) && filter.length > 0) {
        continue;
      }

      if (hideComplete && challenge.completed) {
        continue;
      }

      challenge.isAdmin = isAdmin;

      row.push(
        <Col lg={4} key={i} className="mb-4">
          <ChallengeCard
            title={challenge.title}
            generalDescription={truncateDescription(
              challenge.generalDescription
            )}
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
          {/* Sorting and filtering controls (unchanged) */}
          <Row className="my-4">
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
              <div className="d-flex justify-content-end align-items-center flex-wrap">
                <Dropdown
                  className="mx-2 mb-2"
                  // style={{ boxShadow: "inset 0 1px 0 hsl(224, 84%, 74%)" }}
                >
                  <Dropdown.Toggle
                    variant="primary"
                    id="dropdown-combined"
                    style={{
                      textAlign: "left", // Align toggle text to the left
                      width: "100%", // Ensure full-width toggle
                    }}
                  >
                    Sort and Filter <IoFilterSharp />
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{
                      padding: "1rem",
                      borderRadius: "8px",
                      width: "250px",
                    }}
                  >
                    {/* Sort by Difficulty */}
                    <div className="mb-3">
                      <strong>Sort by Difficulty</strong>
                      <Dropdown.Item
                        onClick={() => {
                          setSortByDifficulty(!sortByDifficulty);
                        }}
                        style={{ textAlign: "left" }}
                      >
                        {sortByDifficulty ? "Easier First" : "Harder First"}
                      </Dropdown.Item>
                    </div>

                    <hr />

                    {/* Filter by Challenge Type */}
                    <div className="mb-3">
                      <strong>Filter by Challenge Type</strong>
                      {/* Creational Patterns */}
                      <Dropdown drop="end">
                        <Dropdown.Toggle
                          variant="light"
                          className="full-width-toggle"
                          style={{ width: "100%", textAlign: "left" }}
                        >
                          Creational Patterns
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          style={{ borderRadius: "8px", textAlign: "left" }}
                        >
                          {patternCategories.Creational.map((pattern) => (
                            <Form.Check
                              key={pattern}
                              type="checkbox"
                              label={pattern}
                              checked={selectedChallengeTypes.includes(pattern)}
                              onChange={() =>
                                handleChallengeTypeSelect(pattern)
                              }
                              style={{
                                marginLeft: "10px",
                                marginRight: "10px",
                                borderRadius: "4px",
                              }}
                            >
                              <Form.Check.Input
                                type="checkbox"
                                style={{
                                  border: "2px solid #000", // Makes the checkbox border visible
                                  width: "16px",
                                  height: "16px",
                                  marginRight: "8px",
                                }}
                              />
                              <Form.Check.Label>{pattern}</Form.Check.Label>
                            </Form.Check>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>

                      {/* Structural Patterns */}
                      <Dropdown drop="end">
                        <Dropdown.Toggle
                          variant="light"
                          className="full-width-toggle"
                          style={{ width: "100%", textAlign: "left" }}
                        >
                          Structural Patterns
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          style={{ borderRadius: "8px", textAlign: "left" }}
                        >
                          {patternCategories.Structural.map((pattern) => (
                            <Form.Check
                              key={pattern}
                              type="checkbox"
                              label={pattern}
                              checked={selectedChallengeTypes.includes(pattern)}
                              onChange={() =>
                                handleChallengeTypeSelect(pattern)
                              }
                              style={{
                                marginLeft: "10px",
                                marginRight: "10px",
                                textAlign: "left",
                              }}
                            >
                              <Form.Check.Input
                                type="checkbox"
                                style={{
                                  border: "2px solid #000", // Makes the checkbox border visible
                                  width: "16px",
                                  height: "16px",
                                  marginRight: "8px",
                                }}
                              />
                              <Form.Check.Label>{pattern}</Form.Check.Label>
                            </Form.Check>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>

                      {/* Behavioral Patterns */}
                      <Dropdown drop="end">
                        <Dropdown.Toggle
                          variant="light"
                          className="full-width-toggle"
                          style={{ width: "100%", textAlign: "left" }}
                        >
                          Behavioral Patterns
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ borderRadius: "8px" }}>
                          {patternCategories.Behavioral.map((pattern) => (
                            <Form.Check
                              key={pattern}
                              type="checkbox"
                              label={pattern}
                              checked={selectedChallengeTypes.includes(pattern)}
                              onChange={() =>
                                handleChallengeTypeSelect(pattern)
                              }
                              style={{
                                marginLeft: "10px",
                                marginRight: "10px",
                              }}
                            >
                              <Form.Check.Input
                                type="checkbox"
                                style={{
                                  border: "2px solid #000", // Makes the checkbox border visible
                                  width: "16px",
                                  height: "16px",
                                  marginRight: "8px",
                                }}
                              />
                              <Form.Check.Label>{pattern}</Form.Check.Label>
                            </Form.Check>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>

                      {/* Extra Patterns */}
                      <Dropdown drop="end">
                        <Dropdown.Toggle
                          variant="light"
                          className="full-width-toggle"
                          style={{ width: "100%", textAlign: "left" }}
                        >
                          Extra Patterns
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ borderRadius: "8px" }}>
                          {extraPatterns.map((pattern) => (
                            <Form.Check
                              key={pattern}
                              type="checkbox"
                              label={pattern}
                              checked={selectedChallengeTypes.includes(pattern)}
                              onChange={() =>
                                handleChallengeTypeSelect(pattern)
                              }
                              style={{
                                marginLeft: "10px",
                                marginRight: "10px",
                              }}
                            >
                              <Form.Check.Input
                                type="checkbox"
                                style={{
                                  border: "2px solid #000", // Makes the checkbox border visible
                                  width: "16px",
                                  height: "16px",
                                  marginRight: "8px",
                                }}
                              />
                              <Form.Check.Label>{pattern}</Form.Check.Label>
                            </Form.Check>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    <hr />

                    {/* Filter by Difficulty */}
                    <div>
                      <strong>Filter by Difficulty</strong>
                      <Form.Check
                        type="checkbox"
                        label="Easy"
                        onClick={() => handleFilter(ChallengeDifficulties.EASY)}
                      >
                        <Form.Check.Input
                          type="checkbox"
                          style={{
                            border: "2px solid #000", // Makes the checkbox border visible
                            width: "16px",
                            height: "16px",
                            marginRight: "8px", // Adds spacing between the checkbox and label
                          }}
                        />
                        <Form.Check.Label>Easy</Form.Check.Label>
                      </Form.Check>
                      <Form.Check
                        type="checkbox"
                        label="Medium"
                        onClick={() =>
                          handleFilter(ChallengeDifficulties.MEDIUM)
                        }
                      >
                        <Form.Check.Input
                          type="checkbox"
                          style={{
                            border: "2px solid #000", // Makes the checkbox border visible
                            width: "16px",
                            height: "16px",
                            marginRight: "8px", // Adds spacing between the checkbox and label
                          }}
                        />
                        <Form.Check.Label>Medium</Form.Check.Label>
                      </Form.Check>
                      <Form.Check
                        type="checkbox"
                        label="Hard"
                        onClick={() => handleFilter(ChallengeDifficulties.HARD)}
                      >
                        <Form.Check.Input
                          type="checkbox"
                          style={{
                            border: "2px solid #000", // Makes the checkbox border visible
                            width: "16px",
                            height: "16px",
                            marginRight: "8px", // Adds spacing between the checkbox and label
                          }}
                        />
                        <Form.Check.Label>Hard</Form.Check.Label>
                      </Form.Check>
                    </div>
                    <hr />
                    <div className="mb-3">
                      <strong>Show Completed</strong>
                      <Form.Switch
                        id="toggle-hide-completed"
                        label={
                          !hideComplete
                            ? "Showing Completed"
                            : "Hiding Completed"
                        }
                        checked={hideComplete}
                        onChange={() => setHideComplete(!hideComplete)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      />
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </header>
        {makeGrid()}
      </Container>

      {/* Floating Stats Toggle Button */}
      <Button
        variant="primary"
        onClick={() => setShowStats(!showStats)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          padding: "15px",
          zIndex: 1001,
        }}
      >
        <FiBarChart2 size={24} />
      </Button>

      {/* Floating Stats Widget */}
      {showStats && (
        <FloatingStats
          totalEasy={difficultyCounts.easy}
          totalMedium={difficultyCounts.medium}
          totalHard={difficultyCounts.hard}
          completedEasy={completedCounts.completedEasy}
          completedMedium={completedCounts.completedMedium}
          completedHard={completedCounts.completedHard}
        />
      )}
    </section>
  );
}

export default Challenges;
