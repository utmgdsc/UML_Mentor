import { Outlet } from "react-router";
import NavigationBar from "./NavigationBar.tsx";
import Footer from "./Footer.tsx";
import { Navigate, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";

function AppShell() {
  const location = useLocation();
  return (
    <Container fluid className={"d-flex flex-column min-vh-100 p-0"}>
      <NavigationBar />
      <Container className={"flex-grow-1 p-0"}>
        {location.pathname === "/" ? <Navigate to={"/home"} /> : <Outlet />}
      </Container>
      <Footer />
    </Container>
  );
}

export default AppShell;
