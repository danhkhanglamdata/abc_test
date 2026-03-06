import type { Event, Moment, WheelItem, Poll, Question, EnergyLevel } from '@/types';
import { useEventStore, useMomentStore, useWheelStore, usePollStore, useQAStore, useEnergyStore } from '@/stores';

// Helper to create dates relative to now
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const hoursFromNow = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
};

// Mock Events
export const mockEvents: Event[] = [
  {
    id: 'evt-001',
    title: 'Team Building Event',
    description: 'Annual team building activities and workshops',
    startTime: daysFromNow(1),
    endTime: daysFromNow(1),
    location: 'Conference Room A',
    energyLevel: 'high',
    color: '#8B5CF6',
    tags: ['team', 'workshop'],
    participants: ['user-001', 'user-002', 'user-003'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'evt-002',
    title: 'Product Launch',
    description: 'Launch event for new product line',
    startTime: daysFromNow(3),
    endTime: daysFromNow(3),
    location: 'Main Hall',
    energyLevel: 'peak',
    color: '#10B981',
    tags: ['product', 'launch', 'marketing'],
    participants: ['user-001', 'user-004', 'user-005'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'evt-003',
    title: 'Quarterly Review',
    description: 'Q1 performance review meeting',
    startTime: daysFromNow(5),
    endTime: daysFromNow(5),
    location: 'Board Room',
    energyLevel: 'medium',
    color: '#F59E0B',
    tags: ['meeting', 'review'],
    participants: ['user-001', 'user-002'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'evt-004',
    title: 'Workshop: React Best Practices',
    description: 'Technical workshop on React patterns',
    startTime: daysFromNow(7),
    endTime: daysFromNow(7),
    location: 'Training Room B',
    energyLevel: 'high',
    color: '#3B82F6',
    tags: ['workshop', 'technical', 'react'],
    participants: ['user-001', 'user-003', 'user-006'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock Moments
export const mockMoments: Moment[] = [
  {
    id: 'mom-001',
    eventId: 'evt-001',
    authorId: 'user-001',
    authorName: 'John Doe',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    content: 'Great opening speech by the CEO! Really inspiring.',
    timestamp: hoursFromNow(-2),
    energyLevel: 'high',
    mood: 'excited',
    likes: ['user-002', 'user-003'],
    createdAt: hoursFromNow(-2),
  },
  {
    id: 'mom-002',
    eventId: 'evt-001',
    authorId: 'user-002',
    authorName: 'Jane Smith',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    content: 'The team building exercise was amazing!',
    timestamp: hoursFromNow(-1),
    energyLevel: 'peak',
    mood: 'happy',
    likes: ['user-001', 'user-004'],
    createdAt: hoursFromNow(-1),
  },
  {
    id: 'mom-003',
    eventId: 'evt-001',
    authorId: 'user-003',
    authorName: 'Bob Wilson',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    content: 'Lunch break - networking time!',
    timestamp: hoursFromNow(0),
    energyLevel: 'medium',
    mood: 'relaxed',
    likes: ['user-001'],
    createdAt: hoursFromNow(0),
  },
];

// Mock Wheel Items
export const mockWheelItems: WheelItem[] = [
  { id: 'wheel-001', label: 'Prize: Gift Card', color: '#8B5CF6', weight: 1 },
  { id: 'wheel-002', label: 'Prize: Extra Break', color: '#10B981', weight: 2 },
  { id: 'wheel-003', label: 'Prize: Coffee Voucher', color: '#F59E0B', weight: 3 },
  { id: 'wheel-004', label: 'Try Again', color: '#EF4444', weight: 1 },
  { id: 'wheel-005', label: 'Prize: Movie Ticket', color: '#3B82F6', weight: 2 },
  { id: 'wheel-006', label: 'Prize: Lunch On Us', color: '#EC4899', weight: 1 },
  { id: 'wheel-007', label: 'Prize: Extra PTO', color: '#14B8A6', weight: 1 },
  { id: 'wheel-008', label: 'Lucky: Pick Another', color: '#6366F1', weight: 1 },
];

// Mock Polls
export const mockPolls: Poll[] = [
  {
    id: 'poll-001',
    eventId: 'evt-001',
    question: 'What topic should we cover in the next workshop?',
    options: [
      { id: 'opt-001', text: 'React Performance', voteCount: 5 },
      { id: 'opt-002', text: 'TypeScript Advanced', voteCount: 3 },
      { id: 'opt-003', text: 'Testing Best Practices', voteCount: 4 },
      { id: 'opt-004', text: 'State Management', voteCount: 2 },
    ],
    isActive: true,
    createdAt: daysFromNow(-1),
    endsAt: daysFromNow(2),
    votes: {
      'user-001': ['opt-001'],
      'user-002': ['opt-003'],
      'user-003': ['opt-001'],
    },
  },
  {
    id: 'poll-002',
    eventId: 'evt-002',
    question: 'Which color theme should the new product have?',
    options: [
      { id: 'opt-005', text: 'Ocean Blue', voteCount: 8 },
      { id: 'opt-006', text: 'Forest Green', voteCount: 6 },
      { id: 'opt-007', text: 'Sunset Orange', voteCount: 4 },
      { id: 'opt-008', text: 'Midnight Purple', voteCount: 7 },
    ],
    isActive: true,
    createdAt: daysFromNow(-2),
    votes: {
      'user-004': ['opt-005'],
      'user-005': ['opt-008'],
    },
  },
];

// Mock Questions for QA
export const mockQuestions: Question[] = [
  {
    id: 'q-001',
    eventId: 'evt-001',
    text: 'What are the key takeaways from today\'s team building activities?',
    authorId: 'user-002',
    authorName: 'Jane Smith',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    upvotes: 12,
    upvotedBy: ['user-001', 'user-003', 'user-004'],
    isAnswered: false,
    answers: [],
    createdAt: hoursFromNow(-1),
  },
  {
    id: 'q-002',
    eventId: 'evt-001',
    text: 'How will the new team structure affect our project workflows?',
    authorId: 'user-003',
    authorName: 'Bob Wilson',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    upvotes: 8,
    upvotedBy: ['user-001', 'user-002'],
    isAnswered: true,
    answeredAt: hoursFromNow(0),
    answers: [
      {
        id: 'a-001',
        questionId: 'q-002',
        text: 'The new structure will allow for more cross-functional collaboration with smaller, agile teams.',
        authorId: 'user-001',
        authorName: 'John Doe',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        isAccepted: true,
        createdAt: hoursFromNow(0),
      },
    ],
    createdAt: hoursFromNow(-2),
  },
  {
    id: 'q-003',
    eventId: 'evt-001',
    text: 'Can we schedule follow-up sessions for the topics covered today?',
    authorId: 'user-004',
    authorName: 'Alice Brown',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    upvotes: 5,
    upvotedBy: ['user-005'],
    isAnswered: false,
    answers: [],
    createdAt: hoursFromNow(0),
  },
];

// Energy level options
export const energyLevels: EnergyLevel[] = ['low', 'medium', 'high', 'peak'];

// Initialize all mock data in stores
export const initializeMockData = () => {
  // Initialize events
  const eventStore = useEventStore.getState();
  if (eventStore.events.length === 0) {
    mockEvents.forEach((event) => eventStore.addEvent(event));
    if (mockEvents.length > 0) {
      eventStore.setCurrentEvent(mockEvents[0]);
    }
  }

  // Initialize moments
  const momentStore = useMomentStore.getState();
  if (momentStore.moments.length === 0) {
    momentStore.setMoments(mockMoments);
  }

  // Initialize wheel items
  const wheelStore = useWheelStore.getState();
  if (wheelStore.wheelItems.length === 0) {
    wheelStore.setWheelItems(mockWheelItems);
  }

  // Initialize polls
  const pollStore = usePollStore.getState();
  if (pollStore.polls.length === 0) {
    mockPolls.forEach((poll) => pollStore.createPoll(poll));
  }

  // Initialize questions
  const qaStore = useQAStore.getState();
  if (qaStore.questions.length === 0) {
    mockQuestions.forEach((question) => qaStore.addQuestion(question));
  }

  // Initialize energy levels (already set by default, but ensuring consistency)
  const energyStore = useEnergyStore.getState();
  if (energyStore.energyLevels.length === 0) {
    energyStore.setEnergyLevels(energyLevels);
  }
};
