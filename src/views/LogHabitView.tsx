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
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Log Daily Habit</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow border">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
          >
            <option value="Transport">Transport</option>
            <option value="Energy">Energy</option>
            <option value="Diet">Diet</option>
            <option value="Waste">Waste</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Drove 10 miles, ate plant-based dinner"
            className="mt-1 block w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Estimated CO₂ (kg)</label>
          <input 
            type="number" 
            step="0.1"
            value={co2Kg || ''}
            onChange={(e) => setCo2Kg(parseFloat(e.target.value) || 0)}
            className="mt-1 block w-full p-2 border rounded-md"
          />
        </div>

        <button type="submit" className="w-full bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700">
          Add Log Entry
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