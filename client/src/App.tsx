import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import AppShell from "./components/AppShell.tsx";
import ErrorElement from "./pages/ErrorElement.tsx";
import Challenges from "./pages/Challenges.tsx";
import Challenge from "./pages/Challenge.tsx";
import Solutions from "./pages/Solutions.tsx";
import PostSolution from "./pages/PostSolution.tsx";
import Solution from "./pages/Solution.tsx";
import Profile from "./pages/Profile.tsx"
import Editor from "./pages/Editor.tsx";
import Admin from "./pages/Admin.tsx"

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
    {
      name: "Admin", // Add Admin link to the navigation
      href: "/admin",
    },
  ],
  profile: {
    name: "Profile",
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
        path: "challenge/:id",
        element: <Challenge />
      },
      {
        path: "challenges",
        element: <Challenges />
      },
      {
        path: "profile/:username",
        element: <Profile />
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
      {
        path: "editor",
        element: <Editor />
      },
      {
        path: "admin", // Add route for the Admin page
        element: <Admin />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export { NAV_CONFIG };
export default App;
