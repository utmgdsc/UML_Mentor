import React from "react";
import { Badge } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";

function FloatingStats({
  totalEasy,
  totalMedium,
  totalHard,
  completedEasy,
  completedMedium,
  completedHard,
}) {
  const totalChallenges = totalEasy + totalMedium + totalHard;
  const completedChallenges = completedEasy + completedMedium + completedHard;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        right: "20px",
        width: "220px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        padding: "15px",
        textAlign: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h5 style={{ margin: 0 }}>Stats</h5>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          <FaTimes />
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "24px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          {completedChallenges} / {totalChallenges}
          <div style={{ fontSize: "14px", color: "gray" }}>
            Overall Completed
          </div>
        </div>

        <div style={{ marginTop: "15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Badge bg="success">Easy</Badge>
            <span>
              {completedEasy} / {totalEasy}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <Badge style={{ backgroundColor: "#DAA520" }}>Medium</Badge>
            <span>
              {completedMedium} / {totalMedium}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <Badge bg="danger">Hard</Badge>
            <span>
              {completedHard} / {totalHard}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloatingStats;
