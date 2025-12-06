import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { summaryKPIs, generateDeviationData } from '../../data/kpiTrendData';

const RelatedKPIsDrawer = ({ isOpen, onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Daily');
  const [selectedChart, setSelectedChart] = useState('consumption');

  // Sample data for Expected vs Actual Consumption
  const consumptionData = [
    { time: '1:00', expected: 125, actual: 120 },
    { time: '3:00', expected: 120, actual: 118 },
    { time: '5:00', expected: 135, actual: 160 },
    { time: '7:00', expected: 145, actual: 150 },
    { time: '9:00', expected: 140, actual: 155 },
    { time: '11:00', expected: 135, actual: 155 },
    { time: '13:00', expected: 125, actual: 115 },
    { time: '15:00', expected: 115, actual: 110 },
    { time: '17:00', expected: 105, actual: 100 },
    { time: '19:00', expected: 100, actual: 95 },
    { time: '21:00', expected: 95, actual: 85 },
    { time: '23:00', expected: 110, actual: 105 }
  ];

  // Generate deviation data
  const deviationData = generateDeviationData(
    consumptionData.map(d => ({ time: d.time, value: d.expected })),
    consumptionData.map(d => ({ time: d.time, value: d.actual }))
  );

  const periods = ['Hourly', 'Daily', 'Weekly', 'Monthly'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-[600px] bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Related KPIs</h2>
            <p className="text-sm text-gray-500 mt-1">
              Performance trends and analysis
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Period Selection */}
          <div className="flex items-center gap-2">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Expected vs Actual Consumption Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Expected vs Actual Consumption
            </h3>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consumptionData}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    domain={[0, 180]}
                  />
                  <Line
                    type="monotone"
                    dataKey="expected"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#3b82f6' }}
                    name="Expected"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#ef4444' }}
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Expected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Actual</span>
              </div>
            </div>
          </div>

          {/* Deviation from Expected Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Deviation from Expected
            </h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={deviationData}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    domain={[-25, 25]}
                  />
                  <Area
                    type="monotone"
                    dataKey="deviation"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary KPI Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Summary KPIs</h3>
            <div className="grid grid-cols-1 gap-4">
              {summaryKPIs.map((kpi) => (
                <div key={kpi.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{kpi.name}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div>
                          <span className="text-sm text-gray-500">Current: </span>
                          <span className="font-semibold text-gray-900">{kpi.current}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Target: </span>
                          <span className="font-semibold text-gray-600">{kpi.target}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${getStatusColor(kpi.status)}`}>
                      {kpi.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Key Insights</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Peak consumption occurs between 5:00-11:00 AM</li>
              <li>• Actual consumption is 8.5% higher than expected during peak hours</li>
              <li>• Evening hours show consistent under-consumption</li>
              <li>• Overall efficiency is improving with 12% reduction in waste</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedKPIsDrawer;
