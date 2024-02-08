import { Container, Nav, Navbar } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons";
import { NAV_CONFIG } from "../App.tsx";

function NavigationBar() {
  const location = useLocation().pathname;
  const navigate = useNavigate();
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href={"/"}>{NAV_CONFIG.brand}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {NAV_CONFIG.routes.map((r) => (
              <Nav.Link
                onClick={() => {
                  navigate(r.href);
                }}
                key={r.href}
                className={location === r.href ? "text-primary" : ""}
              >
                {r.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
        <Nav>
          <Nav.Link
            onClick={() => {
              navigate(NAV_CONFIG.profile.href);
            }}
          >
            <PersonCircle
              size={"1.5rem"}
              className={
                location == NAV_CONFIG.profile.href ? "text-primary" : ""
              }
            />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
