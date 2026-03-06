import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, EventPage, DisplayMode } from '@/pages/event';
import { EventForm } from '@/components/event';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<EventForm />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/event/:id/edit" element={<EventForm />} />
        <Route path="/event/:id/display" element={<DisplayMode />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
