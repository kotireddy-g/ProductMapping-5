// Comprehensive KPI data with consistent trends for all visualizations

// Generate realistic time-series data
const generateTimeSeriesData = (baseValue, variance = 0.1, trend = 0, points = 24) => {
  const data = [];
  for (let i = 0; i < points; i++) {
    const trendValue = baseValue + (trend * i);
    const randomVariance = (Math.random() - 0.5) * 2 * variance * baseValue;
    const value = Math.max(0, trendValue + randomVariance);
    data.push({
      time: i < 12 ? `${i + 1}:00` : `${i - 11}:00`,
      hour: i + 1,
      value: Math.round(value * 100) / 100
    });
  }
  return data;
};

// Generate weekly data
const generateWeeklyData = (baseValue, variance = 0.1, trend = 0, points = 8) => {
  const data = [];
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
  for (let i = 0; i < points; i++) {
    const trendValue = baseValue + (trend * i);
    const randomVariance = (Math.random() - 0.5) * 2 * variance * baseValue;
    const value = Math.max(0, trendValue + randomVariance);
    data.push({
      period: weeks[i],
      week: i + 1,
      value: Math.round(value * 100) / 100
    });
  }
  return data;
};

// Generate daily data for last 7 days
const generateDailyData = (baseValue, variance = 0.1, trend = 0) => {
  const data = [];
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  dates.forEach((date, i) => {
    const trendValue = baseValue + (trend * i);
    const randomVariance = (Math.random() - 0.5) * 2 * variance * baseValue;
    const value = Math.max(0, trendValue + randomVariance);
    data.push({
      date,
      day: i + 1,
      value: Math.round(value * 100) / 100
    });
  });
  return data;
};

// Main KPI definitions with comprehensive data
export const mainKPIs = {
  'stock-out-frequency': {
    id: 'stock-out-frequency',
    name: 'Stock-out Frequency',
    unit: 'incidents',
    target: 2,
    current: 15,
    forecast: 8,
    trend: 'improving',
    priority: 'critical',
    description: 'Number of stock-out incidents per month',
    category: 'Inventory Management',
    
    // Time series data
    hourlyData: {
      expected: generateTimeSeriesData(12, 0.2, -0.1),
      actual: generateTimeSeriesData(15, 0.3, -0.2),
      goal: Array(24).fill().map((_, i) => ({ time: i < 12 ? `${i + 1}:00` : `${i - 11}:00`, value: 2 }))
    },
    
    weeklyData: {
      current: generateWeeklyData(15, 0.2, -0.5),
      forecast: generateWeeklyData(8, 0.15, -0.3),
      target: Array(8).fill().map((_, i) => ({ period: `Week ${i + 1}`, value: 2 }))
    },
    
    dailyData: {
      goal: generateDailyData(2, 0.1, 0),
      actual: generateDailyData(15, 0.3, -0.5),
      forecast: generateDailyData(8, 0.2, -0.2)
    }
  },

  'delivery-performance': {
    id: 'delivery-performance',
    name: 'Delivery Performance',
    unit: '%',
    target: 98,
    current: 88.9,
    forecast: 94.5,
    trend: 'improving',
    priority: 'medium',
    description: 'On-time delivery performance percentage',
    category: 'Supply Chain',
    
    hourlyData: {
      expected: generateTimeSeriesData(95, 0.05, 0.1),
      actual: generateTimeSeriesData(88.9, 0.08, 0.2),
      goal: Array(24).fill().map((_, i) => ({ time: i < 12 ? `${i + 1}:00` : `${i - 11}:00`, value: 98 }))
    },
    
    weeklyData: {
      current: generateWeeklyData(88.9, 0.05, 0.3),
      forecast: generateWeeklyData(94.5, 0.03, 0.2),
      target: Array(8).fill().map((_, i) => ({ period: `Week ${i + 1}`, value: 98 }))
    },
    
    dailyData: {
      goal: generateDailyData(98, 0.01, 0),
      actual: generateDailyData(88.9, 0.05, 0.3),
      forecast: generateDailyData(94.5, 0.03, 0.2)
    }
  },

  'inventory-turnover': {
    id: 'inventory-turnover',
    name: 'Inventory Turnover',
    unit: 'times/year',
    target: 6.0,
    current: 4.2,
    forecast: 5.1,
    trend: 'improving',
    priority: 'medium',
    description: 'Number of times inventory is sold per year',
    category: 'Inventory Management',
    
    hourlyData: {
      expected: generateTimeSeriesData(5.5, 0.1, 0.02),
      actual: generateTimeSeriesData(4.2, 0.15, 0.05),
      goal: Array(24).fill().map((_, i) => ({ time: i < 12 ? `${i + 1}:00` : `${i - 11}:00`, value: 6.0 }))
    },
    
    weeklyData: {
      current: generateWeeklyData(4.2, 0.1, 0.1),
      forecast: generateWeeklyData(5.1, 0.08, 0.08),
      target: Array(8).fill().map((_, i) => ({ period: `Week ${i + 1}`, value: 6.0 }))
    },
    
    dailyData: {
      goal: generateDailyData(6.0, 0.02, 0),
      actual: generateDailyData(4.2, 0.1, 0.1),
      forecast: generateDailyData(5.1, 0.08, 0.08)
    }
  },

  'cost-efficiency': {
    id: 'cost-efficiency',
    name: 'Cost Efficiency',
    unit: '%',
    target: 85,
    current: 76.3,
    forecast: 82.1,
    trend: 'improving',
    priority: 'medium',
    description: 'Cost efficiency percentage',
    category: 'Financial Performance',
    
    hourlyData: {
      expected: generateTimeSeriesData(80, 0.05, 0.1),
      actual: generateTimeSeriesData(76.3, 0.08, 0.15),
      goal: Array(24).fill().map((_, i) => ({ time: i < 12 ? `${i + 1}:00` : `${i - 11}:00`, value: 85 }))
    },
    
    weeklyData: {
      current: generateWeeklyData(76.3, 0.05, 0.2),
      forecast: generateWeeklyData(82.1, 0.03, 0.1),
      target: Array(8).fill().map((_, i) => ({ period: `Week ${i + 1}`, value: 85 }))
    },
    
    dailyData: {
      goal: generateDailyData(85, 0.01, 0),
      actual: generateDailyData(76.3, 0.05, 0.2),
      forecast: generateDailyData(82.1, 0.03, 0.1)
    }
  }
};

