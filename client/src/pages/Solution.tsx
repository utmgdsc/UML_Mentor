import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SolutionData } from "../types/SolutionData.ts";
import { CommentData } from "../types/CommentData.ts";
import Card from "react-bootstrap/Card";
import Button from "../components/Button.tsx";
import Comment from "../components/Comment.tsx";

type UnprocessedComment = {
  text: string;
  id: number;
  upVotes: number;
  replies: string;
  userId: number;
  solutionId: number;
};

function loadSolution(
  id: string,
  setter: React.Dispatch<React.SetStateAction<SolutionData | undefined>>,
) {
  fetch(`/api/solutions/${id}`)
    .then((resp) => resp.json())
    .then((data: SolutionData) => {
      setter(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

function formatComments(comments: UnprocessedComment[]): CommentData[] {
  const convertedReplies = comments.map((c) => ({
    ...c,
    replies: c.replies
      .split(",")
      .filter((r) => r.length !== 0)
      .map((r) => Number(r)),
  }));

  console.log("Converted Replies", convertedReplies);

  const replyIds = [];

  function replaceReplies(cms: UnprocessedComment[], cm: UnprocessedComment) {
    console.log(`Calling replaceReplies for ${cm.id}`, cms);
    if (cm.replies.length === 0) {
      // Leaf Node
      console.log("LEAF NODE", cm);
      return cm;
    }

    if (typeof cm.replies[0] === "object") {
      // Already replaced, skip
      console.log("Skipping", cm);
      return cm;
    }

    console.log("Before replacing", cm);

    // Replace replies of the current node
    cm.replies = cm.replies.map((r: number) => {
      const out = cms.filter((c) => c.id === r)[0];
      replyIds.push(out.id);
      console.log(`Reply for ${cm.text} found: ${out.id}.`);
      return replaceReplies(cms, out);
    });

    console.log(cm);
    return cm;
  }

  const convertedRepliesCopy = JSON.parse(JSON.stringify(convertedReplies));

  const repliesIntegrated = convertedRepliesCopy.map((c) =>
    replaceReplies(convertedRepliesCopy, c),
  );
  //
  console.log(replyIds);

  const repliesIntegratedPurged = repliesIntegrated.filter(
    (c) => !replyIds.includes(c.id),
  );

  return repliesIntegratedPurged;
}

function loadComments(
  id: string,
  setter: React.Dispatch<React.SetStateAction<CommentData[] | undefined>>,
) {
  fetch(`/api/comments/${id}`)
    .then((resp) => resp.json())
    .then((data: UnprocessedComment[]) => {
      // TODO: reformat comments to fit the new CommentData type

      const formatted = formatComments(data);
      console.log("Formatted", formatted);

      setter(formatted);
    })
    .catch((err) => {
      console.error(err);
    });
}

const Solution = () => {
  const { id } = useParams(); // Id is the solution id
  const [solutionData, setSolutionData] = useState<SolutionData>();
  const [comments, setComments] = useState<CommentData[]>();

  const handleSubmit = (parentId: number, text: string) => {
    let promise = null;
    if (parentId) {
      promise = fetch(`/api/comments/reply/${parentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solutionId: solutionData?.id,
          text,
        }),
      });
    } else {
      promise = fetch(`/api/comments/${solutionData?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solutionId: solutionData?.id,
          text,
        }),
      });
    }

    promise
      .then(() => {
        loadComments(id, setComments);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (id) {
      loadSolution(id, setSolutionData);
      loadComments(id, setComments);
    }
  }, [id]);

  // useEffect(() => {
  //   console.log("solution data", solutionData);
  //   console.log("comments", comments);
  // }, [solutionData, comments]);

  return (
    <Container className={"my-5"} fluid={"sm"}>
      <Row md={12} className={"justify-content-center"}>
        <Col md={6}>
          <h2>Solution</h2>
          {solutionData && (
            <Card>
              <Card.Body>
                <Card.Title>{solutionData.title}</Card.Title>
                <Card.Text>{solutionData.description}</Card.Text>
                {solutionData.diagram && (
                  <Card.Img
                    variant="bottom"
                    src={`/api/solutions/diagrams/${solutionData.diagram}`}
                    alt="Solution Diagram"
                  />
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <Row className={"mt-5 justify-content-center"} md={12}>
        <Col md={6}>
          <h2>Comments</h2>
          <Comment editable={true} onSubmit={handleSubmit} />
          {comments &&
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                editable={false}
                onSubmit={handleSubmit}
              />
            ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Solution;
