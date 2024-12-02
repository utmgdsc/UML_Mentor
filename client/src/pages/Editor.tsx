import React, { useCallback, useEffect, useState, useRef } from "react";
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
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import UMLClassNode from "../components/UMLClassNode";
import UMLInterfaceNode from "../components/UMLInterfaceNode";
import InstructionsPopup from "../components/InstructionsPopup";
import html2canvas from "html2canvas"; // Import html2canvas
import { getBezierPath, getEdgeCenter, MarkerType } from "react-flow-renderer";
import { getSmoothStepPath } from "reactflow";
import CustomMarkers from "./CustomMarkers";
import { umlDiagramInstructions } from "../components/instructionsData";
import domtoimage from "dom-to-image";
import imageCompression from "browser-image-compression";
import { useUMLFormatter } from "../hooks/useUMLFormatter.ts";
import { EditorTour } from "../components/EditorTour";
import { useTour } from "../context/TourContext";

// Keys for local storage
const LOCAL_STORAGE_KEY_NODES = "uml-diagram-nodes";
const LOCAL_STORAGE_KEY_EDGES = "uml-diagram-edges";
const GLOBAL_INSTRUCTIONS_SEEN_KEY = "uml-diagram-instructions-seen-global";

// Define custom node types
const nodeTypes = {
  umlNode: UMLClassNode,
  interfaceUMLNode: UMLInterfaceNode,
};

// Utility function to generate a random pastel color
const getNodeColor = () => {
  const getPastelColorComponent = () => Math.floor(Math.random() * 128) + 127; // Ensures a value between 127 and 255
  const r = getPastelColorComponent();
  const g = getPastelColorComponent();
  const b = getPastelColorComponent();
  return `rgb(${r}, ${g}, ${b})`;
};

// UMLEdge component
const UMLEdge = ({ id, sourceX, sourceY, targetX, targetY, style }) => {
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
      <path id={id} style={style} className="react-flow__edge-path" />
    </>
  );
};

