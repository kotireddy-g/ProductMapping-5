// Two sets of synthetic data for before/after upload simulation

export const dataSet1 = {
  otifPercentage: 88.9,
  labelCategories: [
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
    }
  ]
};

export const dataSet2 = {
  otifPercentage: 97.1,
  labelCategories: [
    {
      id: 'over-stocking',
      name: 'Over-Stocking',
      description: 'Products with excess inventory',
      icon: 'PackagePlus',
      affectedProducts: 15,
      totalValue: 1650000,
      trend: 'improving',
      trendPercentage: -18,
      severity: 'moderate',
      weeklyHistory: [23, 21, 19, 17, 15, 14, 15],
    },
    {
      id: 'under-stocking',
      name: 'Under-Stocking',
      description: 'Products below optimal levels',
      icon: 'PackageMinus',
      affectedProducts: 8,
      totalValue: 890000,
      trend: 'improving',
      trendPercentage: -25,
      severity: 'moderate',
      weeklyHistory: [18, 16, 14, 12, 10, 8, 8],
    },
    {
      id: 'expiry-risk',
      name: 'Expiry Risk',
      description: 'Products nearing expiry (< 30 days)',
      icon: 'Clock',
      affectedProducts: 6,
      totalValue: 480000,
      trend: 'improving',
      trendPercentage: -15,
      severity: 'normal',
      weeklyHistory: [12, 11, 10, 8, 7, 6, 6],
    }
  ]
};

export const notifications = {
  dataSet1: [
    {
      id: 'notif-1',
      title: 'OTIF Alert: Critical Level',
      message: 'Current OTIF at 88.9% - Below target of 98%',
      type: 'critical',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      category: 'OTIF'
    },
    {
      id: 'notif-2',
      title: 'Over-stocking Alert',
      message: '23 products showing excess inventory worth ₹24.5L',
      type: 'warning',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      category: 'Inventory'
    },
    {
      id: 'notif-3',
      title: 'Under-stocking Risk',
      message: '18 products below optimal levels - Immediate action needed',
      type: 'critical',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      category: 'Stock'
    },
    {
      id: 'notif-4',
      title: 'Expiry Alert',
      message: '12 products nearing expiry within 30 days',
      type: 'warning',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      category: 'Expiry'
    },
    {
      id: 'notif-5',
      title: 'Recommendation',
      message: 'Consider redistributing slow-moving stock to improve OTIF',
      type: 'info',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      category: 'Optimization'
    }
  ],
  dataSet2: [
    {
      id: 'notif-6',
      title: 'OTIF Improved!',
      message: 'Current OTIF at 97.1% - Significant improvement achieved',
      type: 'success',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      category: 'OTIF'
    },
    {
      id: 'notif-7',
      title: 'Inventory Optimization',
      message: 'Over-stocking reduced by 35% - Great progress!',
      type: 'success',
      timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      category: 'Inventory'
    },
    {
      id: 'notif-8',
      title: 'Stock Levels Stabilized',
      message: 'Under-stocking issues reduced to 8 products',
      type: 'success',
      timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      category: 'Stock'
    },
    {
      id: 'notif-9',
      title: 'Expiry Management',
      message: 'Products at expiry risk reduced to 6 items',
      type: 'info',
      timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      category: 'Expiry'
    },
    {
      id: 'notif-10',
      title: 'Target Achievement',
      message: 'On track to achieve 98% OTIF target this month',
      type: 'success',
      timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
      category: 'Target'
    }
  ]
};
