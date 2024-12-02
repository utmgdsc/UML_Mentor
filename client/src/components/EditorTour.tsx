import { Step } from "react-joyride";
import React from "react";
import Joyride from "react-joyride";
import { useTour } from "../context/TourContext";

export const editorTourSteps: Step[] = [
  {
    target: "section.p-3",
    content:
      "Here's your challenge description. Make sure to read it carefully to understand what you need to implement.",
    placement: "right",
    disableScrolling: true,
    disableBeacon: true,
  },
  {
    target: ".react-flow",
    content:
      "This is your UML diagram workspace. Here, you can add nodes and connect them with edges.",
    placement: "left",
    disableScrolling: true,
    disableBeacon: true,
  },
  {
    target: ".add-node-buttons",
    content:
      "Add new class or interface nodes to your diagram by clicking on or dragging from these buttons.",
    placement: "right",
    disableScrolling: true,
    disableBeacon: true,
  },
  {
    target: "#arrowType",
    content:
      "Choose different relationship types for the edges you draw, and draw edges by clicking and dragging from the nodes.",
    placement: "right",
    disableScrolling: true,
    disableBeacon: true,
  },
  {
    target: ".delete-button",
    content:
      "Select an existing edge then click here or press the delete key to remove the edges from your diagram.",
    placement: "right",
    disableScrolling: true,
    disableBeacon: true,
  },
  {
    target: ".post-button",
    content:
      "Press this to submit your solution when ready. Your work is automatically saved so you can leave and come back any time.",
    placement: "right",
    disableScrolling: true,
    disableBeacon: true,
  },
  {
    target: ".reset-button",
    content:
      "This button allows you to clear the workspace to start over again.",
    placement: "right",
    disableScrolling: true,
    disableBeacon: true,
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
  const { tourType } = useTour();

  const shouldRun = runTour && tourType === "editor";

  return (
    <Joyride
      steps={editorTourSteps}
      run={shouldRun}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      styles={{
        options: {
          primaryColor: "#007bff",
          zIndex: 1000,
        },
        tooltip: {
          width: 450,
        },
      }}
      floaterProps={{
        disableAnimation: true,
      }}
      callback={(data) => {
        const { status } = data;
        if (status === "finished" || status === "skipped") {
          setRunTour(false);
        }
      }}
      disableScrolling={true}
    />
  );
};
