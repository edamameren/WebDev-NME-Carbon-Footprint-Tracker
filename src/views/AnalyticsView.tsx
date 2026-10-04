export function AnalyticsView() {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Footprint Analytics</h2>
        <p className="text-gray-600 mb-6">Explore your historical carbon emission trends over time.</p>
        
        <div className="p-6 bg-white rounded-lg shadow border">
          <h3 className="font-semibold text-gray-800 mb-2">Weekly Emissions Breakdown</h3>
          <div className="h-48 flex items-center justify-center bg-gray-50 border border-dashed rounded text-gray-400">
            [Chart placeholder: Historical carbon trends over time]
          </div>
        </div>
      </div>
    );
  }