/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import { ChallengeCardProps } from "../components/ChallengeCard";
import { Container, Row, Col, Button, Stack } from "react-bootstrap";
import { ChallengeDetailsShort } from "../types/ChallengeDetailsShort";



function Challenges() {
    const [challengesData, setChallengesData] = useState([]);
    // const [isLoading, setIsLoading] = useState(true); // Could be used to show a loading spinner

    // function makeGrid(challenges: ChallengeDetailsShort[]): JSX.Element[] {
    //     let grid: JSX.Element[] = [];
    //     let row: JSX.Element[] = [];
    //     let i = 0;
    //     for (const challenge of challenges) {
    //         const cardProps: ChallengeCardProps = {
    //             title: challenge.title,
    //             difficulty: challenge.difficulty,
    //             generalDescription: challenge.generalDescription,
    //         };
    //         row.push(
    //             <Col key={i} className="mb-4">
    //                 <ChallengeCard {...cardProps} />
    //             </Col>
    //         );
    //         i++;
    //         if (i % 3 === 0) {
    //             grid.push(<Row key={i}>{row}</Row>);
    //             row = [];
    //         }
    //     }
    //     if (row.length > 0) {
    //         grid.push(<Row key={i}>{row}</Row>);
    //     }
    //     return grid;
    }

    return(
        <section>
            <Container>
                {}
            </Container>
        </section>
    );
}

export default Challenges;