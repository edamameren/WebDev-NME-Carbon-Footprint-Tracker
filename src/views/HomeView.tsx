import type { HabitLog } from '../types/footprint';

interface HomeViewProps {
  logs: HabitLog[];
}

export function HomeView({ logs }: HomeViewProps) {
  const today = new Date().toISOString().split('T')[0];
  const todaysLogs = logs.filter((log) => log.date === today);
  const todaysImpact = todaysLogs.reduce((total, log) => total + log.co2Kg, 0);

    return (
      <div className="p-8 max-w-4xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-4">🌱 Personal Carbon Footprint Tracker</h1>
        <p className="text-gray-600 mb-6">
          Welcome! Track your daily habits, monitor your estimated carbon emissions over time, and build sustainable routines.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 text-lg">Today's Impact</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{todaysImpact.toFixed(1)} kg <span className="text-sm font-normal text-gray-600">CO₂e</span></p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 text-lg">Weekly Goal</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">On Track</p>
          </div>
        </div>

        <section className="mt-8" aria-labelledby="today-activity-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="today-activity-heading" className="text-xl font-semibold">Today&apos;s activity</h2>
            <span className="text-sm text-gray-600">{todaysLogs.length} {todaysLogs.length === 1 ? 'entry' : 'entries'}</span>
          </div>
          {todaysLogs.length > 0 ? (
            <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
              {todaysLogs.map((log) => (
                <li key={log.id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium text-gray-900">{log.description}</p>
                    <p className="text-sm text-gray-600">{log.category}</p>
                  </div>
                  <span className="shrink-0 font-semibold text-emerald-700">{log.co2Kg} kg CO₂e</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-600">
              No habits logged today yet.
            </p>
          )}
        </section>
      </div>
    );
  }