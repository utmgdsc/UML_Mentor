import React, { useCallback, useEffect, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    removeEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import UMLClassNode from '../components/UMLClassNode';
import UMLInterfaceNode from '../components/UMLInterfaceNode';
import InstructionsPopup from '../components/InstructionsPopup'; // Import the InstructionsPopup
import html2canvas from 'html2canvas'; // Import html2canvas

// Define custom node types
const nodeTypes = {
    umlNode: UMLClassNode,
    interfaceUMLNode: UMLInterfaceNode,
};

// Keys for local storage
const LOCAL_STORAGE_KEY_NODES = 'uml-diagram-nodes';
const LOCAL_STORAGE_KEY_EDGES = 'uml-diagram-edges';

// Utility function to generate a random color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// UMLEdge component
const UMLEdge = ({ sourceX, sourceY, targetX, targetY, type }) => {
    const midX = (sourceX + targetX) / 2; // Midpoint in X
    const midY = (sourceY + targetY) / 2; // Midpoint in Y
    const controlX = midX; // Control point X
    const controlY = sourceY > targetY ? midY - 50 : midY + 50; // Control point Y for curve adjustment

    const isDashed = type.includes('dashed');

    const pathData = `M ${sourceX} ${sourceY} Q ${controlX} ${controlY}, ${targetX} ${targetY}`;

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
            {/* Draw the arrowhead based on type */}
            {type.includes('filled') && (
                <polygon
                    points={`
                        ${targetX} ${targetY}
                        ${targetX - 12} ${targetY - 6}
                        ${targetX - 12} ${targetY + 6}
                    `}
                    fill="#555" // Arrow color
                />
            )}
            {type.includes('empty') && (
                <polygon
                    points={`
                        ${targetX} ${targetY}
                        ${targetX - 12} ${targetY - 6}
                        ${targetX - 12} ${targetY + 6}
                    `}
                    fill="none"
                    stroke="#555"
                    strokeWidth={2}
                />
            )}
            {type.includes('diamond') && (
                <polygon
                    points={`
                        ${targetX} ${targetY}
                        ${targetX - 12} ${targetY}
                        ${targetX - 6} ${targetY - 6}
                        ${targetX - 6} ${targetY + 6}
                    `}
                    fill="#555" // Diamond color
                />
            )}
        </g>
    );
};

