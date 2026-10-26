import type { HabitLog } from '../types/footprint';

interface HomeViewProps {
  logs: HabitLog[];
}

export function HomeView({ logs }: HomeViewProps) {
  const today = new Date().toISOString().split('T')[0];
  const todaysLogs = logs.filter((log) => log.date === today);
  const todaysImpact = todaysLogs.reduce((total, log) => total + log.co2Kg, 0);

  return (
    <main className="page-content">
      <section className="page-heading">
        <p className="eyebrow">Your personal climate journal</p>
        <h1>A lighter footprint, one day at a time.</h1>
        <p className="page-intro">Small choices add up. Keep an eye on your habits and see where your impact comes from.</p>
      </section>

      <section className="metric-grid" aria-label="Your impact summary">
        <article className="metric-card metric-card--mint">
          <p className="metric-label">Today&apos;s impact</p>
          <p className="metric-value">{todaysImpact.toFixed(1)} <span>kg CO₂e</span></p>
          <p className="metric-note">Across {todaysLogs.length} {todaysLogs.length === 1 ? 'logged habit' : 'logged habits'}</p>
        </article>
        <article className="metric-card metric-card--sky">
          <p className="metric-label">Weekly goal</p>
          <p className="metric-value metric-value--status">On track</p>
          <p className="metric-note">Keep building mindful routines</p>
        </article>
      </section>

      <section className="activity-section" aria-labelledby="today-activity-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A look at today</p>
            <h2 id="today-activity-heading">Recent activity</h2>
          </div>
          <span className="entry-count">{todaysLogs.length} {todaysLogs.length === 1 ? 'entry' : 'entries'}</span>
        </div>
        {todaysLogs.length > 0 ? (
          <ul className="activity-list">
            {todaysLogs.map((log) => (
              <li key={log.id} className="activity-row">
                <div className="activity-copy">
                  <p className="activity-title">{log.description}</p>
                  <span className="category-tag">{log.category}</span>
                </div>
                <span className="activity-value">{log.co2Kg} kg CO₂e</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No habits logged today yet. Your daily activity will show up here.</p>
        )}
      </section>
    </main>
  );
}