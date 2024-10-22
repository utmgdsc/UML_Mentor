import React, { useState } from "react";
import { useUMLFormatter } from "../hooks/useUMLFormatter";

const UMLAnalyzer: React.FC<{ problemId: string }> = ({ problemId }) => {
  const { formattedData, getFormattedUMLData, prepareOpenAIPrompt } =
    useUMLFormatter(problemId);
  const [prompt, setPrompt] = useState("");

  const handleAnalyze = () => {
    const data = getFormattedUMLData();
    console.log("Formatted UML Data:", data);

    const fullPrompt = prepareOpenAIPrompt(prompt);
    console.log("Full OpenAI Prompt:", fullPrompt);
    // TODO: Send fullPrompt to OpenAI API
  };

  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt for UML analysis"
      />
      <button onClick={handleAnalyze}>Analyze UML</button>
      {formattedData && (
        <pre>
          <code>{formattedData}</code>
        </pre>
      )}
    </div>
  );
};

export default UMLAnalyzer;
