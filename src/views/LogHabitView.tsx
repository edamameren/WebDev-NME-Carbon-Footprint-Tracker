import { useMemo, useState } from 'react';
import type { EmissionFactor, HabitLog, NewHabitLog } from '../types/footprint';

interface LogHabitViewProps {
  logs: HabitLog[];
  factors: EmissionFactor[];
  onAddLog: (log: NewHabitLog) => Promise<void>;
}

function categoryClass(category: string): string {
  return category.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
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

  if (factors.length === 0) {
    return (
      <main className="page-content page-content--narrow">
        <section className="page-heading">
          <p className="eyebrow">Make mindful choices visible</p>
          <h1>Log a daily habit</h1>
          <p className="page-intro">
            No emission factors found yet. Add the emission factor data to Supabase to start logging.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-content page-content--wide">
      <section className="page-heading log-page-heading">
        <p className="eyebrow">A little more awareness, every day</p>
        <h1>Log a daily habit</h1>
        <p className="page-intro">
          Capture the things you do and get a simple estimate of their climate impact.
        </p>
      </section>

      <div className="log-layout">
        <form onSubmit={handleSubmit} className="habit-form habit-form--log">
          <div className="form-step-heading">
            <span className="form-step-number">01</span>
            <div>
              <p className="form-step-title">Tell us about it</p>
              <p className="form-step-note">Choose an activity and add a little detail.</p>
            </div>
          </div>

          <fieldset className="form-field category-field">
            <legend>Category</legend>
            <div className="category-options">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`category-option category-option--${categoryClass(item)}${activeCategory === item ? ' category-option--selected' : ''}`}
                  aria-pressed={activeCategory === item}
                  onClick={() => {
                    setCategory(item);
                    setFactorId('');
                    setError(null);
                  }}
                >
                  <span className="category-option-dot" aria-hidden="true" />
                  {item}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="form-field">
            <label htmlFor="activity">Activity</label>
            <select
              id="activity"
              value={factor?.id ?? ''}
              onChange={(e) => setFactorId(e.target.value)}
              required
            >
              {categoryFactors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.activity}
                </option>
              ))}
            </select>
            {factor && <span className="field-hint">Measured per {factor.unit}</span>}
          </div>

          <div className="form-field form-field--quantity">
            <label htmlFor="quantity">Amount</label>
            <div className="quantity-input-wrap">
              <input
                id="quantity"
                type="number"
                step="any"
                min="0"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setError(null);
                }}
                placeholder="0"
                required
              />
              <span className="quantity-unit">{factor?.unit ?? 'units'}</span>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="description">Note <span className="optional-label">Optional</span></label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a detail to remember this by"
              maxLength={120}
            />
          </div>

          {error && (
            <p role="alert" className="form-error">
              <span aria-hidden="true">!</span>
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting || !factor} className="primary-button log-submit">
            <span>{submitting ? 'Saving entry…' : 'Add to my log'}</span>
            {!submitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <aside className="impact-preview" aria-live="polite">
          <div className="impact-preview-orb impact-preview-orb--one" aria-hidden="true" />
          <div className="impact-preview-orb impact-preview-orb--two" aria-hidden="true" />
          <p className="impact-preview-kicker">Your estimate</p>
          <p className="impact-preview-value">{co2Kg.toFixed(2)}<span>kg CO₂e</span></p>
          <p className="impact-preview-description">
            {hasValidQty && factor
              ? `Estimated for ${qty} ${factor.unit} of ${factor.activity.toLowerCase()}.`
              : 'Add an amount to see the estimated impact.'}
          </p>
          <div className="impact-preview-divider" />
          <div className="impact-preview-factor">
            <span className={`category-dot category-dot--${categoryClass(activeCategory)}`} aria-hidden="true" />
            <div>
              <span className="impact-preview-factor-label">Selected category</span>
              <span className="impact-preview-factor-name">{activeCategory}</span>
            </div>
          </div>
          <p className="impact-preview-footnote">Estimates are a guide to help you notice patterns over time.</p>
        </aside>
      </div>

      <section className="logged-section" aria-labelledby="logged-entries-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Your activity, at a glance</p>
            <h2 id="logged-entries-heading">Recent Entries</h2>
          </div>
          <span className="entry-count">{logs.length} {logs.length === 1 ? 'entry' : 'entries'}</span>
        </div>
        {logs.length > 0 ? (
          <ul className="activity-list">
            {logs.map((log) => (
              <li key={log.id} className="activity-row">
                <div className="activity-copy">
                  <span className={`category-dot category-dot--${categoryClass(log.category)}`} aria-hidden="true" />
                  <div className="activity-entry-copy">
                    <p className="activity-title">{log.description}</p>
                    <span className={`category-tag category-tag--${categoryClass(log.category)}`}>
                      {log.category}
                    </span>
                  </div>
                </div>
                <span className="activity-value">{log.co2Kg.toFixed(2)} kg CO₂e</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">Your first entry will appear here. Start with one small, everyday activity.</p>
        )}
      </section>
    </main>
  );
}
