import { useState, useCallback } from "react";

// Function to get nodes and edges from local storage
const getNodesAndEdgesFromStorage = (problemId: string) => {
  const LOCAL_STORAGE_KEY_NODES = `uml-diagram-nodes-${problemId}`;
  const LOCAL_STORAGE_KEY_EDGES = `uml-diagram-edges-${problemId}`;

  const nodesJson = localStorage.getItem(LOCAL_STORAGE_KEY_NODES);
  const edgesJson = localStorage.getItem(LOCAL_STORAGE_KEY_EDGES);

  const nodes = nodesJson ? JSON.parse(nodesJson) : [];
  const edges = edgesJson ? JSON.parse(edgesJson) : [];

  return { nodes, edges };
};

// Function to format nodes and edges for OpenAI communication
const formatUMLDataForOpenAI = (nodes: any[], edges: any[]) => {
  const formattedNodes = nodes.map((node) => ({
    id: node.id,
    type: node.type,
    label: node.data.label,
    attributes: node.data.attributes,
    methods: node.data.methods,
  }));

  const formattedEdges = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.data?.edgeType,
  }));

  return {
    nodes: formattedNodes,
    edges: formattedEdges,
  };
};

export const useUMLFormatter = (problemId: string) => {
  const [formattedData, setFormattedData] = useState<string | null>(null);

  const getFormattedUMLData = useCallback(() => {
    const { nodes, edges } = getNodesAndEdgesFromStorage(problemId);
    const formatted = formatUMLDataForOpenAI(nodes, edges);
    const jsonString = JSON.stringify(formatted, null, 2);
    setFormattedData(jsonString);
    return jsonString;
  }, [problemId]);

  const prepareOpenAIPrompt = useCallback(
    (userPrompt: string) => {
      const umlData = getFormattedUMLData();
      return `
User Prompt: ${userPrompt}

UML Diagram Data:
${umlData}

Please analyze the UML diagram data and respond to the user's prompt.
`;
    },
    [getFormattedUMLData]
  );

  return {
    formattedData,
    getFormattedUMLData,
    prepareOpenAIPrompt,
  };
};
