import React from 'react';
import { 
  PackagePlus, PackageMinus, Clock, Trash2, PackageX, 
  AlertTriangle, Zap, TrendingDown, AlertOctagon, DollarSign,
  TrendingUp, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { getSeverityColor } from '../../data/labelData';

const iconMap = {
  PackagePlus, PackageMinus, Clock, Trash2, PackageX,
  AlertTriangle, Zap, TrendingDown, AlertOctagon, DollarSign
};

const LabelCard = ({ label, onClick }) => {
  const Icon = iconMap[label.icon] || PackagePlus;
  const colors = getSeverityColor(label.severity);
  
  const getTrendIcon = () => {
    if (label.trend === 'improving') return <ArrowDown className="w-4 h-4" />;
    if (label.trend === 'worsening') return <ArrowUp className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (label.trend === 'improving') return 'text-green-600 bg-green-100';
    if (label.trend === 'worsening') return 'text-red-600 bg-red-100';
    return 'text-slate-600 bg-slate-100';
  };

  const formatValue = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 
        hover:shadow-xl hover:-translate-y-1 ${colors.bg} ${colors.border}
        ${label.severity === 'critical' ? 'animate-pulse-subtle' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors.badge}`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
          {getTrendIcon()}
          <span>{Math.abs(label.trendPercentage)}%</span>
        </div>
      </div>

      <h3 className={`text-lg font-bold mb-1 ${colors.text}`}>
        {label.name}
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        {label.description}
      </p>

      <div className="flex items-center justify-between">
        <div>
          <span className={`text-2xl font-bold ${colors.text}`}>
            {label.affectedProducts}
          </span>
          <span className="text-sm text-slate-500 ml-1">products</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-slate-700">
            {formatValue(label.totalValue)}
          </span>
          <p className="text-xs text-slate-400">affected</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-1">
          {label.weeklyHistory.map((value, index) => (
            <div
              key={index}
              className={`flex-1 h-8 rounded-sm ${colors.badge}`}
              style={{
                height: `${Math.max(20, (value / Math.max(...label.weeklyHistory)) * 32)}px`,
                opacity: 0.4 + (index / label.weeklyHistory.length) * 0.6
              }}
            />
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-1 text-center">Last 7 days</p>
      </div>

      {label.severity === 'critical' && (
        <div className="absolute top-2 right-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      )}
    </div>
  );
};

export default LabelCard;