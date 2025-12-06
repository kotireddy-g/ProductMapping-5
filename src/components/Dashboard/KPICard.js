import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const KPICard = ({ kpi, timeFilter = 'daily' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [filter, setFilter] = useState(timeFilter);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepValue = kpi.value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(kpi.value);
        clearInterval(timer);
      } else {
        setDisplayValue(stepValue * currentStep);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [kpi.value]);

  const formatValue = (val) => {
    if (kpi.unit === '%') return val.toFixed(1);
    if (kpi.unit === 'Cr') return `₹${val.toFixed(1)}`;
    if (kpi.unit === 'hrs') return val.toFixed(1);
    return Math.round(val);
  };

  const getFilteredData = () => {
    const data = kpi.trendData || [];
    switch (filter) {
      case 'weekly':
        return data.filter((_, i) => i % 7 === 0 || i === data.length - 1);
      case 'monthly':
        return data.filter((_, i) => i % 30 === 0 || i === data.length - 1);
      default:
        return data;
    }
  };

  const filteredData = getFilteredData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = filteredData.find(d => d.day === label);
      return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
          <p className="text-slate-500 text-xs mb-1">{dataPoint?.date || `Day ${label}`}</p>
          <p className="text-slate-800 font-semibold text-sm">
            {kpi.title}: <span style={{ color: kpi.color }}>{payload[0].value.toFixed(1)}{kpi.unit}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-600 text-sm font-medium">{kpi.title}</span>
        <div className={`flex items-center gap-1 text-xs font-medium ${
          kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {kpi.trend === 'up' ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {Math.abs(kpi.change)}%
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-slate-800">
          {formatValue(displayValue)}
        </span>
        <span className="text-slate-500 text-sm">{kpi.unit}</span>
      </div>

      <div className="flex gap-1 mb-3">
        {['daily', 'weekly', 'monthly'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
              filter === f 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 9, fill: '#94a3b8' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 9, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 2', 'dataMax + 2']}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={kpi.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: kpi.color, stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KPICard;
