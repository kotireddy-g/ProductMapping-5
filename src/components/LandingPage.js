import React, { useState } from 'react';
import { Search } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // OTIF Data - 8 departments
  const otifData = [
    { name: 'ICU', score: 92.8, status: 'amber' },
    { name: 'OT', score: 92.8, status: 'amber' },
    { name: 'Ward', score: 80, status: 'red', hasAction: true },
    { name: 'Daycare', score: 89.1, status: 'amber' },
    { name: 'ER', score: 60, status: 'red' },
    { name: 'Oncology', score: 75, status: 'red' },
    { name: 'Lab', score: 60, status: 'red' },
    { name: 'Emergency', score: 65, status: 'red' }
  ];

  // Calculate overall OTIF
  const overallOTIF = 98.1;

  // Decision-Action Data - 6 action types
  const actionData = [
    { name: 'OVERSTOCKING', count: 80, isUrgent: true },
    { name: 'Expiry', count: 20, isUrgent: true },
    { name: 'Understock', count: 30, isUrgent: true },
    { name: 'WASTAGE', count: 10, isUrgent: false },
    { name: 'DELAYED', count: 100, isUrgent: true },
    { name: 'Restricted', count: 10, isUrgent: false }
  ];

  const totalActions = actionData.reduce((sum, item) => sum + item.count, 0);

  // Forecast Data - 5 categories
  const forecastData = [
    { name: 'Inpatient Medicine', value: 20, change: 10, trend: 'up' },
    { name: 'Outpatient Medicine', value: 10, change: -22, trend: 'down' },
    { name: 'Ward & Clinical', value: 5, change: 10, trend: 'up' },
    { name: 'Controlled Drugs', value: 57, change: -11, trend: 'up' },
    { name: 'IV Administration', value: 10.7, change: 32, trend: 'up' }
  ];

  const forecastSurge = 10; // 10% surge

  // Color coding function for OTIF
  const getOTIFColor = (status) => {
    switch (status) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="OTIF, MEDICINE, Action, Labels"
              className="w-full pl-14 pr-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* OTIF Section */}
        <div className="mb-12">
          {/* OTIF Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              OTIF: <span className="text-green-600">{overallOTIF}%</span>
            </h2>
          </div>

          {/* OTIF Department Pills */}
          <div className="flex flex-wrap gap-4">
            {otifData.map((dept, index) => (
              <button
                key={index}
                onClick={() => onNavigate && onNavigate('otif-detail', dept)}
                className={`px-6 py-3 rounded-full border-2 font-semibold text-base transition-all hover:shadow-lg hover:scale-105 ${getOTIFColor(dept.status)}`}
              >
                <span className="mr-2">@</span>
                {dept.name} {dept.score}%
                {dept.hasAction && <span className="ml-2 text-xs">↑↓</span>}
              </button>
            ))}
          </div>

          {/* Color Legend */}
          <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Green 94-100%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              <span>Amber: 85-94%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Red &lt;85%</span>
            </div>
          </div>
        </div>

        {/* Decision - Action Section */}
        <div className="mb-12">
          {/* Action Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Decision - Action <span className="text-blue-600">{totalActions}</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Only actions in red or critical color
            </p>
          </div>

          {/* Action Pills - Count Badge */}
          <div className="flex flex-wrap gap-4">
            {actionData.map((action, index) => (
              <button
                key={index}
                onClick={() => onNavigate && onNavigate('action-detail', action)}
                className={`px-6 py-3 rounded-full border-2 font-semibold text-base transition-all hover:shadow-lg hover:scale-105 ${
                  action.isUrgent
                    ? 'bg-red-50 text-red-800 border-red-300'
                    : 'bg-orange-50 text-orange-800 border-orange-300'
                }`}
              >
                <span className="mr-2">@</span>
                {action.name.toUpperCase()} {action.count}
              </button>
            ))}
          </div>
        </div>

        {/* Forecast Section */}
        <div className="mb-12">
          {/* Forecast Header */}
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-gray-800">
              FORECAST: <span className="text-blue-600">{forecastSurge}% ↑</span>{' '}
              <span className="text-2xl text-gray-600">Surge in day</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Bigger size</p>
          </div>

          {/* Forecast Pills */}
          <div className="flex flex-wrap gap-4">
            {forecastData.map((forecast, index) => (
              <button
                key={index}
                onClick={() => onNavigate && onNavigate('forecast-detail', forecast)}
                className={`px-6 py-3 rounded-full border-2 font-semibold text-base transition-all hover:shadow-lg hover:scale-105 ${
                  forecast.trend === 'up'
                    ? 'bg-green-50 text-green-800 border-green-300'
                    : 'bg-red-50 text-red-800 border-red-300'
                }`}
              >
                <span className="mr-2">@</span>
                {forecast.name} {forecast.value}
                {forecast.trend === 'up' ? ' ↑' : ' ↓'}
                <span className="ml-2 text-xs">
                  ({forecast.change > 0 ? '+' : ''}{forecast.change})
                </span>
              </button>
            ))}
          </div>

          {/* Icons Note */}
          <div className="mt-6 text-sm text-gray-500 italic">
            ICONS (to be customized)
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
