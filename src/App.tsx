import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { HomeView } from './views/HomeView';
import { LogHabitView } from './views/LogHabitView';
import { AnalyticsView } from './views/AnalyticsView';
import { supabase } from './lib/supabase';
import type { HabitLog, NewHabitLog } from './types/footprint';

const COLUMNS = 'id, category, description, co2_kg, log_date';

type HabitLogRow = {
  id: string;
  category: string;
  description: string;
  co2_kg: number | string;
  log_date: string;
};

const toHabitLog = (r: HabitLogRow): HabitLog => ({
  id: r.id,
  category: r.category,
  description: r.description,
  co2Kg: Number(r.co2_kg),
  date: r.log_date,
});

export function App() {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
          if (!cancelled) {
            setLoadError(error.message);
            setLoading(false);
          }
          return;
        }
      }

      const { data, error } = await supabase
        .from('habit_logs')
        .select(COLUMNS)
        .order('log_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error) setLoadError(error.message);
      else setLogs((data as HabitLogRow[]).map(toHabitLog));
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddLog = async (log: NewHabitLog) => {
    const { data, error } = await supabase
      .from('habit_logs')
      .insert({
        category: log.category,
        description: log.description,
        co2_kg: log.co2Kg,
      })
      .select(COLUMNS)
      .single();

    if (error) throw new Error(error.message);
    setLogs((current) => [toHabitLog(data as HabitLogRow), ...current]);
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