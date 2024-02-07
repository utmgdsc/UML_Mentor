import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing.tsx";
import Challenge  from "./pages/Challenge.tsx";


const chalprops = {
  id: 404
};


const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    // loader: rootLoader
    // loaders are used to prefetch data to be used for a route

    // children: [
    //   {
    //     path: "team",
    //     loader: teamLoader,
    //     element: <Team />,
    //   },
    // ],
  },
  {
    path: "/challenge",
    element: <Challenge {...chalprops} />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
