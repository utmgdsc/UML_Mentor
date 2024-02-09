import { Outlet } from "react-router";
import NavigationBar from "./NavigationBar.tsx";
import Footer from "./Footer.tsx";
import { Navigate, useLocation } from "react-router-dom";

function AppShell() {
  const location = useLocation();
  return (
    <>
      <NavigationBar />
      {location.pathname === "/" ? <Navigate to={"/home"} /> : <Outlet />}
      <Footer />
    </>
  );
}

export default AppShell;
