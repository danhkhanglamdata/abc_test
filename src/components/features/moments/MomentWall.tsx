import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useMomentStore } from '@/stores/momentStore';
import type { Moment } from '@/types';

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

// Energy level colors
const ENERGY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-indigo-100', text: 'text-indigo-600', label: 'Low' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-600', label: 'Medium' },
  high: { bg: 'bg-orange-100', text: 'text-orange-600', label: 'High' },
  peak: { bg: 'bg-red-100', text: 'text-red-600', label: 'Peak' },
};

// Mood icons
const MOOD_ICONS: Record<string, string> = {
  happy: '😊',
  excited: '🤩',
  grateful: '🙏',
  inspired: '💡',
  proud: '🎉',
  relaxed: '😌',
  focused: '🎯',
  default: '✨',
};

// MomentWall props
export interface MomentWallProps {
  eventId?: string;
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  onMomentClick?: (moment: Moment) => void;
  className?: string;
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

export function MomentWall({
  eventId,
  currentUser = DEFAULT_USER,
  onMomentClick,
  className,
}: MomentWallProps) {
  const { moments, addMoment, likeMoment } = useMomentStore();
  const [newContent, setNewContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('default');
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter moments by eventId if provided
  const filteredMoments = eventId
    ? moments.filter((m) => m.eventId === eventId)
    : moments;

  // Handle submitting a new moment
  const handleSubmit = useCallback(() => {
    if (!newContent.trim()) return;

    const newMoment: Moment = {
      id: generateId(),
      eventId: eventId || 'default',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: newContent.trim(),
      timestamp: new Date(),
      energyLevel: 'medium',
      mood: selectedMood,
      likes: [],
      createdAt: new Date(),
    };

    addMoment(newMoment);
    setNewContent('');
    setSelectedMood('default');
    setIsExpanded(false);
  }, [newContent, selectedMood, currentUser, eventId, addMoment]);

  // Handle like
  const handleLike = useCallback(
    (momentId: string) => {
      likeMoment(momentId, currentUser.id);
    },
    [currentUser.id, likeMoment]
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Add Moment Form */}
      <Card variant="outlined" padding="md">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="flex-1">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Share a moment..."
                className="w-full min-h-[80px] resize-none border-0 bg-transparent focus:outline-none focus:ring-0 text-sm"
                onFocus={() => setIsExpanded(true)}
              />
            </div>
          </div>

          {/* Expanded form */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Mood selector */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(MOOD_ICONS).map(([mood, icon]) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-lg transition-all duration-200',
                        selectedMood === mood
                          ? 'bg-primary-100 ring-2 ring-primary-400'
                          : 'bg-slate-100 hover:bg-slate-200'
                      )}
                      title={mood.charAt(0).toUpperCase() + mood.slice(1)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>

                {/* Submit button */}
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!newContent.trim()}
                  >
                    Post Moment
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Moments Feed */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredMoments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-500 dark:text-slate-400">
                No moments yet. Be the first to share!
              </p>
            </motion.div>
          ) : (
            filteredMoments.map((moment, index) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <MomentCard
                  moment={moment}
                  currentUserId={currentUser.id}
                  onLike={() => handleLike(moment.id)}
                  onClick={() => onMomentClick?.(moment)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Moment Card component
interface MomentCardProps {
  moment: Moment;
  currentUserId: string;
  onLike: () => void;
  onClick?: () => void;
}

function MomentCard({ moment, currentUserId, onLike, onClick }: MomentCardProps) {
  const isLiked = moment.likes.includes(currentUserId);
  const energyStyle = ENERGY_COLORS[moment.energyLevel] || ENERGY_COLORS.medium;
  const moodIcon = moment.mood ? (MOOD_ICONS[moment.mood] || MOOD_ICONS.default) : MOOD_ICONS.default;

  return (
    <Card
      variant="outlined"
      padding="md"
      interactive
      onClick={onClick}
      className="hover:shadow-md transition-shadow duration-200"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            {moment.authorAvatar ? (
              <img
                src={moment.authorAvatar}
                alt={moment.authorName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                <span className="text-white font-medium">
                  {moment.authorName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Author info */}
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {moment.authorName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatRelativeTime(moment.timestamp)}
              </p>
            </div>
          </div>

          {/* Mood & Energy */}
          <div className="flex items-center gap-2">
            {moment.mood && (
              <span className="text-xl" title={moment.mood}>
                {moodIcon}
              </span>
            )}
            <span
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                energyStyle.bg,
                energyStyle.text
              )}
            >
              {energyStyle.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
          {moment.content}
        </p>

        {/* Photos */}
        {moment.photos && moment.photos.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {moment.photos.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Moment photo ${idx + 1}`}
                className="rounded-lg object-cover w-full h-32"
              />
            ))}
          </div>
        )}

        {/* Footer - Likes */}
        <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className={cn(
              'flex items-center gap-1.5 text-sm transition-colors duration-200',
              isLiked
                ? 'text-red-500'
                : 'text-slate-500 hover:text-red-500 dark:text-slate-400'
            )}
          >
            <motion.span
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {isLiked ? '❤️' : '🤍'}
            </motion.span>
            <span>{moment.likes.length}</span>
          </button>

          {/* Comment count (placeholder) */}
          <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-500 dark:text-slate-400">
            <span>💬</span>
            <span>Comment</span>
          </button>
        </div>
      </div>
    </Card>
  );
}

export default MomentWall;
