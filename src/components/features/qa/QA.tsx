import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useQAStore } from '@/stores/qaStore';
import type { Question, Answer } from '@/types';

// Utility function to merge tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Default mock user (in a real app, this would come from auth)
const DEFAULT_USER = {
  id: 'user-1',
  name: 'Current User',
  avatar: undefined,
};

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// QA component props
export interface QAProps {
  eventId?: string;
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  onQuestionAsk?: (question: Question) => void;
  className?: string;
}

// Create a new question
function createNewQuestion(
  text: string,
  eventId: string,
  user: { id: string; name: string; avatar?: string }
): Question {
  return {
    id: generateId(),
    eventId,
    text,
    authorId: user.id,
    authorName: user.name,
    authorAvatar: user.avatar,
    upvotes: 0,
    upvotedBy: [],
    isAnswered: false,
    answers: [],
    createdAt: new Date(),
  };
}

// Create a new answer
function createNewAnswer(
  questionId: string,
  text: string,
  user: { id: string; name: string; avatar?: string }
): Answer {
  return {
    id: generateId(),
    questionId,
    text,
    authorId: user.id,
    authorName: user.name,
    authorAvatar: user.avatar,
    isAccepted: false,
    createdAt: new Date(),
  };
}

// Format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

export function QA({
  eventId,
  currentUser = DEFAULT_USER,
  onQuestionAsk,
  className,
}: QAProps) {
  const { questions, addQuestion, upvoteQuestion, addAnswer, acceptAnswer } = useQAStore();
  const [newQuestion, setNewQuestion] = useState('');
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});

  // Filter questions by eventId if provided
  const filteredQuestions = eventId
    ? questions.filter((q) => q.eventId === eventId)
    : questions;

  // Sort by upvotes (highest first), then by date
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (a.isAnswered !== b.isAnswered) return a.isAnswered ? 1 : -1;
    if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Handle asking a new question
  const handleAskQuestion = useCallback(() => {
    if (!newQuestion.trim()) return;

    const question = createNewQuestion(newQuestion.trim(), eventId || 'default', currentUser);
    addQuestion(question);
    onQuestionAsk?.(question);
    setNewQuestion('');
  }, [newQuestion, eventId, currentUser, addQuestion, onQuestionAsk]);

  // Handle upvoting
  const handleUpvote = useCallback(
    (questionId: string) => {
      upvoteQuestion(questionId, currentUser.id);
    },
    [currentUser.id, upvoteQuestion]
  );

  // Handle adding an answer
  const handleAddAnswer = useCallback(
    (questionId: string) => {
      const answerText = answerTexts[questionId];
      if (!answerText?.trim()) return;

      const answer = createNewAnswer(questionId, answerText.trim(), currentUser);
      addAnswer(questionId, answer);
      setAnswerTexts({ ...answerTexts, [questionId]: '' });
    },
    [answerTexts, currentUser, addAnswer]
  );

  // Handle accepting an answer
  const handleAcceptAnswer = useCallback(
    (questionId: string, answerId: string) => {
      acceptAnswer(questionId, answerId);
    },
    [acceptAnswer]
  );

  // Update answer text
  const updateAnswerText = (questionId: string, text: string) => {
    setAnswerTexts({ ...answerTexts, [questionId]: text });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Ask Question */}
      <Card variant="outlined" padding="md">
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Ask a Question
          </h3>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="What would you like to ask?"
            className="w-full min-h-[80px] resize-none border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleAskQuestion}
              disabled={!newQuestion.trim()}
            >
              Ask Question
            </Button>
          </div>
        </div>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sortedQuestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-500 dark:text-slate-400">
                No questions yet. Be the first to ask!
              </p>
            </motion.div>
          ) : (
            sortedQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <QuestionCard
                  question={question}
                  currentUserId={currentUser.id}
                  onUpvote={() => handleUpvote(question.id)}
                  answerText={answerTexts[question.id] || ''}
                  onAnswerTextChange={(text) => updateAnswerText(question.id, text)}
                  onAddAnswer={() => handleAddAnswer(question.id)}
                  onAcceptAnswer={(answerId) => handleAcceptAnswer(question.id, answerId)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Question Card component
interface QuestionCardProps {
  question: Question;
  currentUserId: string;
  onUpvote: () => void;
  answerText: string;
  onAnswerTextChange: (text: string) => void;
  onAddAnswer: () => void;
  onAcceptAnswer: (answerId: string) => void;
}

function QuestionCard({
  question,
  currentUserId,
  onUpvote,
  answerText,
  onAnswerTextChange,
  onAddAnswer,
  onAcceptAnswer,
}: QuestionCardProps) {
  const hasUpvoted = question.upvotedBy.includes(currentUserId);
  const isAuthor = question.authorId === currentUserId;

  return (
    <Card variant="outlined" padding="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Upvote button */}
          <div className="flex flex-col items-center">
            <button
              onClick={onUpvote}
              className={cn(
                'p-1 rounded-lg transition-colors duration-200',
                hasUpvoted
                  ? 'text-primary-600'
                  : 'text-slate-400 hover:text-primary-500'
              )}
            >
              <motion.span
                animate={hasUpvoted ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-6 h-6"
                  fill={hasUpvoted ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </motion.span>
            </button>
            <span className={cn(
              'text-sm font-semibold',
              hasUpvoted ? 'text-primary-600' : 'text-slate-600 dark:text-slate-400'
            )}>
              {question.upvotes}
            </span>
          </div>

          {/* Question content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {question.isAnswered && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Answered
                </span>
              )}
            </div>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {question.text}
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
              <span>by {question.authorName}</span>
              <span>·</span>
              <span>{formatRelativeTime(question.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Answers */}
        {question.answers.length > 0 && (
          <div className="space-y-3 pl-12">
            {question.answers.map((answer) => (
              <AnswerItem
                key={answer.id}
                answer={answer}
                isQuestionAuthor={isAuthor}
                onAccept={() => onAcceptAnswer(answer.id)}
              />
            ))}
          </div>
        )}

        {/* Add Answer */}
        <div className="pl-12">
          {answerText ? (
            <div className="space-y-2">
              <textarea
                value={answerText}
                onChange={(e) => onAnswerTextChange(e.target.value)}
                placeholder="Write your answer..."
                className="w-full min-h-[60px] resize-none border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAnswerTextChange('')}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={onAddAnswer}
                  disabled={!answerText.trim()}
                >
                  Answer
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onAnswerTextChange(' ')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Answer this question
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

// Answer Item component
interface AnswerItemProps {
  answer: Answer;
  isQuestionAuthor: boolean;
  onAccept: () => void;
}

function AnswerItem({ answer, isQuestionAuthor, onAccept }: AnswerItemProps) {
  return (
    <div
      className={cn(
        'p-3 rounded-lg',
        answer.isAccepted
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : 'bg-slate-50 dark:bg-slate-800'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {answer.isAccepted && (
            <div className="flex items-center gap-1 text-green-600 text-xs font-medium mb-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Accepted Answer
            </div>
          )}
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {answer.text}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>by {answer.authorName}</span>
            <span>·</span>
            <span>{formatRelativeTime(answer.createdAt)}</span>
          </div>
        </div>

        {/* Accept button (only for question author) */}
        {isQuestionAuthor && !answer.isAccepted && (
          <button
            onClick={onAccept}
            className="text-xs text-slate-400 hover:text-green-600 transition-colors"
            title="Accept this answer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default QA;
