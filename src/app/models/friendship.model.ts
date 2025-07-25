export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  BLOCKED = 'BLOCKED'
}

export interface UserFriendship {
  id: string;
  userAId: string;
  userBId: string;
  status: FriendshipStatus;
  createdAt: string;
  userA: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  userB: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
}

export interface Friend {
  id: string;
  friend: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  createdAt: string;
}

export interface FriendRequests {
  sent: UserFriendship[];
  received: UserFriendship[];
}

export interface SendFriendRequestRequest {
  userBId: string;
}

export interface RespondToFriendRequestRequest {
  status: FriendshipStatus;
}