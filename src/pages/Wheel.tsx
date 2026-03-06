import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWheelStore } from '@/stores';
import { LuckyWheel } from '@/components/features/wheel';
import { Card, Button, Modal } from '@/components/common';
import type { WheelItem } from '@/types';

// Add Wheel Item Form
function AddWheelItemForm({ onClose }: { onClose: () => void }) {
  const { setWheelItems, wheelItems } = useWheelStore();
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#9333ea');

  const colors = ['#9333ea', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const newItem: WheelItem = {
      id: crypto.randomUUID(),
      label: label.trim(),
      color,
    };

    setWheelItems([...wheelItems, newItem]);
    onClose();
    setLabel('');
    setColor('#9333ea');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prize Label
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Free Drink, T-Shirt, Discount..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full transition-transform ${
                color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!label.trim()}>
          Add Prize
        </Button>
      </div>
    </form>
  );
}

// Winner Display
function WinnerDisplay({ winner, onClose }: { winner: WheelItem | null; onClose: () => void }) {
  if (!winner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="text-center py-8"
    >
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h3>
      <p className="text-gray-600 mb-4">The winner is:</p>
      <div
        className="inline-block px-6 py-3 rounded-xl text-white text-xl font-bold"
        style={{ backgroundColor: winner.color }}
      >
        {winner.label}
      </div>
      <div className="mt-6">
        <Button onClick={onClose}>Close</Button>
      </div>
    </motion.div>
  );
}

// Wheel page component
export function Wheel() {
  const { wheelItems, isSpinning, lastWinner, spinWheel, setWheelItems } = useWheelStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  const handleSpin = () => {
    if (wheelItems.length < 2) return;
    spinWheel();
    // Simulate spin completion
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * wheelItems.length);
      // Update last winner in store
      setWheelItems(wheelItems.map((item, i) =>
        i === randomIndex ? { ...item } : item
      ));
      setShowWinner(true);
    }, 3000);
  };

  const handleRemoveItem = (id: string) => {
    setWheelItems(wheelItems.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lucky Wheel</h1>
          <p className="text-gray-500 mt-1">
            Spin the wheel to pick a winner
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Prize
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wheel Section */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {wheelItems.length < 2 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🎡</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Prizes to Spin</h3>
                <p className="text-gray-500 mb-4">
                  You need at least 2 prizes to spin the wheel
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  Add Your First Prize
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <LuckyWheel
                  items={wheelItems}
                  onSpinEnd={(_winner) => {
                    // The component handles the winner display internally
                  }}
                />
                <div className="mt-6">
                  <Button
                    onClick={handleSpin}
                    disabled={isSpinning || wheelItems.length < 2}
                    size="lg"
                    className="px-8"
                  >
                    {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Prizes List */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prizes ({wheelItems.length})</h3>
            {wheelItems.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {wheelItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-gray-700">{item.label}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                      disabled={isSpinning}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No prizes added yet.</p>
            )}
          </Card>

          {/* Stats */}
          <Card className="p-6 mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Prizes</span>
                <span className="font-semibold text-gray-900">{wheelItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Spins</span>
                <span className="font-semibold text-gray-900">{lastWinner ? 1 : 0}</span>
              </div>
              {lastWinner && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Winner</span>
                  <span
                    className="font-semibold"
                    style={{ color: lastWinner.color }}
                  >
                    {lastWinner.label}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Prize Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Prize"
      >
        <AddWheelItemForm onClose={() => setShowAddModal(false)} />
      </Modal>

      {/* Winner Modal */}
      <Modal
        isOpen={showWinner}
        onClose={() => setShowWinner(false)}
        title=""
      >
        <AnimatePresence mode="wait">
          <WinnerDisplay
            winner={lastWinner}
            onClose={() => setShowWinner(false)}
          />
        </AnimatePresence>
      </Modal>
    </div>
  );
}

export default Wheel;
