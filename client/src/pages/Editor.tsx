import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  removeEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import UMLClassNode from '../components/UMLClassNode';
import UMLInterfaceNode from '../components/UMLInterfaceNode';
import InstructionsPopup from '../components/InstructionsPopup'; // Import the InstructionsPopup
import html2canvas from 'html2canvas'; // Import html2canvas
import { getBezierPath, getEdgeCenter, MarkerType } from 'react-flow-renderer';
import {  getSmoothStepPath } from 'reactflow';
import CustomMarkers from './CustomMarkers';

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
const UMLEdge = ({ id, sourceX, sourceY, targetX, targetY, style }) => {
  // Get the center of the edge for future use (optional)
  // const [edgeCenterX, edgeCenterY] = getEdgeCenter({
  //     sourceX, 
  //     sourceY, 
  //     targetX, 
  //     targetY
  // });


  // // Generate a smooth step path with custom settings
  // const path = getSmoothStepPath({
  //     sourceX,
  //     sourceY,
  //     targetX,
  //     targetY,
  //     sourcePosition: 'right', // Adjust positions if needed
  //     targetPosition: 'left',
  //     borderRadius: 10, // Controls the curve at corner points
  //     offset: 5, // Spacing between segments
  // });


  // const onNodesChange = useCallback(
  //   (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  //   [],
  // );
  // const onEdgesChange = useCallback(
  //   (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  //   [],
  // );




  return (
    <>
        <defs>
            <marker
                id={`${id}-arrow`}
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="2.5"
                orient="auto"
            >
                <polygon points="0 0, 10 2.5, 0 5" fill="black" />
            </marker>
        </defs>
        <path
            id={id}
            style={style}
            d={path}
            className="react-flow__edge-path"

        />
    </>
);


};


  
const UMLDiagramEditor = () => {
  const initialNodes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NODES) || '[]');
  const initialEdges = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_EDGES) || '[]');
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [showInstructions, setShowInstructions] = useState(false);
  const [edgeType, setEdgeType] = useState("Inheritance");
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [draggedNodeType, setDraggedNodeType] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const reactFlowWrapperRef = useRef(null);


  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  // const onNodesChange = useCallback(
  //   (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  //   [],
  // );
  // const onEdgesChange = useCallback(
  //   (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  //   [],
  // );




  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, data : {edgeType} }, eds));
    },
    [setEdges, edgeType]
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_NODES, JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_EDGES, JSON.stringify(edges));
  }, [edges]);

  const addInterfaceUMLNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: `InterfaceNode${nodes.length + 1}`,
        methods: [], // Ensure no default methods
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
        attributes: [], // Ensure no default attributes
        methods: [], // Ensure no default methods
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
    const userConfirmed = window.confirm(
      'Are you sure you want to reset the workspace? This action cannot be undone.'
    );
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
    const challengeId = 'your-challenge-id'; // Replace this with the actual challenge ID
    window.location.href = `/solutions/post/${challengeId}`;
  };

  function anotherShowInstructions() {
    setShowInstructions(true);
  };

  const startDraggingNode = (nodeType) => {
    setDraggedNodeType(nodeType);
  };

  const handleMouseMove = (event) => {
    if (draggedNodeType) {
      const bounds = reactFlowWrapperRef.current.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
    }
  };

  const handleMouseUp = (event) => {
    if (draggedNodeType) {
      const bounds = reactFlowWrapperRef.current.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
      const newNode = {
        id: (nodes.length + 1).toString(),
        position,
        data: {
          label: draggedNodeType === 'umlNode' ? `NewNode${nodes.length + 1}` : `InterfaceNode${nodes.length + 1}`,
          attributes: draggedNodeType === 'umlNode' ? [] : [],
          methods: draggedNodeType === 'umlNode' ? [] : [],
          color: getRandomColor(),
        },
        type: draggedNodeType,
      };
      setNodes((nds) => [...nds, newNode]);
      setDraggedNodeType(null);
    }
  };


  const onConnectEnd = useCallback(
    (event, connectionState) => {
      console.log('onConnectEnd triggered', connectionState);
      if (!connectionState.isValid) {
        const bounds = reactFlowWrapperRef.current.getBoundingClientRect();
        console.log('Bounds:', bounds);
        const { clientX, clientY } = event;
        console.log('Mouse position:', clientX, clientY);
        const position = {
          x: clientX - bounds.left,
          y: clientY - bounds.top,
        };
        console.log('Calculated position:', position);
        const newNode = {
          id: (nodes.length + 1).toString(),
          position,
          data: {
            label: `ClassNode${nodes.length + 1}`,
            attributes: [],
            methods: [],
            color: getRandomColor(),
          },
          type: 'umlNode', // Change to 'umlNode' for class node
        };
        console.log('New node:', newNode);
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [nodes, setNodes]
  );

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      ref={reactFlowWrapperRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        style={{
          position: 'absolute',
          zIndex: 1000,
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '150px',
          top: '10px',
          left: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <h4 style={{ margin: '0', textAlign: 'center' }}>Actions</h4>
        <button onMouseDown={() => startDraggingNode('interfaceUMLNode')} className="action-button">
          Add Interface Node
        </button>
        <button onMouseDown={() => startDraggingNode('umlNode')} className="action-button">
          Add Class Node
        </button>
        <button onClick={resetWorkspace} className="reset-button">
          Reset Workspace
        </button>
        <button onClick={postSolution} className="post-button">
          Post Solution
        </button>
        <button onClick={anotherShowInstructions} className="instructions-button">
          Show Instructions
        </button>
        <button onClick={() => removeEdge(selectedEdge)} className="delete-button" disabled={!selectedEdge}>
          Delete Selected Edge
        </button>
        <label htmlFor="arrowType" style={{ marginTop: '10px' }}>
          Select Arrow Type:
        </label>
        <select
          id="arrowType"
          value={edgeType}
          onChange={(e) => setEdgeType(e.target.value)}
          style={{
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '130px',
          }}
        >
          <option value="Inheritance">Inheritance</option>
          <option value="Composition">Composition</option>
          <option value="Implementation">Implementation</option>
        </select>
      </div>














<ReactFlow

        nodes={nodes.map((node) => ({ ...node, data: { ...node.data, removeNode } }))}
        // edges={edges.map((edge) => ({
        //   ...edge,
        //   type: 'step', // Always set the edge type to 'step'
        //   style: {
        //     stroke: '#000',
        //     strokeWidth: 2,
        //     strokeDasharray: edge.data?.edgeType === 'Composition' ? '5, 5' : '0',
        //   },
        //   markerEnd: {
        //     // type: edge.data?.edgeType  == "Inheritance" ? MarkerType.Arrow : MarkerType.ArrowClosed,
        //     id : edge.data?.edgeType  == "Composition" ? 'url('emptyArrow')' : 'diamond',
        //   },
        // }))}     
        
        edges = {edges.map((edge) => {
          let markerId = 'filledArrow'; // Default marker
          let dashArray = '0'; // Default to solid line
      
          switch (edge.data?.edgeType) {
            case 'Inheritance':
              markerId = 'filledArrow'; // Solid filled arrow
              break;
            case 'Composition':
              markerId = 'emptyArrow'; // Dashed with empty arrow
              dashArray = '5,5';
              break;
            case 'Implementation':
              markerId = 'diamond'; // Solid with diamond
              break;
            default:
              markerId = 'filledArrow'; // Default fallback
          }
      
          return {
            ...edge,
            type: 'step', // Keep step type
          style: {
            stroke: '#000',
            strokeWidth: 2,
            strokeDasharray: edge.data?.edgeType === 'Composition' ? '5, 5' : '0',
          },
            markerEnd:  markerId, // Use markerId here
          };
        })}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={(event, edge) => setSelectedEdge(edge.id)}
        nodeTypes={nodeTypes}
        edgeTypes={{
          'Inheritance': UMLEdge,
          'Composition': UMLEdge,
          'Implementation': UMLEdge,
        }}
        style={{ width: '100%', height: '100%' }}
        onConnectEnd={onConnectEnd}
      >
        <CustomMarkers/>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <InstructionsPopup show={showInstructions} handleClose={() => { setShowInstructions(false) }} />
      {draggedNodeType && (
        <div
          style={{
            position: 'absolute',
            left: mousePosition.x,
            top: mousePosition.y,
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        >
          {draggedNodeType === 'umlNode' ? (
            <UMLClassNode
              data={{
                label: 'New Class',
                attributes: ['attribute: type'],
                methods: ['method()'],
                isPreview: true,
              }}
              id="preview"
            />
          ) : (
            <UMLInterfaceNode
              data={{
                label: 'New Interface',
                methods: ['method()'],
                isPreview: true,
                showButtons: false,
              }}
              id="preview"
            />
          )}
        </div>
      )}
    </div>
  );
};


export default UMLDiagramEditor;
