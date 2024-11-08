import React, { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button as BootstrapButton,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SolutionData } from "../types/SolutionData";
import { CommentData } from "../types/CommentData";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import useCheckRole from "../hooks/useCheckRole";
import dayjs from "dayjs";
import Avatar from "../components/Avatar";
// import { useUMLFormatter } from "../hooks/useUMLFormatter";
import { ReturnFunction } from "../hooks/UMLFormatter";
// import  {judgeComment}  from "../../../server/services/ai/gur";



function loadSolution(id, setter, setForbidden) {
  fetch(`/api/solutions/${id}`)
    .then((resp) => {
      if (!resp.ok) {
        if (resp.status === 403) {
          setForbidden(true);
          throw new Error("Access denied");
        } else {
          throw new Error(`Failed to fetch solution: ${resp.status}`);
        }
      }
      return resp.json();
    })
    .then((data) => setter(data))
    .catch((err) => {
      console.error(err);
    });
}

function loadComments(id, setter) {
  fetch(`/api/comments/${id}`)
    .then((resp) => resp.json())
    .then((data) => setter(data))
    .catch((err) => {
      console.error(err);
    });
}

const Solution = ({}) => {
  const { id } = useParams();
  const [solutionData, setSolutionData] = useState<SolutionData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const { isAdmin, isLoading } = useCheckRole();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiResponses, setAiResponses] = useState("");
  const [showStudentAnswers, setShowStudentAnswers] = useState(true);
  const [showAIAnswers, setShowAIAnswers] = useState(true);
  const [showImage, setShowImage] = useState(true);
  const problemId = localStorage.getItem("challengeId");
  // const { formattedData, getFormattedUMLData, prepareOpenAIPrompt } = useUMLFormatter(problemId);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const LOCAL_STORAGE_KEY_NODES = `uml-diagram-nodes-${problemId}`;
  const LOCAL_STORAGE_KEY_EDGES = `uml-diagram-edges-${problemId}`;
  const {formatForAI, generateStructureSummary} = ReturnFunction();
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(true); // New loading state for AI response



  const [challengeName, setChallengeName] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");

  useEffect(() => {
    // Fetch the challenge details using problemId
    const fetchChallengeDetails = async () => {
      try {
        const response = await fetch(`/api/challenges/${problemId}`);
        const data = await response.json();
        setChallengeName(data.title || "Unnamed Challenge"); // Extract the challenge name
        setChallengeDescription(data.generalDescription || "No Description");
        
      } catch (error) {
        console.error("Error fetching challenge details:", error);
      }
    };

    fetchChallengeDetails();
  }, [problemId]);


  useEffect(() => {
    if (id) {
      loadSolution(id, setSolutionData, setForbidden);
      loadComments(id, setComments);
    }
  }, [id]);

  useEffect(() => {
    fetch("/api/users/whoami")
      .then((response) => response.json())
      .then((data) => {
        setCurrentUserId(data.username);
      })
      .catch((error) => {
        console.error("Error fetching current user ID:", error);
      });
  }, []);

  const nodes = localStorage.getItem(LOCAL_STORAGE_KEY_NODES);
  const edges = localStorage.getItem(LOCAL_STORAGE_KEY_EDGES);

  const umlData = formatForAI(JSON.parse(nodes), JSON.parse(edges) ); // Get UML data if needed


  // useEffect(() => {
  //   async function fetchData() {
  //     await judgeComment(umlData);
  //   }
    
  //   fetchData();
  // },[umlData]);


  useEffect(() => {
    async function fetchData() {
      await handleAiSubmit();
    }
    
    if (challengeName && challengeDescription) {
      fetchData();
    }
  }, [challengeName, challengeDescription]);
  
  

  async function handleAiSubmit() {
  
    setAiMessage(""); // Clear input after submit
    setIsLoadingAIResponse(true); // Set loading state to true before making the request
    setAiResponses(""); // Clear any previous response

        try {
      const response = await fetch('/api/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  umlData, challengeName, challengeDescription }),
      });
  
      if (!response.ok) {
        console.error("OpenAI API error:", response.statusText);
      }

      const data = await response.json();



      setAiResponses(data.reply);
  
    } catch (error) {
      console.error("Error getting AI response:", error);
      // setAiResponses((prevResponses) => [
      //   ...prevResponses,
      //   { text: "Error: Unable to get a response.", fromAI: true },
      // ]);
      setAiResponses("Error");
    }
    finally {
      setIsLoadingAIResponse(false); // Set loading state to false after response or error
    }

  //  setAiResponses(data.reply);
  

    // try {
    //   const response = await fetch('/api/openai-chat', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({  umlData, challengeName, challengeDescription }),
    //   });
  
    //   if (!response.ok) {
    //     console.error("OpenAI API error:", response.statusText);
    //   }

    //   const data = await response.json();



    //   setAiResponses(data.reply);
  
    // } catch (error) {
    //   console.error("Error getting AI response:", error);
    //   // setAiResponses((prevResponses) => [
    //   //   ...prevResponses,
    //   //   { text: "Error: Unable to get a response.", fromAI: true },
    //   // ]);
    //   setAiResponses("Error");
    // }
    // finally {
    //   setIsLoadingAIResponse(false); // Set loading state to false after response or error
    // }
    // setIsLoadingAIResponse(false); // Set loading state to false after response or error
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (forbidden) {
    return <div>Access denied</div>;
  }

  const handleSubmitComment = (parentId, text) => {
    const endpoint = parentId
      ? `/api/comments/reply/${parentId}`
      : `/api/comments/`;
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solutionId: solutionData.id, text }),
    })
      .then(() => {
        loadComments(id, setComments);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDelete = (commentId: string) => {
    if (!isAdmin) return;
    fetch( `/api/comments/${commentId}`, { method: "DELETE" })
      .then(() => {
        setComments((comments) =>
          comments.filter((comment) => comment.id !== commentId)
        );
      })
      .catch((err) => {
        console.error("Failed to delete comment", err);
      });
  };

  const handleDeleteSolution = () => {
    if (!isAdmin && solutionData?.userId !== currentUserId) return;
    fetch(`/api/solutions/${id}`, { method: "DELETE" })
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Failed to delete solution", err);
      });
  };

  const toggleImage = () => {
    setShowImage(!showImage);
  };

  // useEffect(() => {
  //   // Automatically trigger handleAiSubmit on load
  //   handleAiSubmit();
  // }, []);

  return (
    <Container className="my-5" fluid="sm">
      <Row className="justify-content-center">
        <Col md={8}>
          {solutionData && (
            <Card style={{ maxWidth: "600px", margin: "0 auto" }}>
              <Card.Header>
                <div className="d-flex align-items-center">
                  <Avatar username={solutionData.userId} size={40} />
                  <div className="ms-3">
                    <strong>{solutionData.userId}</strong>
                    <div className="text-muted">
                      Score: {solutionData.User?.score || 0}
                    </div>
                  </div>
                  <small className="ms-auto">
                    {dayjs(solutionData.createdAt).format("MMMM D, YYYY")}
                  </small>
                </div>
              </Card.Header>
              <Card.Body style={{ padding: "1rem" }}>
                <Card.Title style={{ fontSize: "1.25rem" }}>{solutionData.title}</Card.Title>
                <Card.Text style={{ fontSize: "1rem" }}>{solutionData.description}</Card.Text>

                {solutionData.diagram && (
                  <>
                    <BootstrapButton
                      variant="outline-primary"
                      onClick={toggleImage}
                      className="mb-3"
                    >
                      {showImage ? "Hide Image" : "Show Image"}
                    </BootstrapButton>
                    {showImage && (
                      <Card.Img
                        variant="bottom"
                        src={`/api/solutions/diagrams/${solutionData.diagram}`}
                        alt="Solution Diagram"
                        style={{ maxWidth: "100%", height: "auto", marginTop: "0.5rem" }}
                      />
                    )}
                  </>
                )}
              </Card.Body>
              {(isAdmin || solutionData.userId === currentUserId) && (
                <Card.Footer style={{ textAlign: "right", padding: "0.75rem" }}>
                  <BootstrapButton variant="danger" onClick={ handleDeleteSolution}>
                    Delete Solution
                  </BootstrapButton>
                </Card.Footer>
              )}
            </Card>
          )}
        </Col>
      </Row>
      <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
          Problem ID: {problemId}
        </div>

      {/* Toggle Buttons for Student's and AI Answers */}
      <Row className="mt-3 justify-content-center">
        <Col md={8}>
          <div className="d-flex justify-content-between mt-3">
            <BootstrapButton
              variant={showStudentAnswers ? "primary" : "secondary"}
              onClick={() => setShowStudentAnswers(!showStudentAnswers)}
            >
              {showStudentAnswers ? "Hide Student's Answers" : "Show Student's Answers"}
            </BootstrapButton>
            <BootstrapButton
              variant={showAIAnswers ? "primary" : "secondary"}
              onClick={() => setShowAIAnswers(!showAIAnswers)}
            >
              {showAIAnswers ? "Hide AI's Answers" : "Show AI's Answers"}
            </BootstrapButton>
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        {showStudentAnswers && showAIAnswers ? (
          <>
            <Col md={6} style={{ maxHeight: "400px", overflowY: "auto" }}>
              <h2>Student's Answers</h2>
              {showStudentAnswers && (
                <div style={{ padding: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
                  {Array.isArray(comments) &&
                    comments.map((comment) => (
                      <div key={comment.id}>
                        <Comment
                          comment={comment}
                          editable={false}
                          onSubmit={handleSubmitComment}
                          depth={0}
                        />
                      </div>
                    ))}
                  <CommentForm
                    onSubmit={(parentId, text) => {
                      handleSubmitComment(parentId, text);
                    }}
                  />
                </div>
              )}
            </Col>
            <Col md={6} style={{ maxHeight: "400px", overflowY: "auto" }}>
              <h2>AI's Answers</h2>
              {showAIAnswers && (
                <div style={{ padding: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
                {isLoadingAIResponse ? (
                  <div>Loading AI answers...</div>
                ) : (
                  <ReactMarkdown>{aiResponses}</ReactMarkdown>
                )}
              </div>
              )}
            </Col>
          </>
        ) : showStudentAnswers ? (
          <Col md={12} style={{ maxHeight: "400px", overflowY: "auto" }}>
            <h2>Student's Answers</h2>
            <div style={{ padding: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
              {Array.isArray(comments) &&
                comments.map((comment) => (
                  <div key={comment.id}>
                    <Comment
                      comment={comment}
                      editable={false}
                      onSubmit={handleSubmitComment}
                      depth={0}
                    />
                  </div>
                ))}
              <CommentForm
                onSubmit={(parentId, text) => {
                  handleSubmitComment(parentId, text);
                }}
              />
            </div>
          </Col>
        ) : (
          <Col md={12} style={{ maxHeight: "400px", overflowY: "auto" }}>
            <h2>AI's Answers</h2>
            <div style={{ padding: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
                  {isLoadingAIResponse ? (
                    <div>Loading AI answers...</div>
                  ) : (
                    <ReactMarkdown>{aiResponses}</ReactMarkdown>
                  )}
                </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Solution;
