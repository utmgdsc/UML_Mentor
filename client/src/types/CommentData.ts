import { UserData } from './UserData';

export type CommentData = {
  id: number;
  userId: string;
  solutionId: number;
  user?: UserData;
  text: string;
  createdAt: string;
  upVotes: number;
  hasUserUpvoted: boolean;
  replies: CommentData[];
};
