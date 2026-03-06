import { motion } from 'framer-motion';
import { Card, Button } from '@/components/common';

// Flow Builder Page
// This is a placeholder for the Flow Builder feature
// Real implementation would use React Flow for creating event flows

export function FlowBuilder() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flow Builder</h1>
          <p className="text-gray-500 mt-1">
            Create and manage event flows with visual automation
          </p>
        </div>
        <Button>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Flow
        </Button>
      </div>

      {/* Coming Soon Banner */}
      <Card className="p-12 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-6xl mb-6">🔧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Flow Builder Coming Soon
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            We're building a powerful visual flow builder that will let you create
            automated event sequences, triggers, and interactive experiences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-1">Triggers</h3>
              <p className="text-sm text-gray-500">
                Set up time-based and action-based triggers
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🔗</div>
              <h3 className="font-semibold text-gray-900 mb-1">Sequences</h3>
              <p className="text-sm text-gray-500">
                Connect activities in visual flowcharts
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-1">Automation</h3>
              <p className="text-sm text-gray-500">
                Automate recurring event patterns
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="secondary">
              Learn More
            </Button>
            <Button>
              Join Waitlist
            </Button>
          </div>
        </motion.div>
      </Card>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What You Can Do
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-600">Create visual flowcharts for event sequences</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-600">Set up conditional logic and branching</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-600">Trigger automated actions based on user activity</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-600">Integrate with external services via webhooks</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Example Flows
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-medium text-gray-900">Welcome Flow</p>
              <p className="text-sm text-gray-500">Event Start → Welcome Message → Quick Poll</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-medium text-gray-900">Engagement Booster</p>
              <p className="text-sm text-gray-500">After 30 min → Energy Check → Spin Wheel</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-medium text-gray-900">Closing Sequence</p>
              <p className="text-sm text-gray-500">Last 15 min → Q&A Summary → Thank You</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default FlowBuilder;
