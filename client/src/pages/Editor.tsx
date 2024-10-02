import React, { useCallback, useState, useEffect } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import UMLNode from '../components/UMLNode'; // Ensure correct path

// Define custom node types
const nodeTypes = {
    umlNode: UMLNode,
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

export default function App() {
    const initialNodes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NODES) || '[]');
    const initialEdges = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_EDGES) || '[]');

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [showButtons, setShowButtons] = useState<boolean>(true);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    // Save nodes and edges to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_NODES, JSON.stringify(nodes));
    }, [nodes]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_EDGES, JSON.stringify(edges));
    }, [edges]);

    // Toggle button visibility for all nodes
    const toggleButtons = () => {
        setShowButtons((prevShowButtons) => !prevShowButtons);

        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    showButtons: !showButtons,
                },
            }))
        );
    };

    // Add a new UML node to the editor with a random color
    const addNewNode = () => {
        const newNode = {
            id: (nodes.length + 1).toString(), // Unique ID
            position: { x: Math.random() * 500, y: Math.random() * 500 }, // Random position
            data: {
                label: `NewNode${nodes.length + 1}`,
                attributes: ['newAttribute: string'],
                methods: ['newMethod()'],
                showButtons,
                color: getRandomColor(), // Assign a random color
            },
            type: 'umlNode',
        };

        // Add the new node to the state
        setNodes((nds) => [...nds, newNode]);
    };

    // Function to delete a node
    const removeNode = (nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    };

    // Reset the workspace (clear nodes and edges)
    const resetWorkspace = () => {
        const userConfirmed = window.confirm("Are you sure you want to reset the workspace? This action cannot be undone.");
        if (userConfirmed) {
            // Clear nodes and edges
            setNodes([]);
            setEdges([]);
            // Optionally, clear localStorage if you want to start fresh
            localStorage.removeItem(LOCAL_STORAGE_KEY_NODES);
            localStorage.removeItem(LOCAL_STORAGE_KEY_EDGES);
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <button
                onClick={toggleButtons}
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    padding: '10px',
                    fontSize: '14px',
                    backgroundColor: '#ccc',
                    border: '1px solid #999',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 1000,
                }}
            >
                {showButtons ? 'Hide Add Buttons' : 'Show Add Buttons'}
            </button>

            <button
                onClick={addNewNode}
                style={{
                    position: 'fixed',
                    top: '70px',
                    left: '20px',
                    padding: '10px',
                    fontSize: '14px',
                    backgroundColor: '#ccc',
                    border: '1px solid #999',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 1000,
                }}
            >
                Add UML Node
            </button>

            {/* Refresh Button to reset workspace */}
            <button
                onClick={resetWorkspace}
                style={{
                    position: 'fixed',
                    top: '120px',
                    left: '20px',
                    padding: '10px',
                    fontSize: '14px',
                    backgroundColor: '#f44336', // Red color for "reset" to indicate importance
                    color: 'white',
                    border: '1px solid #999',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 1000,
                }}
            >
                Reset Workspace
            </button>

            <ReactFlow
                nodes={nodes.map(node => ({ ...node, data: { ...node.data, removeNode }}))}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}  // Ensure onConnect only adds edges when user connects
                nodeTypes={nodeTypes}  // Register custom node types
            >
                <Controls />
                <MiniMap
                    nodeColor={(node) => node.data.color || '#eee'} // Use the node's color
                    nodeStrokeWidth={3}
                    width={200}
                    height={150}
                />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
