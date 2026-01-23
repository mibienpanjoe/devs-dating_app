// Common types and interfaces
export interface IUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'user';
  profileImage?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserProfile {
  _id?: string;
  user: string | IUser;
  bio?: string;
  skills: string[];
  languages: string[];
  github?: string;
  photos?: string[];
  location?: string;
  coordinates?: [number, number];
  age?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserPreferences {
  _id?: string;
  user: string | IUser;
  preferredLanguages: string[];
  preferredSkills: string[];
  maxDistance: number;
  minAge?: number;
  maxAge?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISwipe {
  _id?: string;
  swiper: string | IUser;
  swiped: string | IUser;
  action: 'like' | 'pass';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMatch {
  _id?: string;
  users: (string | IUser)[];
  matchedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessage {
  _id?: string;
  match: string | IMatch;
  sender: string | IUser;
  content: string;
  read?: boolean;
  delivered?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReport {
  _id?: string;
  reporter: string | IUser;
  reported: string | IUser;
  reason: string;
  status?: 'pending' | 'reviewed' | 'resolved';
  createdAt?: Date;
  updatedAt?: Date;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: IUser;
  token: string;
}

export interface SwipeRequest {
  swipedId: string;
  action: 'like' | 'pass';
}

export interface MessageRequest {
  matchId: string;
  content: string;
}

export interface CompatibilityResponse {
  compatibilityScore: number;
}

export interface PotentialMatch extends IUserProfile {
  compatibilityScore: number;
}

// Socket.io event types
export interface ServerToClientEvents {
  newMessage: (message: IMessage) => void;
  typing: (data: { userId: string; isTyping: boolean }) => void;
  messageRead: (data: { messageId: string }) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  joinMatch: (matchId: string) => void;
  sendMessage: (data: MessageRequest) => void;
  typing: (data: { matchId: string; isTyping: boolean }) => void;
  readMessage: (data: { messageId: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
}