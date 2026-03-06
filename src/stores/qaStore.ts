import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, Answer } from '@/types';

interface QAState {
  questions: Question[];
  addQuestion: (question: Question) => void;
  upvoteQuestion: (questionId: string, userId: string) => void;
  addAnswer: (questionId: string, answer: Answer) => void;
  acceptAnswer: (questionId: string, answerId: string) => void;
}

export const useQAStore = create<QAState>()(
  persist(
    (set) => ({
      questions: [],

      addQuestion: (question) =>
        set((state) => ({
          questions: [question, ...state.questions],
        })),

      upvoteQuestion: (questionId, userId) =>
        set((state) => ({
          questions: state.questions.map((q) => {
            if (q.id !== questionId) return q;
            const hasUpvoted = q.upvotedBy.includes(userId);
            return {
              ...q,
              upvotes: hasUpvoted ? q.upvotes - 1 : q.upvotes + 1,
              upvotedBy: hasUpvoted
                ? q.upvotedBy.filter((id) => id !== userId)
                : [...q.upvotedBy, userId],
            };
          }),
        })),

      addAnswer: (questionId, answer) =>
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === questionId
              ? { ...q, answers: [...q.answers, answer] }
              : q
          ),
        })),

      acceptAnswer: (questionId, answerId) =>
        set((state) => ({
          questions: state.questions.map((q) => {
            if (q.id !== questionId) return q;
            return {
              ...q,
              isAnswered: true,
              answeredAt: new Date(),
              answers: q.answers.map((a) => ({
                ...a,
                isAccepted: a.id === answerId,
              })),
            };
          }),
        })),
    }),
    {
      name: 'qa-storage',
    }
  )
);
