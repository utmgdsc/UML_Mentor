import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing.tsx";
import Home from "./pages/Home.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "home",
    element: <Home />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
