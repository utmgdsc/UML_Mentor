import React from "react";
import { getBezierPath } from "react-flow-renderer";

const SimpleArrow = ({ sourceX, sourceY, targetX, targetY, style }) => {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  return (
    <path
      d={path}
      style={style} // Simple line
      fill="none"
    />
  );
};

export default SimpleArrow;
