export enum ActivityCategory {
  LUNCH = 'LUNCH',
  TRIP = 'TRIP',
  COFFEE = 'COFFEE',
  PARTY = 'PARTY',
  WALK = 'WALK',
  TRAVEL = 'TRAVEL',
  DINING = 'DINING',
  SPORTS = 'SPORTS',
  OUTDOOR = 'OUTDOOR',
  FITNESS = 'FITNESS',
  EVENT = 'EVENT',
  OTHER = 'OTHER'
}

export enum ActivityVisibility {
  PUBLIC = 'PUBLIC',
  FRIENDS_ONLY = 'FRIENDS_ONLY',
  PRIVATE = 'PRIVATE'
}

export enum ParticipantStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  DECLINED = 'DECLINED'
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  category: ActivityCategory;
  dateTime: string;
  location?: string;
  maxParticipants?: number;
  currentParticipants: number;
  interests?: string[];
  visibility: ActivityVisibility;
  createdByUserId: string;
  approved: boolean;
  createdAt: string;
  modifiedAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  participants: ActivityParticipant[];
  feedback?: ActivityFeedback[];
}

export interface ActivityParticipant {
  id: string;
  userId: string;
  activityId: string;
  status: ParticipantStatus;
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
}

export interface ActivityFeedback {
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
}

export interface CreateActivityRequest {
  title: string;
  description?: string;
  category: ActivityCategory;
  dateTime: string;
  location?: string;
  maxParticipants?: number;
  interests?: string[];
  visibility?: ActivityVisibility;
}

export interface UserActivities {
  created: Activity[];
  joined: Activity[];
}