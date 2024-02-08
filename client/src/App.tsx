import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing.tsx";
import Home from "./pages/Home.tsx";
import AppShell from "./components/AppShell.tsx";
import ErrorElement from "./pages/ErrorElement.tsx";

const NAV_CONFIG = {
  brand: "UML Mentor",
  routes: [
    {
      name: "Home",
      href: "/app/home",
    },
    {
      name: "Challenges",
      href: "/app/challenges",
    },
    {
      name: "Solutions",
      href: "/app/solutions",
    },
  ],
  profile: {
    href: "/app/profile",
  },
};

// IMPORTANT: when adding routes to browser router, modify the NAV_CONFIG
// accordingly.
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorElement />,
  },
  {
    path: "app",
    element: <AppShell />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export { NAV_CONFIG };
export default App;
