import { useState } from 'react';
import type { HabitLog } from '../types/footprint';

interface LogHabitViewProps {
  logs: HabitLog[];
  onAddLog: (log: HabitLog) => void;
}

export function LogHabitView({ logs, onAddLog }: LogHabitViewProps) {
  const [category, setCategory] = useState('Transport');
  const [description, setDescription] = useState('');
  const [co2Kg, setCo2Kg] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || co2Kg <= 0) return;

    const newLog: HabitLog = {
      id: Date.now().toString(),
      category,
      description,
      co2Kg,
      date: new Date().toISOString().split('T')[0],
    };

    onAddLog(newLog);
    setDescription('');
    setCo2Kg(0);
  };

  return (
    <main className="page-content page-content--narrow">
      <section className="page-heading">
        <p className="eyebrow">Make it count</p>
        <h1>Log a daily habit</h1>
        <p className="page-intro">Add an activity to your climate journal and keep your impact estimate up to date.</p>
      </section>

      <form onSubmit={handleSubmit} className="habit-form">
        <div className="form-field">
          <label htmlFor="habit-category">Category</label>
          <select
            id="habit-category"
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Transport">Transport</option>
            <option value="Energy">Energy</option>
            <option value="Diet">Diet</option>
            <option value="Waste">Waste</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="habit-description">Description</label>
          <input
            id="habit-description"
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Drove 10 miles, ate plant-based dinner"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="habit-co2">Estimated CO₂ (kg)</label>
          <input
            id="habit-co2"
            type="number" 
            step="0.1"
            min="0.1"
            value={co2Kg || ''}
            onChange={(e) => setCo2Kg(parseFloat(e.target.value) || 0)}
            required
          />
        </div>

        <button type="submit" className="primary-button">
          Add habit entry
        </button>
      </form>

      <section className="logged-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Your journal</p>
            <h2>Recorded entries</h2>
          </div>
          <span className="entry-count">{logs.length} {logs.length === 1 ? 'entry' : 'entries'}</span>
        </div>
        {logs.length > 0 ? <ul className="activity-list">
          {logs.map((log) => (
            <li key={log.id} className="activity-row">
              <div className="activity-copy">
                <p className="activity-title">{log.description}</p>
                <span className="category-tag">{log.category}</span>
              </div>
              <span className="activity-value">{log.co2Kg} kg CO₂e</span>
            </li>
          ))}
        </ul> : <p className="empty-state">Your entries will appear here after you log a habit.</p>}
      </section>
    </main>
  );
}