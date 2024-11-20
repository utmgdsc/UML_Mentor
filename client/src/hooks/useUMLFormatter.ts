// client/hooks/useUMLFormatter.ts
import { useState, useCallback } from 'react';

interface UMLHookProps {
  problemId: string;
}

export const useUMLFormatter = ({ problemId }: UMLHookProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const getNodesAndEdgesFromStorage = useCallback(() => {
    const LOCAL_STORAGE_KEY_NODES = `uml-diagram-nodes-${problemId}`;
    const LOCAL_STORAGE_KEY_EDGES = `uml-diagram-edges-${problemId}`;
    
    const nodesJson = localStorage.getItem(LOCAL_STORAGE_KEY_NODES);
    const edgesJson = localStorage.getItem(LOCAL_STORAGE_KEY_EDGES);
    
    return {
      nodes: nodesJson ? JSON.parse(nodesJson) : [],
      edges: edgesJson ? JSON.parse(edgesJson) : []
    };
  }, [problemId]);

  const analyzeUML = useCallback(async (challengeTitle: string, challengeDescription: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { nodes, edges } = getNodesAndEdgesFromStorage();
      console.log('Sending UML data to server:', { nodes, edges, challengeTitle, challengeDescription });
      
      const response = await fetch('/api/ai/analyze-uml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          umlData: { nodes, edges },
          challengeTitle,
          challengeDescription
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze UML diagram');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      return data.analysis;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getNodesAndEdgesFromStorage]);

  return {
    analyzeUML,
    isLoading,
    error,
    analysis
  };
};