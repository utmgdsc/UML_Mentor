import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";

type SolutionCardProps = {
  imgSrc: string;
  title: string;
  href: string;
  description: string;
  author: string;
};

function SolutionCard({ imgSrc, title, href, description, author }: SolutionCardProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          <Card.Link href={`/profile/${author}`}>{author}</Card.Link>
          </Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Card.Img variant={"top"} src={imgSrc} />
        <Card.Text className="my-2">{description}</Card.Text>
        <Button variant="primary" href={href}>
          Review
        </Button>
      </Card.Body>
    </Card>
  );
}

export type { SolutionCardProps };
export default SolutionCard;
