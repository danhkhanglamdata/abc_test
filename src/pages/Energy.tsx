import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEnergyStore, useMomentStore } from '@/stores';
import { EnergyBar, type EnergyVoteLevel } from '@/components/features/energy';
import { Card, Button, Modal } from '@/components/common';
import type { EnergyLevel } from '@/types';

// Add Energy Vote Form
function AddEnergyVoteForm({ onClose }: { onClose: () => void }) {
  const { voteEnergy, energyLevels } = useEnergyStore();
  const { moments } = useMomentStore();
  const [selectedMomentId, setSelectedMomentId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<EnergyLevel | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMomentId || !selectedLevel) return;

    voteEnergy(selectedMomentId, selectedLevel);
    onClose();
    setSelectedMomentId('');
    setSelectedLevel('');
  };

  const levelColors: Record<EnergyLevel, string> = {
    low: 'bg-gray-400',
    medium: 'bg-yellow-400',
    high: 'bg-orange-500',
    peak: 'bg-red-500',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Moment
        </label>
        <select
          value={selectedMomentId}
          onChange={(e) => setSelectedMomentId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Choose a moment...</option>
          {moments.map((moment) => (
            <option key={moment.id} value={moment.id}>
              {moment.content.substring(0, 50)}...
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Energy Level
        </label>
        <div className="grid grid-cols-2 gap-2">
          {energyLevels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSelectedLevel(level as EnergyLevel)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedLevel === level
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${levelColors[level as EnergyLevel]}`} />
                <span className="capitalize font-medium">{level}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!selectedMomentId || !selectedLevel}>
          Vote Energy
        </Button>
      </div>
    </form>
  );
}

// Energy page component
export function Energy() {
  const { userVotes, energyLevels, voteEnergy } = useEnergyStore();
  const { moments } = useMomentStore();
  const [showVoteModal, setShowVoteModal] = useState(false);

  // Calculate energy distribution
  const energyCounts = energyLevels.reduce((acc, level) => {
    acc[level] = Object.values(userVotes).filter((v) => v === level).length;
    return acc;
  }, {} as Record<string, number>);

  const totalVotes = Object.values(energyCounts).reduce((a, b) => a + b, 0);

  const levelColors: Record<EnergyLevel, string> = {
    low: 'bg-gray-400',
    medium: 'bg-yellow-400',
    high: 'bg-orange-500',
    peak: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Energy</h1>
          <p className="text-gray-500 mt-1">
            Track the energy levels throughout your event
          </p>
        </div>
        <Button onClick={() => setShowVoteModal(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Vote Energy
        </Button>
      </div>

      {/* Energy Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 md:col-span-2 lg:col-span-1">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{totalVotes}</p>
            <p className="text-sm text-gray-500">Total Votes</p>
          </div>
        </Card>
        {energyLevels.map((level) => (
          <Card key={level} className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full ${levelColors[level as EnergyLevel]}`} />
                <p className="text-2xl font-bold text-gray-900">{energyCounts[level] || 0}</p>
              </div>
              <p className="text-sm text-gray-500 capitalize">{level}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Energy Distribution Bar */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Distribution</h3>
        <div className="h-8 bg-gray-100 rounded-full overflow-hidden flex">
          {energyLevels.map((level) => {
            const percentage = totalVotes > 0 ? ((energyCounts[level] || 0) / totalVotes) * 100 : 0;
            return (
              <motion.div
                key={level}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5 }}
                className={`${levelColors[level as EnergyLevel]} h-full`}
                title={`${level}: ${percentage.toFixed(1)}%`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          {energyLevels.map((level) => {
            const percentage = totalVotes > 0 ? ((energyCounts[level] || 0) / totalVotes) * 100 : 0;
            return (
              <div key={level} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${levelColors[level as EnergyLevel]}`} />
                <span className="capitalize">{level}: {percentage.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Energy Bar Component - shows a list of moments with their energy voting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vote on Moment Energy</h3>
          {moments.length > 0 ? (
            <div className="space-y-4">
              {moments.slice(0, 10).map((moment) => (
                <EnergyBar
                  key={moment.id}
                  momentId={moment.id}
                  userVote={userVotes[moment.id] as EnergyVoteLevel | undefined}
                  onVote={(id, level) => voteEnergy(id, level as EnergyLevel)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No moments to vote on yet.</p>
          )}
        </Card>
      </motion.div>

      {/* Recent Energy Votes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Energy Votes</h3>
        {moments.length > 0 ? (
          <div className="space-y-3">
            {moments.slice(0, 10).map((moment) => {
              const vote = userVotes[moment.id];
              return (
                <div key={moment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{moment.content}</p>
                    <p className="text-xs text-gray-500">{moment.authorName}</p>
                  </div>
                  {vote && (
                    <div className="flex items-center gap-2 ml-4">
                      <div className={`w-3 h-3 rounded-full ${levelColors[vote]}`} />
                      <span className="text-sm capitalize text-gray-600">{vote}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No moments to vote on yet.</p>
        )}
      </Card>

      {/* Vote Modal */}
      <Modal
        isOpen={showVoteModal}
        onClose={() => setShowVoteModal(false)}
        title="Vote Energy"
      >
        <AddEnergyVoteForm onClose={() => setShowVoteModal(false)} />
      </Modal>
    </div>
  );
}

export default Energy;
