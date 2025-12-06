export const labelCategories = [
  {
    id: 'over-stocking',
    name: 'Over-Stocking',
    description: 'Products with excess inventory',
    icon: 'PackagePlus',
    affectedProducts: 23,
    totalValue: 2450000,
    trend: 'improving',
    trendPercentage: -12,
    severity: 'critical',
    weeklyHistory: [28, 26, 25, 24, 23, 22, 23],
    kpis: [
      { id: 'excess-inventory', label: 'Excess Inventory Value', goal: 0, baseline: 400000, current: 250000, unit: '₹', lastWeek: 280000, monthlyTillDate: 265000 },
      { id: 'storage-cost', label: 'Storage Cost Impact', goal: 2, baseline: 8, current: 5, unit: '%', lastWeek: 5.5, monthlyTillDate: 5.2 },
      { id: 'capital-blocked', label: 'Capital Blocked', goal: 100000, baseline: 500000, current: 350000, unit: '₹', lastWeek: 380000, monthlyTillDate: 360000 },
      { id: 'turnover-ratio', label: 'Turnover Ratio', goal: 12, baseline: 4, current: 6, unit: 'x/year', lastWeek: 5.5, monthlyTillDate: 5.8 }
    ]
  },
  {
    id: 'under-stocking',
    name: 'Under-Stocking',
    description: 'Products below optimal levels',
    icon: 'PackageMinus',
    affectedProducts: 18,
    totalValue: 1890000,
    trend: 'worsening',
    trendPercentage: 8,
    severity: 'critical',
    weeklyHistory: [14, 15, 16, 17, 18, 18, 18],
    kpis: [
      { id: 'stockout-frequency', label: 'Stockout Frequency', goal: 2, baseline: 12, current: 8, unit: '/month', lastWeek: 9, monthlyTillDate: 8.5 },
      { id: 'emergency-purchase', label: 'Emergency Purchase Rate', goal: 5, baseline: 25, current: 18, unit: '%', lastWeek: 20, monthlyTillDate: 19 },
      { id: 'service-level', label: 'Service Level', goal: 98, baseline: 75, current: 85, unit: '%', lastWeek: 83, monthlyTillDate: 84 },
      { id: 'patient-impact', label: 'Patient Impact Score', goal: 5, baseline: 35, current: 22, unit: '/100', lastWeek: 25, monthlyTillDate: 23 }
    ]
  },
  {
    id: 'expiry-risk',
    name: 'Expiry Risk',
    description: 'Products nearing expiry (< 30 days)',
    icon: 'Clock',
    affectedProducts: 12,
    totalValue: 980000,
    trend: 'improving',
    trendPercentage: -5,
    severity: 'moderate',
    weeklyHistory: [15, 14, 13, 13, 12, 12, 12],
    kpis: [
      { id: 'expiry-rate', label: 'Expiry Rate', goal: 1, baseline: 5, current: 3.2, unit: '%', lastWeek: 3.5, monthlyTillDate: 3.3 },
      { id: 'value-at-risk', label: 'Value at Risk', goal: 50000, baseline: 300000, current: 180000, unit: '₹', lastWeek: 200000, monthlyTillDate: 190000 },
      { id: 'days-to-expiry', label: 'Days to Expiry (Avg)', goal: 90, baseline: 15, current: 25, unit: 'days', lastWeek: 22, monthlyTillDate: 24 },
      { id: 'write-off-cost', label: 'Write-off Cost', goal: 20000, baseline: 150000, current: 95000, unit: '₹', lastWeek: 105000, monthlyTillDate: 98000 }
    ]
  },
  {
    id: 'wastage',
    name: 'Wastage',
    description: 'Products wasted due to expiry or damage',
    icon: 'Trash2',
    affectedProducts: 8,
    totalValue: 560000,
    trend: 'stable',
    trendPercentage: 0,
    severity: 'moderate',
    weeklyHistory: [8, 8, 9, 8, 8, 7, 8],
    kpis: [
      { id: 'wastage-rate', label: 'Wastage Rate', goal: 1, baseline: 4, current: 2.8, unit: '%', lastWeek: 2.9, monthlyTillDate: 2.85 },
      { id: 'wastage-cost', label: 'Wastage Cost', goal: 30000, baseline: 200000, current: 120000, unit: '₹', lastWeek: 130000, monthlyTillDate: 125000 },
      { id: 'disposal-cost', label: 'Disposal Cost', goal: 10000, baseline: 50000, current: 35000, unit: '₹', lastWeek: 38000, monthlyTillDate: 36000 },
      { id: 'environmental-impact', label: 'Environmental Impact Score', goal: 20, baseline: 80, current: 55, unit: '', lastWeek: 58, monthlyTillDate: 56 }
    ]
  },
  {
    id: 'dead-stock',
    name: 'Dead Stock',
    description: 'Products with no movement (> 90 days)',
    icon: 'PackageX',
    affectedProducts: 15,
    totalValue: 1250000,
    trend: 'worsening',
    trendPercentage: 10,
    severity: 'critical',
    weeklyHistory: [12, 13, 13, 14, 14, 15, 15],
    kpis: [
      { id: 'dead-stock-value', label: 'Dead Stock Value', goal: 0, baseline: 1500000, current: 1250000, unit: '₹', lastWeek: 1200000, monthlyTillDate: 1225000 },
      { id: 'dead-stock-skus', label: 'Dead Stock SKUs', goal: 0, baseline: 20, current: 15, unit: '', lastWeek: 14, monthlyTillDate: 15 },
      { id: 'days-since-movement', label: 'Avg Days Since Movement', goal: 0, baseline: 120, current: 95, unit: 'days', lastWeek: 92, monthlyTillDate: 94 },
      { id: 'liquidation-potential', label: 'Liquidation Potential', goal: 100, baseline: 40, current: 65, unit: '%', lastWeek: 62, monthlyTillDate: 64 }
    ]
  },
  {
    id: 'stockout-risk',
    name: 'Stockout Risk',
    description: 'Products at critical low levels',
    icon: 'AlertTriangle',
    affectedProducts: 6,
    totalValue: 450000,
    trend: 'improving',
    trendPercentage: -15,
    severity: 'moderate',
    weeklyHistory: [9, 8, 7, 7, 6, 6, 6],
    kpis: [
      { id: 'critical-items', label: 'Critical Items Count', goal: 0, baseline: 15, current: 6, unit: '', lastWeek: 7, monthlyTillDate: 6 },
      { id: 'days-of-stock', label: 'Avg Days of Stock', goal: 30, baseline: 5, current: 12, unit: 'days', lastWeek: 10, monthlyTillDate: 11 },
      { id: 'reorder-pending', label: 'Reorder Pending', goal: 0, baseline: 12, current: 4, unit: '', lastWeek: 5, monthlyTillDate: 4 },
      { id: 'stockout-probability', label: 'Stockout Probability', goal: 0, baseline: 45, current: 18, unit: '%', lastWeek: 22, monthlyTillDate: 20 }
    ]
  },
  {
    id: 'high-velocity',
    name: 'High Velocity',
    description: 'Fast-moving products requiring attention',
    icon: 'Zap',
    affectedProducts: 28,
    totalValue: 4500000,
    trend: 'stable',
    trendPercentage: 2,
    severity: 'normal',
    weeklyHistory: [26, 27, 27, 28, 28, 28, 28],
    kpis: [
      { id: 'velocity-index', label: 'Velocity Index', goal: 100, baseline: 60, current: 85, unit: '', lastWeek: 83, monthlyTillDate: 84 },
      { id: 'replenishment-cycle', label: 'Replenishment Cycle', goal: 3, baseline: 7, current: 4, unit: 'days', lastWeek: 4.5, monthlyTillDate: 4.2 },
      { id: 'demand-forecast-accuracy', label: 'Demand Forecast Accuracy', goal: 95, baseline: 70, current: 88, unit: '%', lastWeek: 86, monthlyTillDate: 87 },
      { id: 'buffer-stock-level', label: 'Buffer Stock Level', goal: 100, baseline: 50, current: 82, unit: '%', lastWeek: 80, monthlyTillDate: 81 }
    ]
  },
  {
    id: 'slow-moving',
    name: 'Slow Moving',
    description: 'Products with declining consumption',
    icon: 'TrendingDown',
    affectedProducts: 19,
    totalValue: 890000,
    trend: 'worsening',
    trendPercentage: 5,
    severity: 'moderate',
    weeklyHistory: [16, 17, 17, 18, 18, 19, 19],
    kpis: [
      { id: 'slow-moving-value', label: 'Slow Moving Value', goal: 0, baseline: 1200000, current: 890000, unit: '₹', lastWeek: 850000, monthlyTillDate: 870000 },
      { id: 'consumption-decline', label: 'Consumption Decline', goal: 0, baseline: 40, current: 25, unit: '%', lastWeek: 27, monthlyTillDate: 26 },
      { id: 'shelf-life-remaining', label: 'Avg Shelf Life Remaining', goal: 180, baseline: 90, current: 120, unit: 'days', lastWeek: 115, monthlyTillDate: 118 },
      { id: 'redistribution-rate', label: 'Redistribution Rate', goal: 80, baseline: 20, current: 45, unit: '%', lastWeek: 42, monthlyTillDate: 44 }
    ]
  },
  {
    id: 'emergency-shortage',
    name: 'Emergency Shortage',
    description: 'Critical medicines running low',
    icon: 'AlertOctagon',
    affectedProducts: 4,
    totalValue: 380000,
    trend: 'improving',
    trendPercentage: -20,
    severity: 'normal',
    weeklyHistory: [7, 6, 5, 5, 4, 4, 4],
    kpis: [
      { id: 'emergency-items', label: 'Emergency Items Count', goal: 0, baseline: 10, current: 4, unit: '', lastWeek: 5, monthlyTillDate: 4 },
      { id: 'coverage-gap', label: 'Coverage Gap', goal: 0, baseline: 30, current: 12, unit: '%', lastWeek: 15, monthlyTillDate: 13 },
      { id: 'lead-time-critical', label: 'Critical Lead Time', goal: 2, baseline: 8, current: 4, unit: 'days', lastWeek: 5, monthlyTillDate: 4.5 },
      { id: 'alternative-availability', label: 'Alternative Availability', goal: 100, baseline: 50, current: 78, unit: '%', lastWeek: 75, monthlyTillDate: 77 }
    ]
  },
  {
    id: 'cost-overrun',
    name: 'Cost Overrun',
    description: 'Products exceeding budget allocation',
    icon: 'DollarSign',
    affectedProducts: 11,
    totalValue: 1680000,
    trend: 'worsening',
    trendPercentage: 8,
    severity: 'moderate',
    weeklyHistory: [9, 9, 10, 10, 11, 11, 11],
    kpis: [
      { id: 'budget-variance', label: 'Budget Variance', goal: 0, baseline: 25, current: 15, unit: '%', lastWeek: 16, monthlyTillDate: 15.5 },
      { id: 'overrun-value', label: 'Overrun Value', goal: 0, baseline: 2500000, current: 1680000, unit: '₹', lastWeek: 1600000, monthlyTillDate: 1640000 },
      { id: 'price-deviation', label: 'Price Deviation', goal: 0, baseline: 18, current: 12, unit: '%', lastWeek: 13, monthlyTillDate: 12.5 },
      { id: 'contract-compliance', label: 'Contract Compliance', goal: 100, baseline: 70, current: 85, unit: '%', lastWeek: 83, monthlyTillDate: 84 }
    ]
  }
];

