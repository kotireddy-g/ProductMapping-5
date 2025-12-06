import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { mainKPIs } from '../../data/kpiTrendData';

const ImprovedKpiCards = ({ kpiData = [], onKpiClick }) => {
  // Add safety check for kpiData
  if (!kpiData || kpiData.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No KPI data available
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    return trend === 'improving' ? 
      <TrendingUp className="w-4 h-4 text-green-500" /> : 
      <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getTrendColor = (current, target) => {
    if (current >= target) return 'text-green-600';
    if (current >= target * 0.9) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (current, target) => {
    if (current >= target) return 'bg-green-500';
    if (current >= target * 0.9) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateProgress = (current, target) => {
    return Math.min(100, (current / target) * 100);
  };

  // Get enhanced KPI data with trend information
  const getEnhancedKpiData = (kpi) => {
    const kpiId = kpi.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'default';
    const enhancedData = mainKPIs[kpiId];
    
    if (enhancedData) {
      return {
        ...kpi,
        ...enhancedData,
        chartData: enhancedData.dailyData
      };
    }
    
    // Fallback data if not found in mainKPIs
    return {
      ...kpi,
      chartData: {
        goal: Array(7).fill().map((_, i) => ({ day: i + 1, value: parseFloat(kpi.target) || 100 })),
        actual: Array(7).fill().map((_, i) => ({ day: i + 1, value: (parseFloat(kpi.current) || 80) + (Math.random() - 0.5) * 10 })),
        forecast: Array(7).fill().map((_, i) => ({ day: i + 1, value: (parseFloat(kpi.forecast) || 90) + (Math.random() - 0.5) * 5 }))
      }
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => {
        const enhancedKpi = getEnhancedKpiData(kpi);
        
        // Prepare chart data combining goal, actual, and forecast
        const chartData = enhancedKpi.chartData.goal.map((goalPoint, index) => ({
          day: goalPoint.day,
          date: goalPoint.date,
          goal: goalPoint.value,
          actual: enhancedKpi.chartData.actual[index]?.value || goalPoint.value,
          forecast: enhancedKpi.chartData.forecast[index]?.value || goalPoint.value
        }));

        return (
          <div 
            key={kpi.id || index} 
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onKpiClick && onKpiClick(enhancedKpi)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">{kpi.title}</h3>
              {getTrendIcon(enhancedKpi.trend || kpi.trend || 'improving')}
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-1 mb-4">
              <div className="px-2 py-1 bg-teal-500 text-white text-xs rounded font-medium">
                Daily
              </div>
              <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded cursor-pointer hover:bg-gray-200">
                Weekly
              </div>
              <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded cursor-pointer hover:bg-gray-200">
                Monthly
              </div>
              <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded cursor-pointer hover:bg-gray-200">
                Quarterly
              </div>
            </div>

            {/* Current Value */}
            <div className="mb-4">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {enhancedKpi.current || kpi.current}
                <span className="text-sm font-normal text-slate-500 ml-1">
                  {enhancedKpi.unit || ''}
                </span>
              </div>
              
              <div className="text-sm text-blue-600 mb-1">
                {enhancedKpi.target || kpi.target}{enhancedKpi.unit || ''} Goal
              </div>
              <div className="text-xs text-slate-500">
                Last 7 days
              </div>
            </div>

            {/* Enhanced Chart with Goal/Actual/Forecast */}
            <div className="h-20 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={false}
                  />
                  <YAxis hide />
                  
                  {/* Goal Line (Blue Dashed) */}
                  <Line
                    type="monotone"
                    dataKey="goal"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  
                  {/* Actual Line (Green Solid) */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 2, fill: '#22c55e' }}
                  />
                  
                  {/* Forecast Line (Green Area) */}
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="#22c55e"
                    fillOpacity={0.1}
                    dot={{ r: 2, fill: '#22c55e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                    parseFloat(enhancedKpi.current || kpi.current), 
                    parseFloat(enhancedKpi.target || kpi.target)
                  )}`}
                  style={{ 
                    width: `${calculateProgress(
                      parseFloat(enhancedKpi.current || kpi.current), 
                      parseFloat(enhancedKpi.target || kpi.target)
                    )}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Status and Progress */}
            <div className="flex items-center justify-between text-xs">
              <span className={`font-medium ${getTrendColor(
                parseFloat(enhancedKpi.current || kpi.current), 
                parseFloat(enhancedKpi.target || kpi.target)
              )}`}>
                {Math.round(calculateProgress(
                  parseFloat(enhancedKpi.current || kpi.current), 
                  parseFloat(enhancedKpi.target || kpi.target)
                ))}% to goal
              </span>
              <span className="text-slate-500 capitalize">
                {enhancedKpi.trend || kpi.trend || 'stable'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImprovedKpiCards;
