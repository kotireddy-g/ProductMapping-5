import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KpiCards = ({ kpiData = [], onKpiClick }) => {
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
      <TrendingUp className="w-5 h-5 text-green-500" /> : 
      <TrendingDown className="w-5 h-5 text-red-500" />;
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

  // Generate sample trend data for each KPI
  const generateTrendData = (current, target, forecast) => {
    const data = [];
    const currentVal = parseFloat(current) || 80;
    const targetVal = parseFloat(target) || 100;
    const forecastVal = parseFloat(forecast) || 90;
    
    for (let i = 0; i < 12; i++) {
      const variance = (Math.random() - 0.5) * 0.1;
      data.push({
        period: i + 1,
        current: Math.max(0, currentVal + (currentVal * variance)),
        target: targetVal,
        forecast: Math.max(0, forecastVal + (forecastVal * variance * 0.5))
      });
    }
    return data;
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label, kpi }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-slate-700 mb-2">Period {label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-slate-600">{entry.name}:</span>
              <span className="font-medium text-slate-900">
                {formatValue(entry.value, kpi)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format values based on KPI type
  const formatValue = (value, kpi) => {
    if (kpi.title.includes('Performance') || kpi.title.includes('Efficiency')) {
      return `${value.toFixed(1)}%`;
    } else if (kpi.title.includes('Frequency')) {
      return Math.round(value).toString();
    } else if (kpi.title.includes('Turnover')) {
      return `${value.toFixed(1)}`;
    } else {
      return value.toFixed(1);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {kpiData.map((kpi, index) => {
        const trendData = generateTrendData(kpi.current, kpi.target, kpi.forecast);
        
        return (
          <div 
            key={kpi.id || index} 
            className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-blue-300"
            onClick={() => onKpiClick && onKpiClick({
              ...kpi,
              chartData: trendData,
              trendData: trendData
            })}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">{kpi.title}</h3>
              {getTrendIcon(kpi.trend)}
            </div>

            {/* Current Value */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-slate-900 mb-2">{kpi.current}</div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-blue-600">Target: {kpi.target}</div>
                <div className="text-green-600">Forecast: {kpi.forecast}</div>
              </div>
            </div>

            {/* Large Trend Chart */}
            <div className="h-32 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis 
                    dataKey="period" 
                    axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    tickLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    tickLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => formatValue(value, kpi)}
                  />
                  <Tooltip 
                    content={(props) => <CustomTooltip {...props} kpi={kpi} />}
                    cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                  
                  {/* Target Line (Blue Dashed) */}
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    dot={false}
                    name="Target"
                  />
                  
                  {/* Current Line (Green Solid) */}
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#22c55e' }}
                    name="Current"
                  />
                  
                  {/* Forecast Line (Purple) */}
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#8b5cf6' }}
                    name="Forecast"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-blue-500 border-dashed border border-blue-500"></div>
                <span className="text-xs text-slate-600">Target</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-green-500"></div>
                <span className="text-xs text-slate-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-purple-500"></div>
                <span className="text-xs text-slate-600">Forecast</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>Progress to Target</span>
                <span className="font-semibold">{Math.round(calculateProgress(parseFloat(kpi.current), parseFloat(kpi.target)))}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(parseFloat(kpi.current), parseFloat(kpi.target))}`}
                  style={{ width: `${calculateProgress(parseFloat(kpi.current), parseFloat(kpi.target))}%` }}
                ></div>
              </div>
            </div>

            {/* Status */}
            <div className={`text-sm font-semibold text-center py-2 rounded-lg ${getTrendColor(parseFloat(kpi.current), parseFloat(kpi.target))} bg-slate-50`}>
              {kpi.status || 'On Track'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiCards;
