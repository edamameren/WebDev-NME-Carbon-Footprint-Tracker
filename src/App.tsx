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

  const handleUpdateLog = (updatedLog: HabitLog) => {
    setLogs((current) => current.map((log) => log.id === updatedLog.id ? updatedLog : log));
  };

  const handleDeleteLog = (id: string) => {
    setLogs((current) => current.filter((log) => log.id !== id));
  };

  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeView logs={logs} />} />
          <Route
            path="/log"
            element={
              <LogHabitView
                logs={logs}
                onAddLog={handleAddLog}
                onUpdateLog={handleUpdateLog}
                onDeleteLog={handleDeleteLog}
              />
            }
          />
          <Route path="/analytics" element={<AnalyticsView logs={logs} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
