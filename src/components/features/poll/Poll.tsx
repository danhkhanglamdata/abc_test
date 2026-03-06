import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { usePollStore } from '@/stores/pollStore';
import type { Poll } from '@/types';

// Utility function to merge tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Default mock user (in a real app, this would come from auth)
const DEFAULT_USER = {
  id: 'user-1',
  name: 'Current User',
};

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Poll props
export interface PollProps {
  eventId?: string;
  currentUser?: {
    id: string;
    name: string;
  };
  onPollCreate?: (poll: Poll) => void;
  className?: string;
}

// Create a new poll
function createNewPoll(
  question: string,
  options: string[],
  eventId: string,
  _userId: string
): Poll {
  return {
    id: generateId(),
    eventId,
    question,
    options: options.map((text) => ({
      id: generateId(),
      text,
      voteCount: 0,
    })),
    isActive: true,
    createdAt: new Date(),
    votes: {},
  };
}

// Calculate percentage
function getPercentage(voteCount: number, totalVotes: number): number {
  if (totalVotes === 0) return 0;
  return Math.round((voteCount / totalVotes) * 100);
}

export function Poll({
  eventId,
  currentUser = DEFAULT_USER,
  onPollCreate,
  className,
}: PollProps) {
  const { polls, votePoll, createPoll } = usePollStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  // Filter polls by eventId if provided
  const filteredPolls = eventId
    ? polls.filter((p) => p.eventId === eventId)
    : polls;

  // Get active polls first, then by date
  const sortedPolls = [...filteredPolls].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Handle creating a new poll
  const handleCreate = useCallback(() => {
    if (!question.trim() || options.filter((o) => o.trim()).length < 2) return;

    const validOptions = options.filter((o) => o.trim());
    const newPoll = createNewPoll(question.trim(), validOptions, eventId || 'default', currentUser.id);

    createPoll(newPoll);
    onPollCreate?.(newPoll);

    // Reset form
    setQuestion('');
    setOptions(['', '']);
    setShowCreateForm(false);
  }, [question, options, eventId, currentUser.id, createPoll, onPollCreate]);

  // Handle vote
  const handleVote = useCallback(
    (pollId: string, optionId: string) => {
      votePoll(pollId, currentUser.id, optionId);
    },
    [currentUser.id, votePoll]
  );

  // Add/remove options
  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Create Poll Button / Form */}
      {!showCreateForm ? (
        <Button
          variant="outline"
          onClick={() => setShowCreateForm(true)}
          className="w-full"
        >
          + Create Poll
        </Button>
      ) : (
        <Card variant="outlined" padding="md">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Create a Poll
            </h3>

            {/* Question input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Question
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to ask?"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Options
              </label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="px-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button
                  onClick={addOption}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Option
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={
                  !question.trim() || options.filter((o) => o.trim()).length < 2
                }
              >
                Create Poll
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Polls List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sortedPolls.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-500 dark:text-slate-400">
                No polls yet. Create one to get started!
              </p>
            </motion.div>
          ) : (
            sortedPolls.map((poll, index) => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <PollCard
                  poll={poll}
                  currentUserId={currentUser.id}
                  onVote={handleVote}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Poll Card component
interface PollCardProps {
  poll: Poll;
  currentUserId: string;
  onVote: (pollId: string, optionId: string) => void;
}

function PollCard({ poll, currentUserId, onVote }: PollCardProps) {
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);
  const userVotedOptions = poll.votes[currentUserId] || [];

  return (
    <Card variant="outlined" padding="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            {poll.question}
          </h3>
          {poll.isActive ? (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Active
            </span>
          ) : (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
              Closed
            </span>
          )}
        </div>

        {/* Options */}
        <div className="space-y-2">
          {poll.options.map((option) => {
            const isVoted = userVotedOptions.includes(option.id);
            const percentage = getPercentage(option.voteCount, totalVotes);

            return (
              <motion.button
                key={option.id}
                onClick={() => poll.isActive && onVote(poll.id, option.id)}
                disabled={!poll.isActive}
                className={cn(
                  'relative w-full text-left p-3 rounded-lg border-2 transition-all duration-200',
                  isVoted
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
                  !poll.isActive && 'cursor-default'
                )}
                whileHover={poll.isActive ? { scale: 1.01 } : undefined}
                whileTap={poll.isActive ? { scale: 0.99 } : undefined}
              >
                {/* Progress bar background */}
                {totalVotes > 0 && (
                  <motion.div
                    className={cn(
                      'absolute inset-0 rounded-lg',
                      isVoted ? 'bg-primary-200/50 dark:bg-primary-800/30' : 'bg-slate-100 dark:bg-slate-800'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                )}

                {/* Content */}
                <div className="relative flex items-center justify-between">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {option.text}
                  </span>
                  <div className="flex items-center gap-2">
                    {isVoted && (
                      <span className="text-primary-600">✓</span>
                    )}
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {percentage}%
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
          <span>
            {poll.endsAt
              ? `Ends ${new Date(poll.endsAt).toLocaleDateString()}`
              : `Created ${new Date(poll.createdAt).toLocaleDateString()}`}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default Poll;
