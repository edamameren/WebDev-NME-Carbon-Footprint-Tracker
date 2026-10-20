import type { HabitLog } from '../types/footprint';
import { CategoryPieChart } from '../components/CategoryPieChart';

interface AnalyticsViewProps {
  logs: HabitLog[];
}

export function AnalyticsView({ logs }: AnalyticsViewProps) {
  return (
    <main className="page-content">
      <section className="page-heading">
        <p className="eyebrow">Patterns over time</p>
        <h1>Your footprint, by category</h1>
        <p className="page-intro">See which parts of your routine contribute most to your estimated emissions.</p>
      </section>

      <section className="analytics-panel" aria-labelledby="category-breakdown-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">All recorded entries</p>
            <h2 id="category-breakdown-heading">Emissions by category</h2>
          </div>
        </div>
        <CategoryPieChart logs={logs} />
      </section>
    </main>
  );
}
