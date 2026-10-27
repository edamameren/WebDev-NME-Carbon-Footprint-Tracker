import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { HomeView } from './views/HomeView';
import { LogHabitView } from './views/LogHabitView';
import { AnalyticsView } from './views/AnalyticsView';
import { supabase } from './lib/supabase';
import type { EmissionFactor, HabitLog, NewHabitLog } from './types/footprint';

const LOG_COLUMNS = 'id, category, description, co2_kg, log_date';
const FACTOR_COLUMNS = 'id, category, activity, unit, kg_co2e_per_unit';

type HabitLogRow = {
  id: string;
  category: string;
  description: string;
  co2_kg: number | string;
  log_date: string;
};

type EmissionFactorRow = {
  id: string;
  category: string;
  activity: string;
  unit: string;
  kg_co2e_per_unit: number | string;
};

const toHabitLog = (r: HabitLogRow): HabitLog => ({
  id: r.id,
  category: r.category,
  description: r.description,
  co2Kg: Number(r.co2_kg),
  date: r.log_date,
});

const toEmissionFactor = (r: EmissionFactorRow): EmissionFactor => ({
  id: r.id,
  category: r.category,
  activity: r.activity,
  unit: r.unit,
  kgCo2ePerUnit: Number(r.kg_co2e_per_unit),
});

export function App() {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [factors, setFactors] = useState<EmissionFactor[]>([]);
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

      const [logsRes, factorsRes] = await Promise.all([
        supabase
          .from('habit_logs')
          .select(LOG_COLUMNS)
          .order('log_date', { ascending: false })
          .order('created_at', { ascending: false }),
        supabase
          .from('emission_factors')
          .select(FACTOR_COLUMNS)
          .order('category')
          .order('activity'),
      ]);

      if (cancelled) return;

      const firstError = logsRes.error ?? factorsRes.error;
      if (firstError) {
        setLoadError(firstError.message);
      } else {
        setLogs((logsRes.data as HabitLogRow[]).map(toHabitLog));
        setFactors((factorsRes.data as EmissionFactorRow[]).map(toEmissionFactor));
      }
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
        factor_id: log.factorId,
        quantity: log.quantity,
      })
      .select(LOG_COLUMNS)
      .single();

    if (error) throw new Error(error.message);
    setLogs((current) => [toHabitLog(data as HabitLogRow), ...current]);
  };

  if (loading) {
    return <p className="p-8 text-gray-600">Loading…</p>;
  }

  if (loadError) {
    return (
      <p role="alert" className="p-8 text-red-600">
        Could not load your data: {loadError}
      </p>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeView logs={logs} />} />
          <Route
            path="/log"
            element={<LogHabitView logs={logs} factors={factors} onAddLog={handleAddLog} />}
          />
          <Route path="/analytics" element={<AnalyticsView logs={logs} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;