// Related KPIs for each main KPI
export const relatedKPIs = {
  'stock-out-frequency': [
    {
      id: 'service-level',
      name: 'Service Level',
      unit: '%',
      target: 99,
      current: 94.5,
      forecast: 97.1,
      trend: 'improving',
      dailyData: {
        goal: generateDailyData(99, 0.01, 0),
        actual: generateDailyData(94.5, 0.03, 0.15),
        forecast: generateDailyData(97.1, 0.02, 0.1)
      }
    },
    {
      id: 'safety-stock-level',
      name: 'Safety Stock Level',
      unit: 'days',
      target: 7,
      current: 4.5,
      forecast: 6.2,
      trend: 'improving',
      dailyData: {
        goal: generateDailyData(7, 0.05, 0),
        actual: generateDailyData(4.5, 0.1, 0.1),
        forecast: generateDailyData(6.2, 0.08, 0.08)
      }
    },
    {
      id: 'demand-variability',
      name: 'Demand Variability',
      unit: '%',
      target: 15,
      current: 28.3,
      forecast: 22.1,
      trend: 'improving',
      dailyData: {
        goal: generateDailyData(15, 0.1, 0),
        actual: generateDailyData(28.3, 0.15, -0.3),
        forecast: generateDailyData(22.1, 0.1, -0.2)
      }
    }
  ],

  'delivery-performance': [
    {
      id: 'supplier-reliability',
      name: 'Supplier Reliability',
      unit: '%',
      target: 95,
      current: 87.2,
      forecast: 91.8,
      trend: 'improving',
      dailyData: {
        goal: generateDailyData(95, 0.02, 0),
        actual: generateDailyData(87.2, 0.05, 0.2),
        forecast: generateDailyData(91.8, 0.03, 0.15)
      }
    },
    {
      id: 'lead-time-variance',
      name: 'Lead Time Variance',
      unit: 'days',
      target: 2,
      current: 4.8,
      forecast: 3.2,
      trend: 'improving',
      dailyData: {
        goal: generateDailyData(2, 0.1, 0),
        actual: generateDailyData(4.8, 0.2, -0.1),
        forecast: generateDailyData(3.2, 0.15, -0.08)
      }
    },
    {
      id: 'order-accuracy',
      name: 'Order Accuracy',
      unit: '%',
      target: 99.5,
      current: 96.7,
      forecast: 98.2,
      trend: 'improving',
      dailyData: {
        goal: generateDailyData(99.5, 0.01, 0),
        actual: generateDailyData(96.7, 0.02, 0.1),
        forecast: generateDailyData(98.2, 0.015, 0.08)
      }
    }
  ],

  'inventory-turnover': [
    {
      id: 'carrying-cost',
      name: 'Carrying Cost',
      unit: '%',
      target: 12,
      current: 18.4,
      forecast: 15.2,
      trend: 'improving',
      dailyData: {
        goal: generateDailyData(12, 0.05, 0),
        actual: generateDailyData(18.4, 0.1, -0.2),
        forecast: generateDailyData(15.2, 0.08, -0.15)
      }
    },
    {
      id: 'obsolescence-rate',
      name: 'Obsolescence Rate',
      unit: '%',
      target: 2,
      current: 5.7,
      forecast: 3.8,
      trend: 'improving',
      dailyData: {
        goal: generateDailyData(2, 0.1, 0),
        actual: generateDailyData(5.7, 0.15, -0.1),
        forecast: generateDailyData(3.8, 0.12, -0.08)
      }
    },
    {
      id: 'inventory-accuracy',
      name: 'Inventory Accuracy',
      unit: '%',
      target: 98,
      current: 92.3,
      forecast: 95.6,
      trend: 'improving',
      dailyData: {
        goal: generateDailyData(98, 0.01, 0),
        actual: generateDailyData(92.3, 0.03, 0.15),
        forecast: generateDailyData(95.6, 0.02, 0.12)
      }
    }
  ],

  'cost-efficiency': [
    {
      id: 'procurement-savings',
      name: 'Procurement Savings',
      unit: '%',
      target: 15,
      current: 8.9,
      forecast: 12.4,
      trend: 'improving',
      dailyData: {
        goal: generateDailyData(15, 0.05, 0),
        actual: generateDailyData(8.9, 0.1, 0.2),
        forecast: generateDailyData(12.4, 0.08, 0.15)
      }
    },
    {
      id: 'waste-reduction',
      name: 'Waste Reduction',
      unit: '%',
      target: 5,
      current: 12.6,
      forecast: 8.3,
      trend: 'improving',
      dailyData: {
        goal: generateDailyData(5, 0.1, 0),
        actual: generateDailyData(12.6, 0.15, -0.2),
        forecast: generateDailyData(8.3, 0.12, -0.15)
      }
    },
    {
      id: 'contract-compliance',
      name: 'Contract Compliance',
      unit: '%',
      target: 95,
      current: 87.1,
      forecast: 91.8,
      trend: 'improving',
      dailyData: {
        goal: generateDailyData(95, 0.02, 0),
        actual: generateDailyData(87.1, 0.05, 0.2),
        forecast: generateDailyData(91.8, 0.03, 0.15)
      }
    }
  ]
};

// Summary KPIs for Related KPIs section
export const summaryKPIs = [
  {
    id: 'inventory-turnover-summary',
    name: 'Inventory Turnover',
    current: '4.2x',
    target: '6x',
    status: 'improving'
  },
  {
    id: 'service-level-summary',
    name: 'Service Level',
    current: '94.5%',
    target: '99%',
    status: 'improving'
  },
  {
    id: 'cost-efficiency-summary',
    name: 'Cost Efficiency',
    current: '76.3%',
    target: '85%',
    status: 'improving'
  },
  {
    id: 'stock-accuracy-summary',
    name: 'Stock Accuracy',
    current: '98.1%',
    target: '99%',
    status: 'stable'
  }
];

// Generate deviation data (for area charts)
export const generateDeviationData = (expectedData, actualData) => {
  return expectedData.map((expected, index) => {
    const actual = actualData[index];
    const deviation = actual.value - expected.value;
    return {
      time: expected.time,
      deviation,
      positive: deviation > 0
    };
  });
};

export default {
  mainKPIs,
  relatedKPIs,
  summaryKPIs,
  generateDeviationData
};