const UMLDiagramEditor = ({ problemId }) => {
  const { analyzeUML, isLoading, error, analysis } = useUMLFormatter({
    problemId,
  });
  //const { analyzeUML, isLoading } = useUMLFormatter({ problemId });
  const [challengeName, setChallengeName] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [runTour, setRunTour] = useState(false);
  const {
    runTour: globalRunTour,
    setRunTour: setGlobalRunTour,
    tourType,
  } = useTour();
  const [localRunTour, setLocalRunTour] = useState(false);

  useEffect(() => {
    if (globalRunTour && tourType === "editor") {
      // Small delay to ensure component is mounted
      setTimeout(() => {
        setLocalRunTour(true);
        setGlobalRunTour(false);
      }, 500);
    }
  }, [globalRunTour, tourType]);

  useEffect(() => {
    // Fetch the challenge details using problemId
    const fetchChallengeDetails = async () => {
      try {
        const response = await fetch(`/api/challenges/${problemId}`);
        const data = await response.json();
        setChallengeName(data.title || "Unnamed Challenge"); // Extract the challenge name
        setChallengeDescription(data.generalDescription || "No Description");
      } catch (error) {
        console.error("Error fetching challenge details:", error);
      }
    };

    fetchChallengeDetails();
  }, [problemId]);
  const LOCAL_STORAGE_KEY_NODES = `uml-diagram-nodes-${problemId}`;
  const LOCAL_STORAGE_KEY_EDGES = `uml-diagram-edges-${problemId}`;

  // Load initial nodes and edges from local storage
  const initialNodes = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_NODES) || "[]"
  );
  const initialEdges = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_EDGES) || "[]"
  );

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
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, data: { edgeType } }, eds));
    },
    [setEdges, edgeType]
  );

  // Save nodes to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_NODES, JSON.stringify(nodes));
  }, [nodes]);

  // Save edges to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_EDGES, JSON.stringify(edges));
  }, [edges]);

  const updateNodeData = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  };

  const addInterfaceUMLNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: `InterfaceNode${nodes.length + 1}`,
        methods: [],
        color: getNodeColor(),
      },
      type: "interfaceUMLNode",
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addNewNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: `NewNode${nodes.length + 1}`,
        attributes: [],
        methods: [],
        color: getNodeColor(),
      },
      type: "umlNode",
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
      "Are you sure you want to reset the workspace? This action cannot be undone."
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
  const generateImage = () => {
    return new Promise((resolve, reject) => {
      const reactFlowElement = document.getElementsByClassName("react-flow")[0];

      domtoimage
        .toBlob(reactFlowElement, { bgcolor: "#ffffff", quality: 1 })
        .then(async (blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob."));
            return;
          }

          try {
            // Compress the image using browser-image-compression
            const options = {
              maxSizeMB: 0.5, // Set the maximum file size (in MB)
              maxWidthOrHeight: 800, // Resize to a max width or height of 800px
              useWebWorker: true,
            };
            const compressedBlob = await imageCompression(blob, options);

            const base64data =
              await imageCompression.getDataUrlFromFile(compressedBlob);
            localStorage.setItem("uml-diagram-image", base64data);
            resolve(true);
          } catch (error) {
            reject(error);
          }
        })
        .catch((error) => reject(error));
    });
  };

  // Submit to PostSolution form directly
  const postSolution = async () => {
    const { nodes, edges } = getNodesAndEdges();
    const defaultTitle = `${challengeName} Solution`;

    // Store the nodes and edges in localStorage (optional)
    localStorage.setItem(LOCAL_STORAGE_KEY_NODES, JSON.stringify(nodes));
    localStorage.setItem(LOCAL_STORAGE_KEY_EDGES, JSON.stringify(edges));

    // Generate the image
    await generateImage();

    // Retrieve the generated image from localStorage
    const imageUrl = localStorage.getItem("uml-diagram-image");
    if (imageUrl) {
      const byteString = atob(imageUrl.split(",")[1]);
      const mimeString = imageUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "uml-diagram.png", { type: mimeString });

      const formData = new FormData();
      formData.append("challengeId", `${problemId}`);
      formData.append("title", defaultTitle);
      formData.append("description", "");
      formData.append("diagram", file);

      fetch(`/api/solutions`, {
        method: "POST",
        body: formData,
      })
        .then((resp) => resp.json())
        .then((data) => {
          localStorage.setItem("challengeId", problemId);
          window.location.href = `/solution/${data.id}`;
          localStorage.removeItem("uml-diagram-image");
        })
        .catch((err) => {
          console.error("Error submitting solution:", err);
        });
    } else {
      console.error("No image found in local storage.");
    }
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
          label:
            draggedNodeType === "umlNode"
              ? `NewNode${nodes.length + 1}`
              : `InterfaceNode${nodes.length + 1}`,
          attributes: draggedNodeType === "umlNode" ? [] : [],
          methods: draggedNodeType === "umlNode" ? [] : [],
          color: getNodeColor(),
        },
        type: draggedNodeType,
      };
      setNodes((nds) => [...nds, newNode]);
      setDraggedNodeType(null);
    }
  };

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const bounds = reactFlowWrapperRef.current.getBoundingClientRect();
        const { clientX, clientY } = event;
        const position = {
          x: clientX - bounds.left,
          y: clientY - bounds.top,
        };
        const newNode = {
          id: (nodes.length + 1).toString(),
          position,
          data: {
            label: `ClassNode${nodes.length + 1}`,
            attributes: [],
            methods: [],
            color: getNodeColor(),
          },
          type: "umlNode",
        };
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [nodes, setNodes]
  );

  useEffect(() => {
    const instructionsSeen =
      localStorage.getItem(GLOBAL_INSTRUCTIONS_SEEN_KEY) === "true";
    if (!instructionsSeen) {
      setShowInstructions(true);
    }
  }, []);

  const handleCloseInstructions = () => {
    localStorage.setItem(GLOBAL_INSTRUCTIONS_SEEN_KEY, "true");
    setShowInstructions(false);
  };

  useEffect(() => {
    if (problemId) {
      localStorage.setItem("lastVisitedChallenge", problemId);
    }
  }, [problemId]);

  return (
    <div
      style={{ width: "100%", height: "100%", position: "relative" }}
      ref={reactFlowWrapperRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "150px",
          top: "10px",
          left: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h4 style={{ margin: "0", textAlign: "center" }}>Actions</h4>
        <div
          className="add-node-buttons"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
            onMouseDown={() => startDraggingNode("interfaceUMLNode")}
            className="action-button"
          >
            Add Interface Node
          </button>
          <button
            onMouseDown={() => startDraggingNode("umlNode")}
            className="action-button"
          >
            Add Class Node
          </button>
        </div>
        <button onClick={resetWorkspace} className="reset-button">
          Reset Workspace
        </button>
        <button onClick={postSolution} className="post-button">
          Post Solution
        </button>
        <button
          onClick={() => setShowInstructions(true)}
          className="instructions-button"
        >
          Show Instructions
        </button>
        <button
          onClick={() => removeEdge(selectedEdge)}
          className="delete-button"
          disabled={!selectedEdge}
        >
          Delete Selected Edge
        </button>
        <label htmlFor="arrowType" style={{ marginTop: "10px" }}>
          Select Arrow Type:
        </label>
        <select
          id="arrowType"
          value={edgeType}
          onChange={(e) => setEdgeType(e.target.value)}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "130px",
          }}
        >
          <option value="Inheritance">Inheritance</option>
          <option value="Composition">Composition</option>
          <option value="Implementation">Implementation</option>
        </select>
      </div>

      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            removeNode,
            updateNodeData,
          },
        }))}
        edges={edges.map((edge) => {
          let markerId = "filledArrow";
          let dashArray = "0";

          switch (edge.data?.edgeType) {
            case "Inheritance":
              markerId = "emptyArrow";
              break;
            case "Composition":
              markerId = "diamond";
              dashArray = "5,5";
              break;
            case "Implementation":
              markerId = "emptyArrow";
              break;
            default:
              markerId = "filledArrow";
          }

          return {
            ...edge,
            type: "step",
            style: {
              stroke: "#000",
              strokeWidth: edge.id === selectedEdge ? 4 : 2,
              strokeDasharray:
                edge.data?.edgeType === "Implementation" ? "5, 5" : "0",
              strokeDashoffset: 100,
            },
            markerStart: markerId,
            markerEnd: undefined,
          };
        })}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={(event, edge) => setSelectedEdge(edge.id)}
        nodeTypes={nodeTypes}
        edgeTypes={{
          Inheritance: UMLEdge,
          Composition: UMLEdge,
          Implementation: UMLEdge,
        }}
        style={{ width: "100%", height: "100%" }}
        onConnectEnd={onConnectEnd}
      >
        <CustomMarkers />
        <MiniMap nodeColor={(node) => node.data.color || "#eee"} />
        <Controls />
        <Background />
      </ReactFlow>
      <InstructionsPopup
        show={showInstructions}
        handleClose={handleCloseInstructions}
        instructions={umlDiagramInstructions}
      />
      {draggedNodeType && (
        <div
          style={{
            position: "absolute",
            left: mousePosition.x,
            top: mousePosition.y,
            opacity: 0.5,
            pointerEvents: "none",
          }}
        >
          {draggedNodeType === "umlNode" ? (
            <UMLClassNode
              data={{
                label: "New Class",
                attributes: ["attribute: type"],
                methods: ["method()"],
                isPreview: true,
              }}
              id="preview"
            />
          ) : (
            <UMLInterfaceNode
              data={{
                label: "New Interface",
                methods: ["method()"],
                isPreview: true,
                showButtons: false,
              }}
              id="preview"
            />
          )}
        </div>
      )}
      <EditorTour runTour={localRunTour} setRunTour={setLocalRunTour} />
    </div>
  );
};

const UMLDiagramEditorFinal = ({ problemId }) => {
  return (
    <ReactFlowProvider>
      <UMLDiagramEditor problemId={problemId} />
    </ReactFlowProvider>
  );
};

export default UMLDiagramEditorFinal;
