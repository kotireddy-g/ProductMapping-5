import React from 'react';
import { AlertTriangle, TrendingDown, XCircle, Clock } from 'lucide-react';

const ConsumptionStats = ({ stats }) => {
  const items = [
    {
      id: 'overConsumption',
      label: 'Over-Consumption',
      count: stats?.overConsumption?.count || 12,
      percentage: stats?.overConsumption?.percentage || '15',
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-500',
      textColor: 'text-red-700',
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      id: 'underConsumption',
      label: 'Under-Consumption',
      count: stats?.underConsumption?.count || 8,
      percentage: stats?.underConsumption?.percentage || '10',
      icon: TrendingDown,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      badgeColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'deadStock',
      label: 'Dead Stock',
      count: stats?.deadStock?.count || 5,
      percentage: stats?.deadStock?.percentage || '6',
      icon: XCircle,
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      iconBg: 'bg-slate-500',
      textColor: 'text-slate-700',
      badgeColor: 'bg-slate-100 text-slate-800'
    },
    {
      id: 'expiryNear',
      label: 'Expiry Near (<30 days)',
      count: stats?.expiryNear?.count || 7,
      percentage: stats?.expiryNear?.percentage || '9',
      icon: Clock,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-500',
      textColor: 'text-orange-700',
      badgeColor: 'bg-orange-100 text-orange-800'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mt-6">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className={`${item.bgColor} rounded-xl p-4 border ${item.borderColor} hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${item.iconBg} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className={`text-xs font-medium ${item.textColor} mb-1`}>{item.label}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-bold ${item.textColor}`}>{item.count}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConsumptionStats;
