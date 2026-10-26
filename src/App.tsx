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
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw new Error(sessionError.message);

        if (!session) {
          const { error } = await supabase.auth.signInAnonymously();
          if (error) throw new Error(error.message);
        }

        const { data, error } = await supabase
          .from('habit_logs')
          .select(COLUMNS)
          .order('log_date', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        if (!cancelled) setLogs((data as HabitLogRow[]).map(toHabitLog));
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Could not load habit entries.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
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

  const handleUpdateLog = async (log: HabitLog) => {
    const { data, error } = await supabase
      .from('habit_logs')
      .update({
        category: log.category,
        description: log.description,
        co2_kg: log.co2Kg,
      })
      .eq('id', log.id)
      .select(COLUMNS)
      .single();

    if (error) throw new Error(error.message);
    const updatedLog = toHabitLog(data as HabitLogRow);
    setLogs((current) => current.map((item) => item.id === updatedLog.id ? updatedLog : item));
  };

  const handleDeleteLog = async (id: string) => {
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('id', id)
      .select('id')
      .single();

    if (error) throw new Error(error.message);
    setLogs((current) => current.filter((log) => log.id !== id));
  };

  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        {loading && <p role="status">Loading your habit entries...</p>}
        {loadError && <p role="alert">Could not load your habit entries: {loadError}</p>}
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