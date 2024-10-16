import React from 'react';
import { EdgeProps } from '@xyflow/react';

const DashedEdge: React.FC<EdgeProps> = ({ sourceX, sourceY, targetX, targetY }) => {
    const midX = (sourceX + targetX) / 2; // Midpoint in X
    const midY = (sourceY + targetY) / 2; // Midpoint in Y
    const controlX = midX; // Control point X
    const controlY = sourceY > targetY ? midY - 50 : midY + 50; // Control point Y for curve adjustment

    return (
        <g>
            {/* Draw the curved dashed line */}
            <path
                d={`M ${sourceX} ${sourceY} Q ${controlX} ${controlY}, ${targetX} ${targetY}`}
                stroke="#555"
                strokeWidth={2}
                fill="transparent"
                strokeDasharray="5,5" // Creates the dashed effect
            />
            {/* Draw the arrowhead */}
            <polygon
                points={`
                    ${targetX} ${targetY}
                    ${targetX - 10} ${targetY - 5}
                    ${targetX - 10} ${targetY + 5}
                `}
                fill="#555" // Arrow color
            />
        </g>
    );
};

export default DashedEdge;
