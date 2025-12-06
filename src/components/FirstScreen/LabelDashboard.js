import React, { useMemo } from 'react';
import { Zap, Heart, DollarSign, Clock, Shield, TrendingUp, AlertTriangle, Package } from 'lucide-react';
import { coreLabels, calculateOverallMetrics, getPriorityColor } from '../../data/coreLabelsData';

const LabelDashboard = ({ onLabelSelect, currentDataSet = 1 }) => {
  
  // Get current data set metrics
  const metrics = useMemo(() => calculateOverallMetrics(currentDataSet), [currentDataSet]);
  
  // Get labels with current data set values
  const currentLabels = useMemo(() => {
    return coreLabels.map(label => ({
      ...label,
      ...label[`dataSet${currentDataSet}`]
    }));
  }, [currentDataSet]);

  // Icon mapping
  const getIcon = (iconName) => {
    const icons = {
      'Zap': Zap,
      'Heart': Heart,
      'DollarSign': DollarSign,
      'Clock': Clock,
      'Shield': Shield,
      'TrendingUp': TrendingUp,
      'AlertTriangle': AlertTriangle,
      'Package': Package
    };
    return icons[iconName] || AlertTriangle;
  };

  return (
    <div className="space-y-6">
      {/* Priority Counts */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex justify-center gap-8 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Priority (P0): {metrics.priorityCounts.P0}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Medium Priority (P1): {metrics.priorityCounts.P1}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Normal: {metrics.priorityCounts.Normal}</span>
          </div>
        </div>
      </div>

      {/* Core Labels Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {currentLabels.map((label) => {
          const IconComponent = getIcon(label.icon);
          const priorityColors = getPriorityColor(label.priority);
          
          return (
            <div
              key={label.id}
              onClick={() => onLabelSelect(label)}
              className={`${priorityColors.bg} ${priorityColors.border} border-2 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105`}
            >
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <div className={`p-3 bg-white rounded-lg shadow-sm`}>
                  <IconComponent className={`w-8 h-8 ${priorityColors.icon}`} />
                </div>
              </div>
              
              {/* Label Name */}
              <h3 className={`text-sm font-bold ${priorityColors.text} mb-2 text-center`}>
                {label.name}
              </h3>
              
              {/* Product Count */}
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">
                  {label.affectedProducts}
                </div>
                <div className="text-xs text-slate-500">
                  Products
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LabelDashboard;