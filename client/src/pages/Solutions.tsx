import { useEffect } from "react";
import { Container } from "react-bootstrap";

const Solutions = () => {
  useEffect(() => {
    fetch("/api/solutions")
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return <Container>Hey</Container>;
};

export default Solutions;
