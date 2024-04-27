import { useState , useEffect} from 'react';
import { Container, Nav, Navbar } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons";
import { NAV_CONFIG } from "../App.tsx";
import NewUserPopup from './NewUserPopup'; // Make sure this path is correct
import { QuestionCircle } from "react-bootstrap-icons";
import { UserData } from '../types/UserData';

function NavigationBar() {
  const [showNewUserPopup, setShowNewUserPopup] = useState(false);
  const location = useLocation().pathname;
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData>();

  //fetch the username from the server
  useEffect(() => {
    fetch("/api/users/whoami")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<{username: string}>;
      })
      .then((data) => {
        console.log("Fetched username: " + data.username);
        setUsername(data.username);
      })
      .catch((err: Error) => { // Add the error type 'Error'
        console.error("Failed fetching the username\nError message: " + err.message);
      });
  }, [username]);

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data :(');
        }
        return response.json() as Promise<UserData>;
      })
      .then(data => {
        setUser(data);
      })
      .catch(error => {
        console.error('Error fetching user data: ', error);
      });
  }, [username]);

  const handleProfileClick = () => {
    navigate(NAV_CONFIG.profile.href + "/" + username);
  };

  const toggleNewUserPopup = () => setShowNewUserPopup(!showNewUserPopup);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href={"/"}>{NAV_CONFIG.brand}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {NAV_CONFIG.routes.map((route) => (
                <Nav.Link
                  onClick={() => navigate(route.href)}
                  key={route.href}
                  className={location === route.href ? "text-primary" : ""}
                >
                  {route.name}
                </Nav.Link>
              ))}
              {/* Conditionally render Admin link based on user role */}
              {user && user.role === 'admin' && (
                <Nav.Link
                  onClick={() => navigate('/admin')}
                  className={location === '/admin' ? 'text-primary' : ''}
                >
                  Admin
                </Nav.Link>
              )}
            </Nav>
            <Nav className="align-items-center">
              {/* "NewUserPopup" button */}
              <QuestionCircle size={20} onClick={toggleNewUserPopup} style={{ cursor: 'pointer' }} />
              {/* Profile button */}
              <Nav.Link onClick={handleProfileClick} className="d-flex align-items-center">
                <PersonCircle size={20} className={location === NAV_CONFIG.profile.href ? "text-primary" : ""} />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <NewUserPopup show={showNewUserPopup} handleClose={toggleNewUserPopup} />
    </>
  );
}

export default NavigationBar;
