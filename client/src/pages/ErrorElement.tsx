import { useNavigate, useRouteError } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";
const isProd = import.meta.env.PROD;

function ErrorElement() {
  const errorInfo = useRouteError();
  const navigate = useNavigate();
  if (isProd) {
    return (
      <Container className={"min-vw-100 min-vh-100 d-flex align-items-center "}>
        <Container fluid={"sm"} className={"mt-6 gap-2"}>
          <Row className={"justify-content-center"}>
            <Col className={"bg-light p-4 rounded col-md-6 col-12"}>
              <h1>Ooops!</h1>
              <p>Unfortunately we experienced an error.</p>
              <Button
                onClick={() => {
                  navigate(-1);
                }}
              >
                Go Back
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  } else {
    console.error(errorInfo);
    return (
      <h1 className={"my-5 text-center"}>
        Hey! There&apos;s an error. More info in the console.
      </h1>
    );
  }
}

export default ErrorElement;
