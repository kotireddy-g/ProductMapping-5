// Core Labels Data with OTIF-based priorities
export const coreLabels = [
  {
    id: 'usage-velocity',
    name: 'Usage / Velocity Labels',
    description: 'How fast items move through inventory',
    icon: 'Zap',
    category: 'Usage/Velocity',
    examples: ['Fast moving', 'Medium moving', 'Slow moving', 'Non-moving'],
    dataSet1: {
      otifPercentage: 89.2,
      priority: 'P1', // Below 95% = P1 (Medium)
      affectedProducts: 45,
      totalValue: 3200000,
      trend: 'declining',
      issues: ['High demand variability', 'Supply chain delays']
    },
    dataSet2: {
      otifPercentage: 97.8,
      priority: 'Normal', // Above 95% = Normal
      affectedProducts: 45,
      totalValue: 3200000,
      trend: 'improving',
      issues: ['Optimized inventory levels']
    }
  },
  {
    id: 'stock-position',
    name: 'Stock Position Labels',
    description: 'How healthy the stock level is',
    icon: 'Package',
    category: 'Stock Position',
    examples: ['Stockout', 'Critical low stock', 'Healthy stock', 'Overstock'],
    dataSet1: {
      otifPercentage: 82.4,
      priority: 'P0', // Below 85% = P0 (Critical)
      affectedProducts: 38,
      totalValue: 2800000,
      trend: 'declining',
      issues: ['Critical stock levels', 'Immediate action required']
    },
    dataSet2: {
      otifPercentage: 95.9,
      priority: 'Normal', // Above 95% = Normal
      affectedProducts: 38,
      totalValue: 2800000,
      trend: 'improving',
      issues: ['Stock levels stabilized']
    }
  },
  {
    id: 'expiry-shelf-life',
    name: 'Expiry / Shelf-life Labels',
    description: 'Items based on remaining shelf life',
    icon: 'Clock',
    category: 'Expiry/Shelf-life',
    examples: ['Expiring imminent', 'Near expiry', 'Long shelf life', 'Expired'],
    dataSet1: {
      otifPercentage: 87.8,
      priority: 'P1', // Below 95% = P1
      affectedProducts: 32,
      totalValue: 1800000,
      trend: 'stable',
      issues: ['Near expiry items', 'Wastage concerns']
    },
    dataSet2: {
      otifPercentage: 95.4,
      priority: 'Normal', // Above 95% = Normal
      affectedProducts: 32,
      totalValue: 1800000,
      trend: 'improving',
      issues: ['Expiry management optimized']
    }
  },
  {
    id: 'demand-pattern',
    name: 'Demand Pattern & Predictability Labels',
    description: 'How demand behaves over time',
    icon: 'TrendingUp',
    category: 'Demand Pattern & Predictability',
    examples: ['Stable demand', 'Volatile demand', 'Seasonal demand', 'Unpredictable'],
    dataSet1: {
      otifPercentage: 88.7,
      priority: 'P1', // Below 95% = P1
      affectedProducts: 24,
      totalValue: 1500000,
      trend: 'volatile',
      issues: ['Demand unpredictability', 'Seasonal variations']
    },
    dataSet2: {
      otifPercentage: 96.8,
      priority: 'Normal', // Above 95% = Normal
      affectedProducts: 24,
      totalValue: 1500000,
      trend: 'stable',
      issues: ['Demand forecasting improved']
    }
  },
  {
    id: 'criticality-service',
    name: 'Criticality & Service Level Labels',
    description: 'Priority based on criticality and service requirements',
    icon: 'Heart',
    category: 'Criticality & Service Level',
    examples: ['Life-saving', 'High criticality', 'Medium criticality', 'Low criticality'],
    dataSet1: {
      otifPercentage: 91.5,
      priority: 'P1', // Below 95% = P1
      affectedProducts: 28,
      totalValue: 4500000,
      trend: 'stable',
      issues: ['Stockout risk', 'High criticality items']
    },
    dataSet2: {
      otifPercentage: 98.9,
      priority: 'Normal', // Above 95% = Normal
      affectedProducts: 28,
      totalValue: 4500000,
      trend: 'improving',
      issues: ['Excellent service levels maintained']
    }
  },
  {
    id: 'value-cost-impact',
    name: 'Value / Cost Impact Labels',
    description: 'Items categorized by financial impact',
    icon: 'DollarSign',
    category: 'Value/Cost Impact',
    examples: ['High value item', 'Medium value', 'Low value', 'High margin item'],
    dataSet1: {
      otifPercentage: 85.3,
      priority: 'P0', // Below 85% = P0 (Critical)
      affectedProducts: 15,
      totalValue: 8900000,
      trend: 'declining',
      issues: ['Cost optimization needed', 'Inventory management challenges']
    },
    dataSet2: {
      otifPercentage: 96.2,
      priority: 'Normal', // Above 95% = Normal
      affectedProducts: 15,
      totalValue: 8900000,
      trend: 'improving',
      issues: ['Cost-effective procurement achieved']
    }
  },
  {
    id: 'policy-handling',
    name: 'Policy / Handling Labels',
    description: 'Items with special rules and constraints',
    icon: 'Shield',
    category: 'Policy/Handling',
    examples: ['Restricted use', 'Controlled substance', 'Cold chain item', 'Kit component'],
    dataSet1: {
      otifPercentage: 93.1,
      priority: 'P1', // Below 95% = P1
      affectedProducts: 18,
      totalValue: 2100000,
      trend: 'stable',
      issues: ['Compliance requirements', 'Documentation delays']
    },
    dataSet2: {
      otifPercentage: 97.6,
      priority: 'Normal', // Above 95% = Normal
      affectedProducts: 18,
      totalValue: 2100000,
      trend: 'improving',
      issues: ['Compliance streamlined']
    }
  }
];

