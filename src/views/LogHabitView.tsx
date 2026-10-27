import { useMemo, useState } from 'react';
import type { EmissionFactor, HabitLog, NewHabitLog } from '../types/footprint';

interface LogHabitViewProps {
  logs: HabitLog[];
  factors: EmissionFactor[];
  onAddLog: (log: NewHabitLog) => Promise<void>;
}

export function LogHabitView({ logs, factors, onAddLog }: LogHabitViewProps) {
  const [category, setCategory] = useState('');
  const [factorId, setFactorId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => [...new Set(factors.map((f) => f.category))], [factors]);
  const activeCategory = categories.includes(category) ? category : (categories[0] ?? '');
  const categoryFactors = factors.filter((f) => f.category === activeCategory);
  const factor = categoryFactors.find((f) => f.id === factorId) ?? categoryFactors[0];

  const qty = parseFloat(quantity);
  const hasValidQty = Number.isFinite(qty) && qty > 0;
  const co2Kg =
    factor && hasValidQty ? Math.round(qty * factor.kgCo2ePerUnit * 100) / 100 : 0;

  if (factors.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Log Daily Habit</h2>
        <p className="text-gray-600">
          No emission factors found. Import the emission_factors data into Supabase first.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factor || submitting) return;

    if (!hasValidQty) {
      setError('Enter an amount greater than 0.');
      return;
    }
    if (co2Kg < 0.01) {
      setError('That amount is too small to record. Try a larger amount.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onAddLog({
        category: factor.category,
        description: description.trim() || factor.activity,
        co2Kg,
        factorId: factor.id,
        quantity: qty,
      });
      setQuantity('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save entry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Log Daily Habit</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow border">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={activeCategory}
            onChange={(e) => {
              setCategory(e.target.value);
              setFactorId('');
            }}
            className="mt-1 block w-full p-2 border rounded-md"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
            Activity
          </label>
          <select
            id="activity"
            value={factor?.id ?? ''}
            onChange={(e) => setFactorId(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
          >
            {categoryFactors.map((f) => (
              <option key={f.id} value={f.id}>
                {f.activity} ({f.unit})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Amount{factor ? ` (${factor.unit})` : ''}
          </label>
          <input
            id="quantity"
            type="number"
            step="any"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
          />
          {hasValidQty && factor && (
            <p className="mt-1 text-sm text-gray-600">
              ≈ {co2Kg.toFixed(2)} kg CO₂
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Note (optional)
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Heated the house this week"
            className="mt-1 block w-full p-2 border rounded-md"
          />
        </div>

        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Add Log Entry'}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Recorded Entries (Stateful List)</h3>
        <ul className="space-y-2">
          {logs.map((log) => (
            <li key={log.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
              <div>
                <span className="font-medium">{log.description}</span>
                <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">{log.category}</span>
              </div>
              <span className="font-semibold text-emerald-600">{log.co2Kg} kg CO₂</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}