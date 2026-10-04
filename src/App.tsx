import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { HomeView } from './views/HomeView';
import { LogHabitView } from './views/LogHabitView';
import { AnalyticsView } from './views/AnalyticsView';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/log" element={<LogHabitView />} />
          <Route path="/analytics" element={<AnalyticsView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;