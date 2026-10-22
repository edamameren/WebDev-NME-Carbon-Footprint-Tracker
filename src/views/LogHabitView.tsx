import { useState } from 'react';
import type { HabitLog } from '../types/footprint';

interface LogHabitViewProps {
  logs: HabitLog[];
  onAddLog: (log: HabitLog) => void;
  onUpdateLog: (log: HabitLog) => void;
  onDeleteLog: (id: string) => void;
}

export function LogHabitView({ logs, onAddLog, onUpdateLog, onDeleteLog }: LogHabitViewProps) {
  const [category, setCategory] = useState('Transport');
  const [description, setDescription] = useState('');
  const [co2Kg, setCo2Kg] = useState<number>(0);
  const [editingLog, setEditingLog] = useState<HabitLog | null>(null);

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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog || !editingLog.description.trim() || editingLog.co2Kg <= 0) return;

    onUpdateLog({ ...editingLog, description: editingLog.description.trim() });
    setEditingLog(null);
  };

  const handleDelete = (log: HabitLog) => {
    if (window.confirm(`Delete "${log.description}"? This cannot be undone.`)) {
      onDeleteLog(log.id);
      if (editingLog?.id === log.id) setEditingLog(null);
    }
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
            <li key={log.id} className={`activity-row${editingLog?.id === log.id ? ' activity-row--editing' : ''}`}>
              {editingLog?.id === log.id ? (
                <form className="entry-edit-form" onSubmit={handleEditSubmit}>
                  <div className="entry-edit-fields">
                    <div className="form-field">
                      <label htmlFor={`edit-description-${log.id}`}>Description</label>
                      <input
                        id={`edit-description-${log.id}`}
                        value={editingLog.description}
                        onChange={(e) => setEditingLog({ ...editingLog, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor={`edit-category-${log.id}`}>Category</label>
                      <select
                        id={`edit-category-${log.id}`}
                        value={editingLog.category}
                        onChange={(e) => setEditingLog({ ...editingLog, category: e.target.value })}
                      >
                        <option value="Transport">Transport</option>
                        <option value="Energy">Energy</option>
                        <option value="Diet">Diet</option>
                        <option value="Waste">Waste</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label htmlFor={`edit-co2-${log.id}`}>CO₂ (kg)</label>
                      <input
                        id={`edit-co2-${log.id}`}
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={editingLog.co2Kg}
                        onChange={(e) => setEditingLog({ ...editingLog, co2Kg: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>
                  <div className="entry-edit-actions">
                    <button type="button" className="entry-action" onClick={() => setEditingLog(null)}>Cancel</button>
                    <button type="submit" className="primary-button entry-save-button">Save changes</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="activity-copy">
                    <p className="activity-title">{log.description}</p>
                    <span className="category-tag">{log.category}</span>
                  </div>
                  <span className="activity-value">{log.co2Kg} kg CO₂e</span>
                  <div className="entry-actions">
                    <button type="button" className="entry-action" onClick={() => setEditingLog({ ...log })} aria-label={`Edit ${log.description}`} title="Edit entry">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m16 5 3 3M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z" />
                      </svg>
                    </button>
                    <button type="button" className="entry-action entry-action--delete" onClick={() => handleDelete(log)} aria-label={`Delete ${log.description}`} title="Delete entry">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 6h18M8 6V4h8v2m3 0-.9 14H5.9L5 6m4 4v6m6-6v6" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul> : <p className="empty-state">Your entries will appear here after you log a habit.</p>}
      </section>
    </main>
  );
}