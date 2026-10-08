import type { HabitLog } from '../types/footprint';
import { CategoryPieChart } from '../components/CategoryPieChart';

interface AnalyticsViewProps {
  logs: HabitLog[];
}

export function AnalyticsView({ logs }: AnalyticsViewProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Footprint Analytics</h2>
      <p className="text-gray-600 mb-6">Explore your historical carbon emission trends over time.</p>

      <div className="p-6 bg-white rounded-lg shadow border">
        <h3 className="font-semibold text-gray-800 mb-4">Emissions by Category</h3>
        <CategoryPieChart logs={logs} />
      </div>
    </div>
  );
}
