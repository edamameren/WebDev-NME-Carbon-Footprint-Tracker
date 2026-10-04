import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-emerald-700 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <span className="font-bold text-lg">CarbonTracker</span>
        <div className="space-x-6">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/log" className="hover:underline">Log Habit</Link>
          <Link to="/analytics" className="hover:underline">Analytics</Link>
        </div>
      </div>
    </nav>
  );
}