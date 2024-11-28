import { Step } from "react-joyride";
import React, { useState } from "react";
import Joyride from "react-joyride";

export const editorTourSteps: Step[] = [
  {
    target: ".react-flow",
    content:
      "This is your UML diagram workspace. Drag nodes around and connect them with edges.",
    placement: "left",
  },
  {
    target: ".add-node-buttons",
    content:
      "Add new class or interface nodes to your diagram by clicking or dragging from these buttons.",
    placement: "right",
  },
  {
    target: "#arrowType",
    content:
      "Choose different relationship types for the edges you draw, and draw edges by clicking and dragging from the nodes.",
    placement: "right",
  },
  {
    target: ".delete-button",
    content:
      "Select an edge then click here to remove the selected edges from your diagram.",
    placement: "right",
  },
  {
    target: ".post-button",
    content:
      "Submit your solution when ready. Your work is automatically saved as you edit.",
    placement: "right",
  },
  {
    target: ".reset-button",
    content: "Clear the workspace to start fresh.",
    placement: "right",
  },
];

interface EditorTourProps {
  runTour: boolean;
  setRunTour: (run: boolean) => void;
}

export const EditorTour: React.FC<EditorTourProps> = ({
  runTour,
  setRunTour,
}) => {
  return (
    <Joyride
      steps={editorTourSteps}
      run={runTour}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      styles={{
        options: {
          primaryColor: "#007bff",
          zIndex: 1000,
        },
      }}
      callback={(data) => {
        const { status } = data;
        if (status === "finished" || status === "skipped") {
          setRunTour(false);
        }
      }}
    />
  );
};
