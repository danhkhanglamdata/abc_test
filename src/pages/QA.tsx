import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQAStore } from '@/stores';
import { Card, Button, Modal } from '@/components/common';
import type { Question } from '@/types';

// Ask Question Form
function AskQuestionForm({ onClose }: { onClose: () => void }) {
  const { addQuestion } = useQAStore();
  const [questionText, setQuestionText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const newQuestion: Question = {
      id: crypto.randomUUID(),
      eventId: 'current-event',
      text: questionText.trim(),
      authorId: 'user-1',
      authorName: 'Attendee',
      upvotes: 0,
      upvotedBy: [],
      isAnswered: false,
      answers: [],
      createdAt: new Date(),
    };

    addQuestion(newQuestion);
    onClose();
    setQuestionText('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Question
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="What would you like to ask?"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!questionText.trim()}>
          Submit Question
        </Button>
      </div>
    </form>
  );
}

// QA page component
export function QA() {
  const { questions } = useQAStore();
  const [showAskModal, setShowAskModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unanswered' | 'answered'>('all');

  const allQuestions = [...questions].sort((a, b) => b.upvotes - a.upvotes);
  const unansweredQuestions = allQuestions.filter((q) => !q.isAnswered);
  const answeredQuestions = allQuestions.filter((q) => q.isAnswered);

  const displayedQuestions = activeTab === 'all'
    ? allQuestions
    : activeTab === 'unanswered'
    ? unansweredQuestions
    : answeredQuestions;

  // Calculate stats
  const totalQuestions = questions.length;
  const pendingQuestions = unansweredQuestions.length;
  const answeredCount = answeredQuestions.length;
  const totalUpvotes = questions.reduce((sum, q) => sum + q.upvotes, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Q&A</h1>
          <p className="text-gray-500 mt-1">
            Ask questions and get answers from the host
          </p>
        </div>
        <Button onClick={() => setShowAskModal(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ask Question
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{totalQuestions}</p>
            <p className="text-sm text-gray-500">Total Questions</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{pendingQuestions}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{answeredCount}</p>
            <p className="text-sm text-gray-500">Answered</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{totalUpvotes}</p>
            <p className="text-sm text-gray-500">Total Upvotes</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Questions ({allQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab('unanswered')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'unanswered'
              ? 'bg-yellow-100 text-yellow-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Unanswered ({unansweredQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab('answered')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'answered'
              ? 'bg-green-100 text-green-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Answered ({answeredQuestions.length})
        </button>
      </div>

      {/* Questions List */}
      <AnimatePresence mode="wait">
        {displayedQuestions.length > 0 ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {displayedQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => {}}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-gray-600">{question.upvotes}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{question.text}</h4>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <span>{question.authorName}</span>
                        <span>•</span>
                        <span>{new Date(question.createdAt).toLocaleTimeString()}</span>
                        {question.isAnswered && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">Answered</span>
                          </>
                        )}
                      </div>
                      {question.answers.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 border-gray-200">
                          {question.answers.map((answer) => (
                            <div key={answer.id} className="mt-2">
                              <p className="text-sm text-gray-700">{answer.text}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {answer.authorName} • {answer.isAccepted && <span className="text-green-600">Accepted</span>}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">❓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'all'
                ? 'No Questions Yet'
                : activeTab === 'unanswered'
                ? 'All Questions Answered!'
                : 'No Answered Questions'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'all'
                ? 'Be the first to ask a question!'
                : activeTab === 'unanswered'
                ? 'Great job! All questions have been answered.'
                : 'Questions with answers will appear here.'}
            </p>
            {activeTab === 'all' && (
              <Button onClick={() => setShowAskModal(true)}>
                Ask Your First Question
              </Button>
            )}
          </Card>
        )}
      </AnimatePresence>

      {/* Ask Question Modal */}
      <Modal
        isOpen={showAskModal}
        onClose={() => setShowAskModal(false)}
        title="Ask a Question"
      >
        <AskQuestionForm onClose={() => setShowAskModal(false)} />
      </Modal>
    </div>
  );
}

export default QA;
