import React from 'react';
import { Calendar, TrendingUp, Trash2, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import { getOtifColorClass } from '../../utils/otifColors';

const TopStats = ({ kpiData }) => {
  const stats = [
    {
      id: 'otif',
      label: 'OTIF (On Time, In Full)',
      value: `${kpiData?.otif?.current || 87}%`,
      baseline: `Baseline: ${kpiData?.otif?.baseline || 55}%`,
      goal: `Goal: ${kpiData?.otif?.goal || 95}%`,
      improving: kpiData?.otif?.improving ?? true,
      change: kpiData?.otif?.change || 32,
      icon: CheckCircle,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      valueColor: 'text-blue-900'
    },
    {
      id: 'expiry',
      label: 'Expiry Rate',
      value: `${kpiData?.expiryRate?.current || 3.2}%`,
      baseline: `Baseline: ${kpiData?.expiryRate?.baseline || 5}%`,
      goal: `Goal: ${kpiData?.expiryRate?.goal || 1}%`,
      improving: kpiData?.expiryRate?.improving ?? true,
      change: kpiData?.expiryRate?.change || 1.8,
      icon: Calendar,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      valueColor: 'text-orange-900',
      inverse: true
    },
    {
      id: 'overConsumption',
      label: 'Over Consumption',
      value: `${kpiData?.overConsumption?.current || 12}%`,
      baseline: `Baseline: ${kpiData?.overConsumption?.baseline || 15}%`,
      goal: `Goal: ${kpiData?.overConsumption?.goal || 8}%`,
      improving: kpiData?.overConsumption?.improving ?? true,
      change: kpiData?.overConsumption?.change || 3,
      icon: TrendingUp,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      valueColor: 'text-red-900',
      inverse: true
    },
    {
      id: 'wastage',
      label: 'Wastage Rate',
      value: `${kpiData?.wastageRate?.current || 2.8}%`,
      baseline: `Baseline: ${kpiData?.wastageRate?.baseline || 4}%`,
      goal: `Goal: ${kpiData?.wastageRate?.goal || 1}%`,
      improving: kpiData?.wastageRate?.improving ?? true,
      change: kpiData?.wastageRate?.change || 1.2,
      icon: Trash2,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      valueColor: 'text-purple-900',
      inverse: true
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.inverse ? stat.change > 0 : stat.change > 0;
        
        return (
          <div
            key={stat.id}
            className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl p-4 border ${stat.borderColor} hover:shadow-md transition-all duration-300 group`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className={`${stat.textColor} text-xs font-medium mb-1`}>{stat.label}</p>
                <p className={`text-2xl font-bold ${
                  stat.id === 'otif' 
                    ? getOtifColorClass(kpiData?.otif?.current || 87)
                    : stat.valueColor
                }`}>{stat.value}</p>
              </div>
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-opacity-30" style={{ borderColor: 'currentColor' }}>
              <div className="text-xs space-y-0.5">
                <p className={`${stat.textColor} opacity-75`}>{stat.baseline}</p>
                <p className={`${stat.textColor} opacity-75`}>{stat.goal}</p>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {isPositive ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                <span>{Math.abs(stat.change).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopStats;
