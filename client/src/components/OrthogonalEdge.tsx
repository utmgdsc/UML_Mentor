const OrthogonalEdge = ({ id, sourceX, sourceY, targetX, targetY, markerEnd }) => {
  const path = `M ${sourceX} ${sourceY} L ${sourceX} ${targetY} L ${targetX} ${targetY}`;
  
  return (
    <g>
      <path
        id={id}
        d={path}
        style={{ stroke: '#555', strokeWidth: 2, fill: 'transparent' }}
      />
      <marker id={markerEnd} markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
        <polygon points="0 0, 10 5, 0 10" fill="#555" />
      </marker>
      <path
        d={path}
        style={{ stroke: '#555', strokeWidth: 2, fill: 'transparent', markerEnd: `url(#${markerEnd})` }}
      />
    </g>
  );
};
