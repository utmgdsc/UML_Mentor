export type CommentData = {
  id: number;
  solutionId: number;
  userId: string;
  text: string;
  upVotes: number;
  hasUserUpvoted: boolean;
  createdAt: string | number | Date;
  replies: CommentData[];
};
