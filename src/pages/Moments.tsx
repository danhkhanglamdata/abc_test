import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMomentStore } from '@/stores';
import { MomentWall } from '@/components/features/moments';
import { Card, Button, Modal } from '@/components/common';

// Add Moment Form
function AddMomentForm({ onClose }: { onClose: () => void }) {
  const { addMoment } = useMomentStore();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newMoment = {
      id: crypto.randomUUID(),
      eventId: 'current-event',
      authorId: 'user-1',
      authorName: 'Attendee',
      content: content.trim(),
      timestamp: new Date(),
      energyLevel: 'medium' as const,
      mood: mood || undefined,
      likes: [],
      createdAt: new Date(),
    };

    addMoment(newMoment);
    onClose();
    setContent('');
    setMood('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What's happening?
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share a special moment..."
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mood (optional)
        </label>
        <div className="flex gap-2 flex-wrap">
          {['Happy', 'Excited', 'Grateful', 'Inspired', 'Celebrating'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                mood === m
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!content.trim()}>
          Share Moment
        </Button>
      </div>
    </form>
  );
}

// Moments page component
export function Moments() {
  const { moments } = useMomentStore();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moments</h1>
          <p className="text-gray-500 mt-1">
            Capture and share special moments from the event
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Moment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{moments.length}</p>
            <p className="text-sm text-gray-500">Total Moments</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {moments.reduce((sum, m) => sum + m.likes.length, 0)}
            </p>
            <p className="text-sm text-gray-500">Total Likes</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {moments.filter(m => m.photos && m.photos.length > 0).length}
            </p>
            <p className="text-sm text-gray-500">With Photos</p>
          </div>
        </Card>
      </div>

      {/* Moment Wall */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <MomentWall />
      </motion.div>

      {/* Add Moment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Share a Moment"
      >
        <AddMomentForm onClose={() => setShowAddModal(false)} />
      </Modal>
    </div>
  );
}

export default Moments;
