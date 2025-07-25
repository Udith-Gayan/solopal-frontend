export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  age?: number;
  location?: string;
  interests?: string[];
  profilePic?: string;
  verified: boolean;
  approved: boolean;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  provider: 'LOCAL' | 'FACEBOOK' | 'INSTAGRAM';
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
  age?: number;
  location?: string;
  interests?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}