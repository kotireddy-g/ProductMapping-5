import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { ArrowUp, ArrowDown, Target, Clock, X, ChevronRight } from 'lucide-react';
import { generateKPITrendData } from '../../data/labelData';

const KPIDrawer = ({ kpi, onClose, allKpis }) => {
  const trendData = useMemo(() => generateKPITrendData(kpi), [kpi]);
  
  const relatedKpis = allKpis.filter(k => k.id !== kpi.id).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[500px] bg-white h-full overflow-y-auto shadow-2xl animate-slide-in-right">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{kpi.label}</h2>
            <p className="text-sm text-slate-500">Detailed Analysis</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Goal</p>
                <p className="text-xl font-bold text-slate-600">{kpi.goal}{kpi.unit}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Baseline</p>
                <p className="text-xl font-bold text-slate-600">{kpi.baseline}{kpi.unit}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Current</p>
                <p className="text-2xl font-bold text-blue-600">{kpi.current}{kpi.unit}</p>
              </div>
            </div>
            
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <ReferenceLine y={kpi.goal} stroke="#3b82f6" strokeDasharray="4 4" strokeOpacity={0.5} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#colorValue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Related Metrics</h3>
            <div className="space-y-3">
              {relatedKpis.map((relKpi) => {
                const relTrendData = generateKPITrendData(relKpi);
                const isImproving = relKpi.current < relKpi.baseline;
                
                return (
                  <div key={relKpi.id} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{relKpi.label}</span>
                      <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${
                        isImproving ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isImproving ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                        {Math.abs(((relKpi.current - relKpi.baseline) / relKpi.baseline) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-slate-800">{relKpi.current}{relKpi.unit}</span>
                      <div className="w-24 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={relTrendData}>
                            <Line type="monotone" dataKey="value" stroke="#64748b" strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ kpi, onClick, allKpis }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const trendData = useMemo(() => generateKPITrendData(kpi), [kpi]);
  
  const isImproving = kpi.current < kpi.baseline;
  const progressToGoal = Math.min(100, Math.max(0, 
    ((kpi.baseline - kpi.current) / (kpi.baseline - kpi.goal)) * 100
  ));

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer 
        hover:shadow-lg hover:border-blue-300 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {['daily', 'weekly', 'monthly', 'quarterly'].map((period) => (
            <button
              key={period}
              onClick={(e) => { e.stopPropagation(); setSelectedPeriod(period); }}
              className={`px-2 py-0.5 text-xs rounded ${
                selectedPeriod === period 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {period.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>Updated 5m ago</span>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-slate-700 mb-3">{kpi.label}</h4>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <p className="text-xs text-slate-400">Goal</p>
          <p className="text-sm font-semibold text-slate-500">{kpi.goal}{kpi.unit}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Baseline</p>
          <p className="text-sm font-semibold text-slate-500">{kpi.baseline}{kpi.unit}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Current</p>
          <p className={`text-lg font-bold ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
            {kpi.current}{kpi.unit}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs mb-3">
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Last week:</span>
          <span className="font-medium text-slate-600">{kpi.lastWeek}{kpi.unit}</span>
        </div>
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
          isImproving ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isImproving ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
          {Math.abs(kpi.current - kpi.lastWeek).toFixed(1)}{kpi.unit}
        </div>
      </div>

      <div className="h-20 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id={`gradient-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isImproving ? '#22c55e' : '#ef4444'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isImproving ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '6px', fontSize: '11px' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <ReferenceLine y={kpi.goal} stroke="#3b82f6" strokeDasharray="3 3" strokeOpacity={0.5} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isImproving ? '#22c55e' : '#ef4444'} 
              fill={`url(#gradient-${kpi.id})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-400 text-center">Last 7 days</p>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">Monthly till date: 
          <span className={`ml-1 font-medium ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
            {kpi.monthlyTillDate}{kpi.unit}
          </span>
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};

const LabelKPIs = ({ selectedLabel }) => {
  const [selectedKPI, setSelectedKPI] = useState(null);
  
  if (!selectedLabel || !selectedLabel.kpis) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Key Performance Indicators - {selectedLabel.name}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {selectedLabel.kpis.map((kpi) => (
          <KPICard
            key={kpi.id}
            kpi={kpi}
            allKpis={selectedLabel.kpis}
            onClick={() => setSelectedKPI(kpi)}
          />
        ))}
      </div>

      {selectedKPI && (
        <KPIDrawer
          kpi={selectedKPI}
          allKpis={selectedLabel.kpis}
          onClose={() => setSelectedKPI(null)}
        />
      )}
    </div>
  );
};

export default LabelKPIs;