const UMLDiagramEditor = () => {
    const initialNodes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NODES) || '[]');
    const initialEdges = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_EDGES) || '[]');

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [showInstructions, setShowInstructions] = useState(false); // State for instructions popup
    const [edgeType, setEdgeType] = useState('filled'); // State for edge type
    const [selectedEdge, setSelectedEdge] = useState(null); // State for the currently selected edge

    const onConnect = useCallback(
        (params) => {
            setEdges((eds) => addEdge({ ...params, type: edgeType }, eds));
        },
        [setEdges, edgeType],
    );

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_NODES, JSON.stringify(nodes));
    }, [nodes]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_EDGES, JSON.stringify(edges));
    }, [edges]);

    const toggleButtons = () => {
        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    showButtons: !node.data.showButtons,
                },
            }))
        );
    };

    const addInterfaceUMLNode = () => {
        const newNode = {
            id: (nodes.length + 1).toString(),
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            data: {
                label: `InterfaceNode${nodes.length + 1}`,
                methods: ['interfaceMethod1()', 'interfaceMethod2()'],
                color: getRandomColor(),
            },
            type: 'interfaceUMLNode',
        };
        setNodes((nds) => [...nds, newNode]);
    };

    const addNewNode = () => {
        const newNode = {
            id: (nodes.length + 1).toString(),
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            data: {
                label: `NewNode${nodes.length + 1}`,
                attributes: ['newAttribute: string'],
                methods: ['newMethod()'],
                showButtons: true,
                color: getRandomColor(),
            },
            type: 'umlNode',
        };
        setNodes((nds) => [...nds, newNode]);
    };

    const removeNode = (nodeId) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    };

    const removeEdge = (edgeId) => {
        setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
        setSelectedEdge(null); // Clear selected edge
    };

    const resetWorkspace = () => {
        const userConfirmed = window.confirm("Are you sure you want to reset the workspace? This action cannot be undone.");
        if (userConfirmed) {
            setNodes([]);
            setEdges([]);
            localStorage.removeItem(LOCAL_STORAGE_KEY_NODES);
            localStorage.removeItem(LOCAL_STORAGE_KEY_EDGES);
        }
    };

    // Function to get nodes and edges data
    const getNodesAndEdges = () => {
        return { nodes, edges };
    };

    // Function to generate and download image
    const generateImage = async () => {
        const reactFlowElement = document.getElementsByClassName('react-flow')[0];

        const canvas = await html2canvas(reactFlowElement, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scale: 2,
        });

        const imageData = canvas.toDataURL('image/png');
        localStorage.setItem('uml-diagram-image', imageData);
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'uml-diagram.png';
        link.click();
    };

    const postSolution = async () => {
        const { nodes, edges } = getNodesAndEdges();
        localStorage.setItem(LOCAL_STORAGE_KEY_NODES, JSON.stringify(nodes));
        localStorage.setItem(LOCAL_STORAGE_KEY_EDGES, JSON.stringify(edges));

        await generateImage();
        const challengeId = "your-challenge-id"; // Replace this with the actual challenge ID
        window.location.href = `/solutions/post/${challengeId}`;
    };

    const anotherShowInstructions = () => {
        setShowInstructions(true);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div style={{
                position: 'absolute', zIndex: 1000, background: 'white',
                padding: '10px', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                width: '150px', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '10px'
            }}>
                <h4 style={{ margin: '0', textAlign: 'center' }}>Actions</h4>
                <button onClick={toggleButtons} className="action-button">Toggle</button>
                <button onClick={addInterfaceUMLNode} className="action-button">Add Interface Node</button>
                <button onClick={addNewNode} className="action-button">Add Class Node</button>
                <button onClick={resetWorkspace} className="reset-button">Reset Workspace</button>
                <button onClick={postSolution} className="post-button">Post Solution</button>
                <button onClick={anotherShowInstructions} className="instructions-button">Show Instructions</button>
                <button onClick={() => removeEdge(selectedEdge)} className="delete-button" disabled={!selectedEdge}>Delete Selected Edge</button>
                <label htmlFor="arrowType" style={{ marginTop: '10px' }}>Select Arrow Type:</label>
                <select
                    id="arrowType"
                    value={edgeType}
                    onChange={(e) => setEdgeType(e.target.value)}
                    style={{
                        padding: '5px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '200px' // Increased width for better visibility
                    }}
                >
                    <option value="filled">Solid Arrow (Filled)</option>
                    <option value="empty">Solid Arrow (Empty)</option>
                    <option value="dashed-filled">Dashed Arrow (Filled)</option>
                    <option value="dashed-empty">Dashed Arrow (Empty)</option>
                    <option value="diamond">Arrow with Diamond</option>
                    <option value="dashed-diamond">Dashed Arrow with Diamond</option>
                </select>
            </div>
            <ReactFlow
                nodes={nodes.map(node => ({ ...node, data: { ...node.data, removeNode } }))}
                edges={edges.map(edge => ({ ...edge, type: edge.type || 'filled' }))}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeClick={(event, edge) => setSelectedEdge(edge.id)} // Set the selected edge on click
                nodeTypes={nodeTypes}
                edgeTypes={{
                    filled: UMLEdge,
                    empty: UMLEdge,
                    'dashed-filled': UMLEdge,
                    'dashed-empty': UMLEdge,
                    diamond: UMLEdge,
                    'dashed-diamond': UMLEdge,
                }}
                style={{ width: '100%', height: '100%' }}
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
            {showInstructions && (
                <InstructionsPopup onClose={() => setShowInstructions(false)} />
            )}
        </div>
    );
};

export default UMLDiagramEditor;
