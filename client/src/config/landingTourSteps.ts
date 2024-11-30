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
    content:
      "Each challenge card shows:<br/>• Difficulty (⭐️ Easy to ⭐️⭐️⭐️ Hard)<br/>• Required design patterns<br/>• Brief description",
    placement: "bottom",
  },

  // 3. Filtering and Sorting
  {
    target: ".filter-controls",
    content:
      "Filter challenges by difficulty level, completion status, or sort them to find the perfect challenge for you.",
    placement: "bottom",
  },

  // 4. Solutions Section
  {
    target: ".solutions-section",
    content:
      "Browse and learn from solutions submitted by other students. You can view solutions after completing a challenge.",
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
