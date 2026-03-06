import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEventStore, useMomentStore, useEnergyStore, useWheelStore, usePollStore, useQAStore } from '@/stores';
import { Card, Button } from '@/components/common';

// Stat card component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  onClick?: () => void;
}

function StatCard({ title, value, icon, color, trend, onClick }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 mt-1">{trend}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Events Icon
function EventsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

// Moments Icon
function MomentsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// Energy Icon
function EnergyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

// Poll Icon
function PollIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

// QA Icon
function QAIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// Wheel Icon
function WheelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

// Users Icon
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

// Admin Dashboard page component
export function AdminDashboard() {
  const navigate = useNavigate();
  const { currentEvent, events } = useEventStore();
  const { moments } = useMomentStore();
  const { userVotes } = useEnergyStore();
  const { wheelItems } = useWheelStore();
  const { polls } = usePollStore();
  const { questions } = useQAStore();

  // Calculate stats
  const totalMoments = moments.length;
  const totalEnergyVotes = Object.keys(userVotes).length;
  const totalPollVotes = polls.reduce((acc, poll) => {
    return acc + poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);
  }, 0);
  const totalQuestions = questions.length;
  const pendingQuestions = questions.filter(q => !q.isAnswered).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage your events and monitor engagement
          </p>
        </div>
        <Button onClick={() => navigate('/admin/events/new')}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Event
        </Button>
      </div>

      {/* Event Info Banner */}
      {currentEvent ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent-600 to-primary-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{currentEvent.title}</h2>
              {currentEvent.description && (
                <p className="text-accent-100 mt-1">{currentEvent.description}</p>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm">
                {currentEvent.location && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {currentEvent.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(currentEvent.startTime).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/admin/events')}
              className="bg-white/20 text-white hover:bg-white/30 border-0"
            >
              Manage Event
            </Button>
          </div>
        </motion.div>
      ) : (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-yellow-800">No Event Selected</h3>
              <p className="text-yellow-600 text-sm mt-1">
                Create or select an event to get started
              </p>
            </div>
            <Button onClick={() => navigate('/admin/events/new')}>
              Create Event
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={events.length}
          icon={<EventsIcon className="w-6 h-6 text-accent-600" />}
          color="bg-accent-100"
          onClick={() => navigate('/admin/events')}
        />
        <StatCard
          title="Moments"
          value={totalMoments}
          icon={<MomentsIcon className="w-6 h-6 text-pink-500" />}
          color="bg-pink-100"
          onClick={() => navigate('/admin/moments')}
        />
        <StatCard
          title="Energy Votes"
          value={totalEnergyVotes}
          icon={<EnergyIcon className="w-6 h-6 text-yellow-500" />}
          color="bg-yellow-100"
          onClick={() => navigate('/admin/energy')}
        />
        <StatCard
          title="Active Polls"
          value={polls.filter(p => p.isActive).length}
          icon={<PollIcon className="w-6 h-6 text-blue-500" />}
          color="bg-blue-100"
          onClick={() => navigate('/admin/poll')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Questions"
          value={totalQuestions}
          icon={<QAIcon className="w-6 h-6 text-purple-500" />}
          color="bg-purple-100"
          onClick={() => navigate('/admin/qa')}
        />
        <StatCard
          title="Pending Answers"
          value={pendingQuestions}
          icon={<QAIcon className="w-6 h-6 text-yellow-500" />}
          color="bg-yellow-100"
          onClick={() => navigate('/admin/qa')}
        />
        <StatCard
          title="Wheel Prizes"
          value={wheelItems.length}
          icon={<WheelIcon className="w-6 h-6 text-green-500" />}
          color="bg-green-100"
          onClick={() => navigate('/admin/wheel')}
        />
        <StatCard
          title="Total Poll Votes"
          value={totalPollVotes}
          icon={<PollIcon className="w-6 h-6 text-blue-500" />}
          color="bg-blue-100"
          onClick={() => navigate('/admin/poll')}
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/admin/events/new')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-accent-300 hover:bg-accent-50 transition-colors"
          >
            <EventsIcon className="w-6 h-6 text-accent-500" />
            <span className="text-sm font-medium text-gray-700">New Event</span>
          </button>
          <button
            onClick={() => navigate('/admin/wheel')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <WheelIcon className="w-6 h-6 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Manage Wheel</span>
          </button>
          <button
            onClick={() => navigate('/admin/poll')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <PollIcon className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Create Poll</span>
          </button>
          <button
            onClick={() => navigate('/admin/participants')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <UsersIcon className="w-6 h-6 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Participants</span>
          </button>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Questions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Questions</h3>
            <button
              onClick={() => navigate('/admin/qa')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View All
            </button>
          </div>
          {questions.length > 0 ? (
            <div className="space-y-3">
              {questions.slice(0, 5).map((question) => (
                <div key={question.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{question.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{question.authorName}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className={`text-xs ${question.isAnswered ? 'text-green-600' : 'text-yellow-600'}`}>
                        {question.isAnswered ? 'Answered' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="text-xs">{question.upvotes}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No questions yet.</p>
          )}
        </Card>

        {/* Recent Moments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Moments</h3>
            <button
              onClick={() => navigate('/admin/moments')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View All
            </button>
          </div>
          {moments.length > 0 ? (
            <div className="space-y-3">
              {moments.slice(0, 5).map((moment) => (
                <div key={moment.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-medium">
                      {moment.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{moment.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {moment.authorName} - {new Date(moment.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-xs">{moment.likes.length}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No moments yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
