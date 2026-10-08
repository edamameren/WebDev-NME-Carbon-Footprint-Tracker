import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { HomeView } from './views/HomeView';
import { LogHabitView } from './views/LogHabitView';
import { AnalyticsView } from './views/AnalyticsView';
import type { HabitLog } from './types/footprint';

const INITIAL_LOGS: HabitLog[] = [
  { id: '1', category: 'Transport', description: 'Public Transit Bus', co2Kg: 2.1, date: '2026-10-04' },
];

export function App() {
  const [logs, setLogs] = useState<HabitLog[]>(INITIAL_LOGS);

  const handleAddLog = (log: HabitLog) => {
    setLogs((current) => [log, ...current]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/log" element={<LogHabitView logs={logs} onAddLog={handleAddLog} />} />
          <Route path="/analytics" element={<AnalyticsView logs={logs} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
