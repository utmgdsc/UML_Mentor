import React from "react";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { landingTourSteps } from "../config/landingTourSteps";

interface LandingTourProps {
  runTour: boolean;
  setRunTour: (run: boolean) => void;
}

export const LandingTour: React.FC<LandingTourProps> = ({
  runTour,
  setRunTour,
}) => {
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      // Optionally save to localStorage that the user has seen the tour
      localStorage.setItem("hasSeenTour", "true");
    }
  };

  return (
    <Joyride
      steps={landingTourSteps}
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
      callback={handleJoyrideCallback}
    />
  );
};
