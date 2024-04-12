export type CommentData = {
  id: number;
  solutionId: number;
  userId: number;
  text: string;
  upVotes: number;
  replies: CommentData[];
  username?: string; 
  createdAt?: string; 
};
