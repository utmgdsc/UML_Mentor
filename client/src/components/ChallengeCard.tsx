import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";

type ChallengeCardProps = {
  title: string;
  description: string;
  href: string;
};

function ChallengeCard({ title, description, href }: ChallengeCardProps) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button href={href}>Solve</Button>
      </Card.Body>
    </Card>
  );
}
export type { ChallengeCardProps };
export default ChallengeCard;
