import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function PerformanceMetrics({ timeframe, product }) {
  // Generate mock performance data based on timeframe
  const getMetrics = () => {
    const baseConsumption = product.consumption || 100;
    const variance = Math.random() * 40 - 20; // -20 to +20 variance
    const consumption = baseConsumption + variance;
    const expected = baseConsumption;
    const status = consumption > expected * 1.2 ? 'over' : consumption < expected * 0.8 ? 'under' : 'normal';

    return {
      consumption: Math.round(consumption),
      expected: Math.round(expected),
      status,
      variance: Math.round(consumption - expected),
    };
  };

  const metrics = getMetrics();

  const getStatusColor = (status) => {
    switch (status) {
      case 'over':
        return 'bg-red-50 border-red-200';
      case 'under':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'over':
        return 'bg-red-100 text-red-800';
      case 'under':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'over':
        return 'Over Consumed';
      case 'under':
        return 'Under Consumed';
      default:
        return 'Normal';
    }
  };

  return (
    <div className={`border rounded-b-lg p-4 ${getStatusColor(metrics.status)}`}>
      <div className="space-y-3">
        {/* Status Badge */}
        <div className="flex justify-center">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(metrics.status)}`}>
            {getStatusLabel(metrics.status)}
          </span>
        </div>

        {/* Consumption vs Expected */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-700">Consumed:</span>
            <span className="font-bold text-slate-900">{metrics.consumption} {product.unit}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-700">Expected:</span>
            <span className="font-bold text-slate-900">{metrics.expected} {product.unit}</span>
          </div>
        </div>

        {/* Variance */}
        <div className="flex items-center justify-between pt-2 border-t border-current border-opacity-20">
          <span className="text-xs text-slate-600">Variance:</span>
          <div className="flex items-center gap-1">
            {metrics.variance > 0 ? (
              <TrendingUp size={16} className="text-red-600" />
            ) : (
              <TrendingDown size={16} className="text-yellow-600" />
            )}
            <span className={`font-semibold text-sm ${metrics.variance > 0 ? 'text-red-600' : 'text-yellow-600'}`}>
              {metrics.variance > 0 ? '+' : ''}{metrics.variance}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-300 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                metrics.status === 'over'
                  ? 'bg-red-500'
                  : metrics.status === 'under'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{
                width: `${Math.min((metrics.consumption / (metrics.expected * 1.5)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceMetrics;
