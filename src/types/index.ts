// Energy levels for events and moments
export type EnergyLevel = 'low' | 'medium' | 'high' | 'peak';

// Event type representing a scheduled event
export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  energyLevel: EnergyLevel;
  color?: string;
  tags?: string[];
  participants?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Moment type for capturing special moments within events
export interface Moment {
  id: string;
  eventId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: Date;
  energyLevel: EnergyLevel;
  mood?: string;
  photos?: string[];
  notes?: string;
  likes: string[]; // userIds who liked
  createdAt: Date;
}

// WheelItem type for the spinning wheel feature
export interface WheelItem {
  id: string;
  label: string;
  color?: string;
  weight?: number;
  icon?: string;
}

// Poll type for polling participants
export interface Poll {
  id: string;
  eventId: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  createdAt: Date;
  endsAt?: Date;
  votes: Record<string, string[]>; // userId -> optionIds
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

// Question type for Q&A sessions
export interface Question {
  id: string;
  eventId: string;
  text: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  upvotes: number;
  upvotedBy: string[]; // userIds who upvoted
  isAnswered: boolean;
  answeredAt?: Date;
  answers: Answer[];
  createdAt: Date;
}

// Answer type for Q&A
export interface Answer {
  id: string;
  questionId: string;
  text: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  isAccepted: boolean;
  createdAt: Date;
}

// FlowNode type for React Flow nodes
export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  style?: React.CSSProperties;
}

// FlowEdge type for React Flow edges
export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: React.CSSProperties;
  label?: string;
}

// User type for application users
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'participant' | 'viewer';
  createdAt: Date;
}
