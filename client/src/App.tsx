import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import AppShell from "./components/AppShell.tsx";
import ErrorElement from "./pages/ErrorElement.tsx";
import Challenges from "./pages/Challenges.tsx";
import Challenge from "./pages/Challenge.tsx";
import Solutions from "./pages/Solutions.tsx";
import PostSolution from "./pages/PostSolution.tsx";
import Solution from "./pages/Solution.tsx";

const NAV_CONFIG = {
  brand: "UML Mentor",
  routes: [
    {
      name: "Home",
      href: "/home",
    },
    {
      name: "Challenges",
      href: "/challenges",
    },
    {
      name: "Solutions",
      href: "/solutions",
    },
  ],
  profile: {
    href: "/profile",
  },
};

// IMPORTANT: when adding routes to browser router, modify the NAV_CONFIG
// accordingly.
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "challenges",
        element: <Challenges />,
      },
      {
        path: "challenge/:id",
        element: <Challenge />,
      },
      {
        path: "solutions",
        element: <Solutions />,
      },
      {
        path: "solution/:id",
        element: <Solution />,
      },
      {
        path: "/solutions/post/:id",
        element: <PostSolution />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export { NAV_CONFIG };
export default App;
