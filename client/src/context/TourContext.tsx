import React, { createContext, useState, useContext } from "react";

interface TourContextType {
  runTour: boolean;
  setRunTour: (run: boolean) => void;
  stepIndex: number;
  setStepIndex: (index: number) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  return (
    <TourContext.Provider
      value={{ runTour, setRunTour, stepIndex, setStepIndex }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
