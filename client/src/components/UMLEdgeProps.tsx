import React from 'react';
import { EdgeProps } from '@xyflow/react';

interface UMLEdgeProps extends EdgeProps {
    type: 'curved-dashed' | 'curved-solid' | 'straight-dashed' | 'straight-solid';
}

const UMLEdge: React.FC<UMLEdgeProps> = ({ sourceX, sourceY, targetX, targetY, type }) => {
    const midX = (sourceX + targetX) / 2; // Midpoint in X
    const midY = (sourceY + targetY) / 2; // Midpoint in Y
    const controlX = midX; // Control point X
    const controlY = sourceY > targetY ? midY - 50 : midY + 50; // Control point Y for curve adjustment

    const isCurved = type.startsWith('curved');
    const isDashed = type.endsWith('dashed');

    const pathData = isCurved
        ? `M ${sourceX} ${sourceY} Q ${controlX} ${controlY}, ${targetX} ${targetY}`
        : `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;

    return (
        <g>
            {/* Draw the edge */}
            <path
                d={pathData}
                stroke="#555"
                strokeWidth={2}
                fill="transparent"
                strokeDasharray={isDashed ? '5,5' : '0'} // Dashed effect if needed
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

export default UMLEdge;
