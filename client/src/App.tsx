import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import AppShell from "./components/AppShell.tsx";
import ErrorElement from "./pages/ErrorElement.tsx";
import Challenge from "./pages/Challenge.tsx";
import Profile from "./pages/Profile.tsx";

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
        path: "profile",
        element: <Profile />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export { NAV_CONFIG };
export default App;
