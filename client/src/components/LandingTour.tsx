import React from "react";
import { useNavigate } from "react-router-dom";
import Joyride, { CallBackProps, STATUS, EVENTS } from "react-joyride";
import { landingTourSteps } from "../config/landingTourSteps";
import { useTour } from "../context/TourContext";

export const LandingTour: React.FC = () => {
  const navigate = useNavigate();
  const { runTour, setRunTour, stepIndex, setStepIndex, tourType } = useTour();

  const shouldRun = runTour && tourType === "landing";

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;

    if (type === EVENTS.STEP_AFTER) {
      const nextStep = landingTourSteps[index + 1];
      if (nextStep?.navPage) {
        setTimeout(() => {
          navigate(nextStep.navPage);
        }, 300);
      }
      setStepIndex(index + 1);
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      setStepIndex(0);
      navigate("/");
    }
  };

  return (
    <Joyride
      steps={landingTourSteps}
      run={shouldRun}
      stepIndex={stepIndex}
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
      disableScrolling={true}
    />
  );
};
