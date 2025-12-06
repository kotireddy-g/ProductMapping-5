import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { relatedKPIs } from '../../data/kpiTrendData';
import KpiCards from './KpiCards';

const KpiDetailDrawer = ({ isOpen, onClose, selectedKpi }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Daily');

  if (!isOpen || !selectedKpi) return null;

  // Get related KPIs for the selected main KPI
  const getRelatedKPIs = () => {
    const kpiId = selectedKpi.id || selectedKpi.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return relatedKPIs[kpiId] || [];
  };

  const relatedKpiList = getRelatedKPIs();
  const periods = ['Hourly', 'Daily', 'Weekly', 'Monthly'];

  // Prepare chart data for the main KPI
  const getMainKpiChartData = () => {
    // Use the chart data if available from the KPI click
    if (selectedKpi.chartData && Array.isArray(selectedKpi.chartData)) {
      return selectedKpi.chartData.map((point, index) => ({
        day: point.period || index + 1,
        goal: point.target || parseFloat(selectedKpi.target) || 100,
        actual: point.current || parseFloat(selectedKpi.current) || 80,
        forecast: point.forecast || parseFloat(selectedKpi.forecast) || 90
      }));
    }
    
    // Generate fallback data
    const data = [];
    const currentVal = parseFloat(selectedKpi.current) || 80;
    const targetVal = parseFloat(selectedKpi.target) || 100;
    const forecastVal = parseFloat(selectedKpi.forecast) || 90;
    
    for (let i = 0; i < 12; i++) {
      const variance = (Math.random() - 0.5) * 0.1;
      data.push({
        day: i + 1,
        goal: targetVal,
        actual: Math.max(0, currentVal + (currentVal * variance)),
        forecast: Math.max(0, forecastVal + (forecastVal * variance * 0.5))
      });
    }
    return data;
  };

  const mainChartData = getMainKpiChartData();

  // Convert related KPIs to format expected by KpiCards
  const relatedKpiCards = relatedKpiList.map((kpi, index) => ({
    id: kpi.id || `related-${index}`,
    title: kpi.name || 'Related KPI',
    current: kpi.current?.toString() || '0',
    target: kpi.target?.toString() || '100',
    forecast: kpi.forecast?.toString() || '50',
    trend: kpi.trend || 'stable',
    unit: kpi.unit || '',
    status: 'On Track'
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-[700px] bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedKpi.name || selectedKpi.title} Analysis
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Detailed performance metrics and related KPIs
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
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Main KPI Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedKpi.name || selectedKpi.title}
              </h3>
              <div className="text-sm text-gray-500">
                {selectedKpi.category || 'Performance Metric'}
              </div>
            </div>

            {/* Main KPI Values */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedKpi.target || selectedKpi.target}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {selectedKpi.unit || ''}
                  </span>
                </div>
                <div className="text-sm text-gray-500">Goal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {selectedKpi.current}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {selectedKpi.unit || ''}
                  </span>
                </div>
                <div className="text-sm text-gray-500">Current</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedKpi.forecast}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {selectedKpi.unit || ''}
                  </span>
                </div>
                <div className="text-sm text-gray-500">Forecast</div>
              </div>
            </div>

            {/* Main KPI Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mainChartData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  
                  {/* Goal Line (Blue Dashed) */}
                  <Line
                    type="monotone"
                    dataKey="goal"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: '#3b82f6' }}
                    name="Goal"
                  />
                  
                  {/* Actual Line (Green Solid) */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#22c55e' }}
                    name="Actual"
                  />
                  
                  {/* Forecast Line (Purple) */}
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#8b5cf6' }}
                    name="Forecast"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-blue-500 border-dashed border border-blue-500"></div>
                <span className="text-sm text-gray-600">Goal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span className="text-sm text-gray-600">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-purple-500"></div>
                <span className="text-sm text-gray-600">Forecast</span>
              </div>
            </div>
          </div>

          {/* Related KPIs Section - List View */}
          {relatedKpiCards.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Related KPIs
              </h3>
              <div className="space-y-4">
                {relatedKpiCards.map((kpi, index) => (
                  <div key={kpi.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{kpi.title}</h4>
                      <div className="flex items-center gap-2">
                        {kpi.trend === 'improving' ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        )}
                        <span className="text-xs text-gray-500 capitalize">{kpi.trend}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {kpi.target}
                          <span className="text-xs font-normal text-gray-500 ml-1">{kpi.unit}</span>
                        </div>
                        <div className="text-xs text-gray-500">Target</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {kpi.current}
                          <span className="text-xs font-normal text-gray-500 ml-1">{kpi.unit}</span>
                        </div>
                        <div className="text-xs text-gray-500">Current</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">
                          {kpi.forecast}
                          <span className="text-xs font-normal text-gray-500 ml-1">{kpi.unit}</span>
                        </div>
                        <div className="text-xs text-gray-500">Forecast</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress to Target</span>
                        <span>{Math.round((parseFloat(kpi.current) / parseFloat(kpi.target)) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            parseFloat(kpi.current) >= parseFloat(kpi.target) 
                              ? 'bg-green-500' 
                              : parseFloat(kpi.current) >= parseFloat(kpi.target) * 0.9 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (parseFloat(kpi.current) / parseFloat(kpi.target)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="text-center">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        parseFloat(kpi.current) >= parseFloat(kpi.target) 
                          ? 'bg-green-100 text-green-700' 
                          : parseFloat(kpi.current) >= parseFloat(kpi.target) * 0.9 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {kpi.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KPI Description and Insights */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Key Insights</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Current performance is {selectedKpi.trend === 'improving' ? 'improving' : 'stable'} compared to last period</li>
              <li>• Target achievement rate: {Math.round((parseFloat(selectedKpi.current) / parseFloat(selectedKpi.target)) * 100)}%</li>
              <li>• Forecast indicates {selectedKpi.trend === 'improving' ? 'continued improvement' : 'steady performance'}</li>
              {selectedKpi.description && <li>• {selectedKpi.description}</li>}
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

export default KpiDetailDrawer;
