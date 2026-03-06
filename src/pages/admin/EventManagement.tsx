import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEventStore } from '@/stores';
import { Card, Button, Modal } from '@/components/common';
import type { Event, EnergyLevel } from '@/types';

// Event Form Component
interface EventFormProps {
  event?: Event;
  onClose: () => void;
}

function EventForm({ event, onClose }: EventFormProps) {
  const { addEvent, setCurrentEvent } = useEventStore();
  const navigate = useNavigate();
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [location, setLocation] = useState(event?.location || '');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(event?.energyLevel || 'medium');
  const [startTime, setStartTime] = useState(
    event?.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : ''
  );
  const [endTime, setEndTime] = useState(
    event?.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime || !endTime) return;

    const newEvent: Event = {
      id: event?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      energyLevel,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      createdAt: event?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (event) {
      // Update existing event (would need updateEvent in store)
      console.log('Update event:', newEvent);
    } else {
      addEvent(newEvent);
    }

    setCurrentEvent(newEvent);
    onClose();
    navigate('/admin/dashboard');
  };

  const energyLevels: EnergyLevel[] = ['low', 'medium', 'high', 'peak'];
  const energyColors: Record<EnergyLevel, string> = {
    low: 'bg-gray-400',
    medium: 'bg-yellow-400',
    high: 'bg-orange-500',
    peak: 'bg-red-500',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your event"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Event location"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time *
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time *
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Energy Level
        </label>
        <div className="grid grid-cols-4 gap-2">
          {energyLevels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setEnergyLevel(level)}
              className={`p-3 rounded-lg border-2 transition-all ${
                energyLevel === level
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <div className={`w-4 h-4 rounded-full ${energyColors[level]}`} />
                <span className="capitalize text-sm font-medium">{level}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim() || !startTime || !endTime}>
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}

// Event Card Component
interface EventCardProps {
  event: Event;
  onSelect: () => void;
  onEdit: () => void;
}

function EventCard({ event, onSelect, onEdit }: EventCardProps) {
  const energyColors: Record<EnergyLevel, string> = {
    low: 'bg-gray-400',
    medium: 'bg-yellow-400',
    high: 'bg-orange-500',
    peak: 'bg-red-500',
  };

  const isUpcoming = new Date(event.startTime) > new Date();
  const isOngoing = new Date(event.startTime) <= new Date() && new Date(event.endTime) >= new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <div className={`w-3 h-3 rounded-full ${energyColors[event.energyLevel]}`} />
            </div>

            {event.description && (
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{event.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              {event.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(event.startTime).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isOngoing
                  ? 'bg-green-100 text-green-700'
                  : isUpcoming
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isOngoing ? 'Ongoing' : isUpcoming ? 'Upcoming' : 'Past'}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <Button variant="secondary" size="sm" onClick={onSelect}>
            Select
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// Event Management Page
export function EventManagement() {
  const navigate = useNavigate();
  const { events, currentEvent, setCurrentEvent } = useEventStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectEvent = (event: Event) => {
    setCurrentEvent(event);
    navigate('/admin/dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-500 mt-1">
            Create and manage your events
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Event
        </Button>
      </div>

      {/* Current Event Banner */}
      {currentEvent && (
        <Card className="p-4 bg-accent-50 border-accent-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent-600 font-medium">Currently Managing</p>
              <h3 className="text-lg font-semibold text-gray-900">{currentEvent.title}</h3>
            </div>
            <Button variant="secondary" onClick={() => navigate('/admin/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={() => handleSelectEvent(event)}
                onEdit={() => setEditingEvent(event)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No Events Found' : 'No Events Yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Create your first event to get started'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowCreateModal(true)}>
              Create Your First Event
            </Button>
          )}
        </Card>
      )}

      {/* Create Event Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Event"
        size="lg"
      >
        <EventForm onClose={() => setShowCreateModal(false)} />
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        title="Edit Event"
        size="lg"
      >
        {editingEvent && (
          <EventForm
            event={editingEvent}
            onClose={() => setEditingEvent(null)}
          />
        )}
      </Modal>
    </div>
  );
}

export default EventManagement;
