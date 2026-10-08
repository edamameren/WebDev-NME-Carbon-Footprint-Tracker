import type { HabitLog } from '../types/footprint';
import { aggregateCo2ByCategory, type CategoryTotal } from '../utils/aggregateByCategory';
import './CategoryPieChart.css';

const CATEGORY_COLORS: Record<string, string> = {
  Transport: '#0ea5e9',
  Energy: '#f59e0b',
  Diet: '#10b981',
  Waste: '#8b5cf6',
};

const FALLBACK_COLOR = '#6b7280';

function colorForCategory(category: string): string {
  return CATEGORY_COLORS[category] ?? FALLBACK_COLOR;
}

function buildConicGradient(slices: CategoryTotal[], grandTotal: number): string {
  let cursor = 0;
  const stops = slices.map(({ category, totalKg }) => {
    const start = cursor;
    const end = cursor + (totalKg / grandTotal) * 100;
    cursor = end;
    return `${colorForCategory(category)} ${start}% ${end}%`;
  });

  return `conic-gradient(${stops.join(', ')})`;
}

interface CategoryPieChartProps {
  logs: HabitLog[];
}

export function CategoryPieChart({ logs }: CategoryPieChartProps) {
  const totals = aggregateCo2ByCategory(logs);
  const grandTotal = totals.reduce((sum, item) => sum + item.totalKg, 0);

  if (logs.length === 0 || grandTotal === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No habit logs yet. Add entries on the Log Habit page to see a category breakdown.
      </p>
    );
  }

  return (
    <div className="category-pie">
      <div
        className="category-pie__chart"
        style={{ background: buildConicGradient(totals, grandTotal) }}
        role="img"
        aria-label="Pie chart of carbon emissions by category"
      >
        <div className="category-pie__hole">
          <span className="category-pie__total">{grandTotal.toFixed(1)}</span>
          <span className="category-pie__unit">kg CO₂</span>
        </div>
      </div>

      <ul className="category-pie__legend">
        {totals.map(({ category, totalKg }) => {
          const percent = (totalKg / grandTotal) * 100;

          return (
            <li key={category} className="category-pie__legend-item">
              <span className="category-pie__label">
                <span
                  className="category-pie__swatch"
                  style={{ backgroundColor: colorForCategory(category) }}
                  aria-hidden="true"
                />
                {category}
              </span>
              <span className="category-pie__value">
                {totalKg.toFixed(1)} kg · {percent.toFixed(0)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
