import { Stack } from "react-bootstrap";

function Footer() {
  return (
    <Stack
      as={"footer"}
      style={{
        padding: "6rem 0",
        flexGrow: "0",
      }}
      className={"bg-dark text-white text-center"}
    >
      <p className={"m-0"}>UML Mentor 2024</p>
    </Stack>
  );
}

export default Footer;
