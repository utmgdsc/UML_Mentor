import { UserData } from "./UserData";

export type SolutionData = {
  id: number;
  challengeId: number;
  userId: number;
  description: string;
  title: string;
  diagram: string;
  createdAt: string;
  updatedAt: string;
  User: UserData;
  challengeTitle: string;
};
