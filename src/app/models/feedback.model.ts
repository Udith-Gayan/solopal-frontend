export interface UserFeedback {
  id: string;
  activityId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  fromUser: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  toUser: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  activity: {
    id: string;
    title: string;
  };
}

export interface CreateFeedbackRequest {
  activityId: string;
  toUserId: string;
  rating: number;
  comment?: string;
}

export interface FeedbackStats {
  totalRatings: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface UserFeedbackData {
  received: UserFeedback[];
  given: UserFeedback[];
}