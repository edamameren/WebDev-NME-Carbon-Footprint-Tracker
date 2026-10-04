export function HomeView() {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🌱 Personal Carbon Footprint Tracker</h1>
        <p className="text-gray-600 mb-6">
          Welcome! Track your daily habits, monitor your estimated carbon emissions over time, and build sustainable routines.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 text-lg">Today's Impact</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">3.7 kg <span className="text-sm font-normal text-gray-600">CO₂e</span></p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 text-lg">Weekly Goal</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">On Track</p>
          </div>
        </div>
      </div>
    );
  }