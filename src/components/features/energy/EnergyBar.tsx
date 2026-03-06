import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Energy voting levels with icons and colors
export type EnergyVoteLevel = 'fire' | 'electric' | 'wave' | 'calm' | 'sleepy';

export interface EnergyVoteOption {
  id: EnergyVoteLevel;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}

// Energy vote options configuration
export const ENERGY_VOTE_OPTIONS: EnergyVoteOption[] = [
  { id: 'sleepy', label: 'Sleepy', icon: '💤', color: 'text-indigo-400', bgColor: 'bg-indigo-400' },
  { id: 'calm', label: 'Calm', icon: '🌱', color: 'text-green-400', bgColor: 'bg-green-400' },
  { id: 'wave', label: 'Wave', icon: '🌊', color: 'text-blue-400', bgColor: 'bg-blue-400' },
  { id: 'electric', label: 'Electric', icon: '⚡', color: 'text-yellow-400', bgColor: 'bg-yellow-400' },
  { id: 'fire', label: 'Fire', icon: '🔥', color: 'text-red-500', bgColor: 'bg-red-500' },
];

// EnergyBar component props
export interface EnergyBarProps {
  momentId: string;
  votes?: Record<EnergyVoteLevel, number>;
  userVote?: EnergyVoteLevel;
  onVote?: (momentId: string, level: EnergyVoteLevel) => void;
  showDistribution?: boolean;
  className?: string;
}

// Default mock votes for demonstration
const DEFAULT_VOTES: Record<EnergyVoteLevel, number> = {
  sleepy: 2,
  calm: 5,
  wave: 8,
  electric: 12,
  fire: 7,
};

export function EnergyBar({
  momentId,
  votes = DEFAULT_VOTES,
  userVote,
  onVote,
  showDistribution = true,
  className,
}: EnergyBarProps) {
  const [selectedVote, setSelectedVote] = useState<EnergyVoteLevel | undefined>(userVote);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate total votes
  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

  // Handle vote selection
  const handleVote = useCallback(
    (level: EnergyVoteLevel) => {
      setIsAnimating(true);
      setSelectedVote(level);

      if (onVote) {
        onVote(momentId, level);
      }

      setTimeout(() => setIsAnimating(false), 300);
    },
    [momentId, onVote]
  );

  // Get percentage for a given vote count
  const getPercentage = (count: number): number => {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Vote buttons */}
      <div className="flex items-center justify-center gap-2">
        {ENERGY_VOTE_OPTIONS.map((option) => {
          const isSelected = selectedVote === option.id;

          return (
            <motion.button
              key={option.id}
              onClick={() => handleVote(option.id)}
              className={cn(
                'relative flex flex-col items-center justify-center',
                'w-14 h-14 rounded-xl transition-all duration-200',
                'border-2 focus:outline-none focus:ring-2 focus:ring-offset-2',
                isSelected
                  ? `${option.bgColor} border-transparent text-white shadow-lg scale-110`
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={false}
              animate={isSelected && isAnimating ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <span className="text-xl">{option.icon}</span>
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className={cn(
                      'absolute -top-1 -right-1 w-4 h-4 rounded-full',
                      option.bgColor,
                      'flex items-center justify-center text-[10px]'
                    )}
                  >
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Vote labels */}
      <div className="flex items-center justify-center gap-2">
        {ENERGY_VOTE_OPTIONS.map((option) => {
          const isSelected = selectedVote === option.id;

          return (
            <span
              key={option.id}
              className={cn(
                'text-xs font-medium w-14 text-center transition-colors duration-200',
                isSelected ? option.color : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {option.label}
            </span>
          );
        })}
      </div>

      {/* Distribution bars */}
      {showDistribution && totalVotes > 0 && (
        <div className="space-y-2 mt-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
          </p>

          <div className="space-y-1.5">
            {ENERGY_VOTE_OPTIONS.slice().reverse().map((option) => {
              const count = votes[option.id] || 0;
              const percentage = getPercentage(count);
              const isSelected = selectedVote === option.id;

              return (
                <div key={option.id} className="flex items-center gap-2">
                  <span className="text-sm w-6 text-right">{option.icon}</span>

                  <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={cn('h-full rounded-full', option.bgColor)}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{
                        duration: 0.5,
                        ease: 'easeOut',
                        delay: 0.1,
                      }}
                    />
                  </div>

                  <span
                    className={cn(
                      'text-xs font-medium w-8 text-left',
                      isSelected ? option.color : 'text-slate-600 dark:text-slate-300'
                    )}
                  >
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {showDistribution && totalVotes === 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">
          Be the first to vote!
        </p>
      )}
    </div>
  );
}

export default EnergyBar;
