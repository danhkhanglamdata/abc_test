// Event Platform Types - for the new Event Platform feature
export interface PlatformEvent {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  banners: string[];
  primaryColor: string;
  requireInfo: boolean;
  infoFields: PlatformInfoField[];
  status: 'draft' | 'active' | 'ended';
  createdAt: string;
  updatedAt: string;
}

export interface PlatformMedia {
  id: string;
  eventId: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  uploaderName?: string;
  uploadedAt: string;
}

export interface PlatformInfoField {
  id: string;
  label: string;
  required: boolean;
  type: 'text' | 'email' | 'phone';
}

export interface PlatformEventStats {
  participants: number;
  mediaCount: number;
  views: number;
}

// Legacy types for EventBoard (for backwards compatibility)
export type EnergyLevel = 'low' | 'medium' | 'high' | 'peak';

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
  likes: string[];
  createdAt: Date;
}

export interface WheelItem {
  id: string;
  label: string;
  color?: string;
  weight?: number;
  icon?: string;
}

export interface Poll {
  id: string;
  eventId: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  createdAt: Date;
  endsAt?: Date;
  votes: Record<string, string[]>;
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface Question {
  id: string;
  eventId: string;
  text: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  upvotes: number;
  upvotedBy: string[];
  isAnswered: boolean;
  answeredAt?: Date;
  answers: Answer[];
  createdAt: Date;
}

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

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  style?: React.CSSProperties;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: React.CSSProperties;
  label?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'participant' | 'viewer';
  createdAt: Date;
}
