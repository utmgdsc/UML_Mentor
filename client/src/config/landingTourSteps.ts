import { Step } from "react-joyride";

export const landingTourSteps: Step[] = [
  // 1. Navbar
  {
    target: ".navbar",
    content:
      "Welcome to UML Mentor! Use the navigation bar to explore different sections like browsing challenges and solutions. ",
    placement: "bottom",
    disableBeacon: true,
  },

  // 2. Challenge Cards & Components
  {
    target: ".challenge-card",
    content: `
      Each challenge card show difficulty (⭐️ Easy to ⭐️⭐️⭐️ Hard), design patterns involved, and brief description.
    `,
    placement: "bottom",
  },

  // 3. Navigate to Challenges (this step triggers navigation)
  {
    target: "body",
    content: "Let's check out the challenges page to see filtering options!",
    placement: "center",
    navPage: "/challenges",
  },

  // 4. Filtering Controls
  {
    target: ".d-flex.justify-content-end",
    content: "Use these controls to filter and sort challenges",
    placement: "bottom",
  },

  // 5. Help & Profile
  {
    target: ".user-controls",
    content:
      "Access your profile, view help documentation, and track your progress here.",
    placement: "left",
  },
];
