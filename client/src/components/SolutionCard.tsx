import Card from "react-bootstrap/Card";
import Button from "./Button.tsx";

type SolutionCardProps = {
  imgSrc: string;
  title: string;
  id: string;
  description: string;
  author: string;
  createdAt: string;
};


function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  let diff = Math.abs(now.getTime() - date.getTime()); // difference in milliseconds

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  diff -= years * (1000 * 60 * 60 * 24 * 365);

  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  diff -= months * (1000 * 60 * 60 * 24 * 30);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60)) || 1; // Default to at least 1 minute

  let result = '';
  if (years === 1) {
    result += `${years} year `;
  } else if (years > 1) {
    result += `${years} years `;
  } else if (months === 1) {
    result += `${months} month `;
  } else if (months > 1) {
    result += `${months} months `;
  } else if (days === 1) {
    result += `${days} day `;
  } else if (days > 1) {
    result += `${days} days `;
  } else if (hours === 1) {
    result += `${hours} hour `;
  } else if (hours > 1) {
    result += `${hours} hours `;
  } else if (minutes === 1) {
    result += `${minutes} minute `;
  } else {
    result += `${minutes} minutes `;
  }
  result += "ago";


  return result.trim();
}


function SolutionCard({ imgSrc, title, id, description, author, createdAt }: SolutionCardProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          <Card.Link href={`/profile/${author}`}>
            {author}
          </Card.Link>
        </Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Card.Img variant={"top"} src={`/api/solutions/diagrams/${imgSrc}`} />
        <Card.Text className="my-2">{description}</Card.Text>
        <div className="d-flex justify-content-between">
          <Button variant="primary" href={`/solution/${id}`}>
            Review
          </Button>
          <Card.Text className="text-muted mt-2">
            Posted {timeAgo(createdAt)}
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
}

export type { SolutionCardProps };
export default SolutionCard;
