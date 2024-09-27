import { UserData } from './UserData';

export type CommentData = {
  id: number;
  userId: string;
  user?: UserData;
  text: string;
  createdAt: string;
  upVotes: number;
  hasUserUpvoted: boolean;
  replies: CommentData[];
};
