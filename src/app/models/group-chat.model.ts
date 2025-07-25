export interface GroupChat {
  id: string;
  name: string;
  activityId: string;
  createdAt: string;
  updatedAt: string;
  activity: {
    id: string;
    title: string;
    host: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  members: GroupChatMember[];
  messages: GroupMessage[];
}

export interface GroupChatMember {
  id: string;
  userId: string;
  groupChatId: string;
  joinedAt: string;
  isAdmin: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
}

export interface GroupMessage {
  id: string;
  content: string;
  senderId: string;
  groupChatId: string;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
}

export interface CreateGroupChatRequest {
  activityId: string;
  name?: string;
}

export interface SendGroupMessageRequest {
  content: string;
  groupChatId: string;
}