// Priority classification based on OTIF percentage
export const getPriorityFromOtif = (otifPercentage) => {
  if (otifPercentage < 85) return 'P0'; // Critical
  if (otifPercentage < 95) return 'P1'; // Medium
  return 'Normal'; // Above 95%
};

// Priority colors
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'P0':
      return {
        bg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-700',
        badge: 'bg-red-500 text-white',
        icon: 'text-red-600'
      };
    case 'P1':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        text: 'text-orange-700',
        badge: 'bg-orange-500 text-white',
        icon: 'text-orange-600'
      };
    case 'P2':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-300',
        text: 'text-yellow-700',
        badge: 'bg-yellow-500 text-white',
        icon: 'text-yellow-600'
      };
    case 'Normal':
    default:
      return {
        bg: 'bg-green-50',
        border: 'border-green-300',
        text: 'text-green-700',
        badge: 'bg-green-500 text-white',
        icon: 'text-green-600'
      };
  }
};

// Calculate overall OTIF and priority counts
export const calculateOverallMetrics = (dataSet) => {
  const labels = coreLabels.map(label => ({
    ...label,
    ...label[`dataSet${dataSet}`]
  }));

  // Calculate weighted OTIF based on total value
  const totalValue = labels.reduce((sum, label) => sum + label.totalValue, 0);
  const weightedOtif = labels.reduce((sum, label) => 
    sum + (label.otifPercentage * label.totalValue / totalValue), 0
  );

  // Count priorities
  const priorityCounts = {
    P0: labels.filter(l => l.priority === 'P0').length,
    P1: labels.filter(l => l.priority === 'P1').length,
    P2: labels.filter(l => l.priority === 'P2').length,
    Normal: labels.filter(l => l.priority === 'Normal').length
  };

  return {
    overallOtif: Math.round(weightedOtif * 10) / 10,
    priorityCounts,
    totalLabels: labels.length,
    totalProducts: labels.reduce((sum, label) => sum + label.affectedProducts, 0),
    totalValue: totalValue
  };
};

// Search suggestions for auto-complete
export const searchSuggestions = [
  // KPIs
  { id: 'otif', name: 'OTIF', type: 'kpi', description: 'On-Time In-Full delivery performance' },
  { id: 'stock-turnover', name: 'Stock Turnover', type: 'kpi', description: 'Inventory turnover ratio' },
  { id: 'service-level', name: 'Service Level', type: 'kpi', description: 'Customer service performance' },
  { id: 'cost-efficiency', name: 'Cost Efficiency', type: 'kpi', description: 'Cost optimization metrics' },
  
  // Categories
  { id: 'icu', name: 'ICU', type: 'category', description: 'Intensive Care Unit medications' },
  { id: 'ot', name: 'OT', type: 'category', description: 'Operation Theater supplies' },
  { id: 'emergency', name: 'Emergency', type: 'category', description: 'Emergency department items' },
  { id: 'opd', name: 'OPD', type: 'category', description: 'Outpatient Department medicines' },
  { id: 'ipd', name: 'IPD', type: 'category', description: 'Inpatient Department supplies' },
  { id: 'pharmacy', name: 'Pharmacy', type: 'category', description: 'General pharmacy items' },
  { id: 'lab', name: 'Lab', type: 'category', description: 'Laboratory supplies and reagents' },
  
  // Labels
  ...coreLabels.map(label => ({
    id: label.id,
    name: label.name,
    type: 'label',
    description: label.description
  }))
];
