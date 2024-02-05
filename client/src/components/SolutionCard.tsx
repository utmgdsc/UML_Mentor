import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";

type SolutionCardProps = {
  imgSrc: string;
  title: string;
  href: string;
  description: string;
};

function SolutionCard({ imgSrc, title, href, description }: SolutionCardProps) {
  return (
    <Card>
      <Card.Img variant={"top"} src={imgSrc} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button variant="primary" href={href}>
          Review
        </Button>
      </Card.Body>
    </Card>
  );
}
export type { SolutionCardProps };
export default SolutionCard;
