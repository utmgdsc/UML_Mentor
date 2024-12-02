import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Challenge from "./Challenge"; // Left side content
import UMLDiagramEditor from "./Editor";

const SplitLayout: React.FC = () => {
  const { id: challengeId } = useParams(); // Get the challenge ID from the URL
  const [leftWidth, setLeftWidth] = useState(50); // Initial left panel width

  const handleDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth =
        leftWidth + ((moveEvent.clientX - startX) / window.innerWidth) * 100;
      setLeftWidth(Math.min(Math.max(newWidth, 20), 80)); // Constrain width between 20% and 80%
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      {/* Left pane - Challenge */}
      <div
        style={{
          width: `${leftWidth}%`,
          borderRight: "1px solid #ddd",
          padding: "10px",
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <Challenge /> {/* Ensure this component works without props */}
        <div
          style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}
        >
          Problem ID: {challengeId}
        </div>
      </div>

      {/* Divider */}
      <div
        onMouseDown={handleDividerMouseDown}
        style={{
          cursor: "ew-resize",
          width: "5px",
          backgroundColor: "#ccc",
          height: "100vh",
          position: "relative",
        }}
      />

      {/* Right pane - UML Diagram Editor (ReactFlow) */}
      <div
        style={{
          flex: 1,
          padding: "10px",
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <UMLDiagramEditor problemId={challengeId} />
      </div>
    </div>
  );
};

export default SplitLayout;
