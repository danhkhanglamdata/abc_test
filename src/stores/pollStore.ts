import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Poll } from '@/types';

interface PollState {
  polls: Poll[];
  userVotes: Record<string, string[]>; // userId -> optionIds
  votePoll: (pollId: string, userId: string, optionId: string) => void;
  createPoll: (poll: Poll) => void;
}

export const usePollStore = create<PollState>()(
  persist(
    (set) => ({
      polls: [],
      userVotes: {},

      votePoll: (pollId, userId, optionId) =>
        set((state) => {
          const userVotes = state.userVotes[userId] || [];
          const updatedVotes = userVotes.includes(optionId)
            ? userVotes.filter((id) => id !== optionId)
            : [...userVotes, optionId];

          const updatedPolls = state.polls.map((poll) => {
            if (poll.id !== pollId) return poll;

            const wasVoted = userVotes.includes(optionId);
            const updatedOptions = poll.options.map((opt) => ({
              ...opt,
              voteCount: wasVoted ? opt.voteCount - 1 : opt.voteCount + 1,
            }));

            return { ...poll, options: updatedOptions };
          });

          return {
            polls: updatedPolls,
            userVotes: { ...state.userVotes, [userId]: updatedVotes },
          };
        }),

      createPoll: (poll) =>
        set((state) => ({
          polls: [...state.polls, poll],
        })),
    }),
    {
      name: 'poll-storage',
    }
  )
);