export const generateKPITrendData = (kpi, days = 7) => {
  const data = [];
  const baseValue = kpi.current;
  const variance = (kpi.baseline - kpi.goal) * 0.1;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const randomVariance = (Math.random() - 0.5) * variance * 2;
    data.push({
      name: dayName,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.max(0, baseValue + randomVariance + (i * variance * 0.1))
    });
  }
  return data;
};

export const getHealthScore = () => {
  const criticalCount = labelCategories.filter(l => l.severity === 'critical').length;
  const moderateCount = labelCategories.filter(l => l.severity === 'moderate').length;
  const baseScore = 100 - (criticalCount * 15) - (moderateCount * 5);
  return Math.max(0, Math.min(100, baseScore));
};

export const getTotalStats = () => {
  return {
    totalSKUs: labelCategories.reduce((sum, l) => sum + l.affectedProducts, 0),
    totalValue: labelCategories.reduce((sum, l) => sum + l.totalValue, 0),
    activeAlerts: labelCategories.filter(l => l.severity === 'critical' || l.severity === 'moderate').length
  };
};

export const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-100' };
    case 'moderate': return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-100' };
    case 'normal': return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-100' };
    default: return { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-700', badge: 'bg-slate-100' };
  }
};

export const getSeverityFromCount = (count) => {
  if (count >= 16) return 'critical';
  if (count >= 6) return 'moderate';
  return 'normal';
};