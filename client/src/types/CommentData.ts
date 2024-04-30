export type CommentData = {
  id: number;
  solutionId: number;
  userId: number;
  text: string;
  upVotes: number;
  hasUserUpvoted: boolean;
  createdAt: string | number | Date;
  replies: CommentData[];
};
