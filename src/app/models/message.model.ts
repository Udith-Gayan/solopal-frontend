export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId?: string;
  activityId?: string;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
}

export interface Conversation {
  partner: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  lastMessage: Message;
  messages: Message[];
}

export interface CreateMessageRequest {
  content: string;
  receiverId?: string;
  activityId?: string;
}