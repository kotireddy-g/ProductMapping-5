import React from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUp, ArrowDown, Target } from 'lucide-react';

const KPISection = ({ kpiGraphData }) => {
  const kpis = [
    { key: 'otif', ...kpiGraphData?.otif },
    { key: 'costSaving', ...kpiGraphData?.costSaving },
    { key: 'expiryDuration', ...kpiGraphData?.expiryDuration },
    { key: 'emergencyPurchase', ...kpiGraphData?.emergencyPurchase }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Key Performance Indicators</h3>
      <div className="grid grid-cols-2 gap-4">
        {kpis.map((kpi) => {
          if (!kpi.label) return null;
          
          const isPositive = kpi.key === 'otif' || kpi.key === 'costSaving' 
            ? kpi.change > 0 
            : kpi.change < 0;

          return (
            <div
              key={kpi.key}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700">{kpi.label}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold" style={{ color: kpi.color }}>
                      {kpi.current?.toFixed(1)}{kpi.unit}
                    </span>
                    <div className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded ${
                      isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(kpi.change || 0).toFixed(1)}{kpi.unit}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Target className="w-3 h-3" />
                  <span>Goal: {kpi.goal}{kpi.unit}</span>
                </div>
              </div>

              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpi.data || []} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      hide 
                      domain={[
                        Math.min(kpi.baseline || 0, (kpi.goal || 0) - 10),
                        Math.max((kpi.baseline || 0) + 10, (kpi.goal || 0) + 10)
                      ]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: 'none', 
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: 'white'
                      }}
                      formatter={(value) => [`${value.toFixed(1)}${kpi.unit}`, 'Value']}
                    />
                    <ReferenceLine 
                      y={kpi.goal} 
                      stroke={kpi.color} 
                      strokeDasharray="4 4" 
                      strokeOpacity={0.5}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={kpi.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: kpi.color }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>Baseline: {kpi.baseline}{kpi.unit}</span>
                <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                  {isPositive ? 'Improving' : 'Needs Attention'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KPISection;
