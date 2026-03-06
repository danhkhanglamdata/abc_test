import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Moments from '@/pages/Moments';
import Energy from '@/pages/Energy';
import Wheel from '@/pages/Wheel';
import Polls from '@/pages/Polls';
import QA from '@/pages/QA';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import EventManagement from '@/pages/admin/EventManagement';
import FlowBuilder from '@/pages/admin/FlowBuilder';
import { initializeMockData } from '@/data/mockData';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize mock data on app load
    initializeMockData();
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EventBoard...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Main routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/moments" element={<Moments />} />
          <Route path="/energy" element={<Energy />} />
          <Route path="/wheel" element={<Wheel />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/qa" element={<QA />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<EventManagement />} />
          <Route path="/admin/flow-builder" element={<FlowBuilder />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
