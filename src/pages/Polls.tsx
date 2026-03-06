import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePollStore } from '@/stores';
import { Card, Button, Modal } from '@/components/common';
import type { Poll } from '@/types';

// Create Poll Form
function CreatePollForm({ onClose }: { onClose: () => void }) {
  const { createPoll } = usePollStore();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    const validOptions = options.filter((o) => o.trim());
    if (validOptions.length < 2) return;

    const newPoll: Poll = {
      id: crypto.randomUUID(),
      eventId: 'current-event',
      question: question.trim(),
      options: validOptions.map((text) => ({
        id: crypto.randomUUID(),
        text: text.trim(),
        voteCount: 0,
      })),
      isActive: true,
      createdAt: new Date(),
      votes: {},
    };

    createPoll(newPoll);
    onClose();
    setQuestion('');
    setOptions(['', '']);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What would you like to ask?"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options
        </label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 6 && (
          <button
            type="button"
            onClick={handleAddOption}
            className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Option
          </button>
        )}
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!question.trim() || options.filter((o) => o.trim()).length < 2}
        >
          Create Poll
        </Button>
      </div>
    </form>
  );
}

// Polls page component
export function Polls() {
  const { polls } = usePollStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');

  const activePolls = polls.filter((p) => p.isActive);
  const closedPolls = polls.filter((p) => !p.isActive);
  const displayedPolls = activeTab === 'active' ? activePolls : closedPolls;

  // Calculate stats
  const totalVotes = polls.reduce((acc, poll) => {
    return acc + poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Polls</h1>
          <p className="text-gray-500 mt-1">
            Create and manage polls to engage your audience
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Poll
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{polls.length}</p>
            <p className="text-sm text-gray-500">Total Polls</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{activePolls.length}</p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-600">{closedPolls.length}</p>
            <p className="text-sm text-gray-500">Closed</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{totalVotes}</p>
            <p className="text-sm text-gray-500">Total Votes</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Active Polls ({activePolls.length})
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'closed'
              ? 'bg-gray-100 text-gray-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Closed Polls ({closedPolls.length})
        </button>
      </div>

      {/* Polls List */}
      <AnimatePresence mode="wait">
        {displayedPolls.length > 0 ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {displayedPolls.map((poll, index) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);
              return (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{poll.question}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        poll.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {poll.isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {poll.options.map((option) => {
                        const percentage = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0;
                        return (
                          <div key={option.id} className="relative">
                            <div
                              className="absolute h-full bg-primary-100 rounded-md"
                              style={{ width: `${percentage}%` }}
                            />
                            <div className="relative flex items-center justify-between px-3 py-2">
                              <span className="text-sm text-gray-700">{option.text}</span>
                              <span className="text-sm text-gray-500">{option.voteCount} votes ({percentage}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-sm text-gray-500 mt-3">{totalVotes} total votes</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'active' ? 'No Active Polls' : 'No Closed Polls'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'active'
                ? 'Create a poll to start engaging your audience'
                : 'Closed polls will appear here'}
            </p>
            {activeTab === 'active' && (
              <Button onClick={() => setShowCreateModal(true)}>
                Create Your First Poll
              </Button>
            )}
          </Card>
        )}
      </AnimatePresence>

      {/* Create Poll Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Poll"
        size="lg"
      >
        <CreatePollForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
}

export default Polls;
