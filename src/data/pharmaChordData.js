export const pharmaCategories = [
  { id: 'emergency', name: 'Emergency Medicines', color: '#ef4444', gradient: ['#ef4444', '#f87171'] },
  { id: 'ot', name: 'OT Medicines', color: '#8b5cf6', gradient: ['#8b5cf6', '#a78bfa'] },
  { id: 'ward', name: 'Ward Medicines', color: '#3b82f6', gradient: ['#3b82f6', '#60a5fa'] },
  { id: 'daycare', name: 'Daycare Medicines', color: '#06b6d4', gradient: ['#06b6d4', '#22d3ee'] },
  { id: 'general', name: 'General Medicines', color: '#22c55e', gradient: ['#22c55e', '#4ade80'] },
  { id: 'implant', name: 'Implant Medicines', color: '#f97316', gradient: ['#f97316', '#fb923c'] }
];

export const areaOptions = {
  areas: [
    { id: 'icu', name: 'ICU' },
    { id: 'emergency-ward', name: 'Emergency Ward' },
    { id: 'general-ward', name: 'General Ward' },
    { id: 'ot-area', name: 'Operation Theater' },
    { id: 'pharmacy-store', name: 'Pharmacy Store' },
    { id: 'pediatric', name: 'Pediatric Ward' },
    { id: 'maternity', name: 'Maternity Ward' },
    { id: 'outpatient', name: 'Outpatient Dept' }
  ],
  specialities: [
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'neurology', name: 'Neurology' },
    { id: 'orthopedics', name: 'Orthopedics' },
    { id: 'pediatrics', name: 'Pediatrics' },
    { id: 'oncology', name: 'Oncology' },
    { id: 'gastro', name: 'Gastroenterology' },
    { id: 'pulmonology', name: 'Pulmonology' },
    { id: 'nephrology', name: 'Nephrology' }
  ],
  wards: [
    { id: 'icu-ward', name: 'ICU Ward' },
    { id: 'emergency-ward-2', name: 'Emergency Ward' },
    { id: 'general-ward-2', name: 'General Ward' },
    { id: 'private-rooms', name: 'Private Rooms' },
    { id: 'semi-private', name: 'Semi-Private' },
    { id: 'isolation', name: 'Isolation Ward' },
    { id: 'recovery', name: 'Recovery Ward' },
    { id: 'observation', name: 'Observation' }
  ]
};

const generateTimeframeMultiplier = (timeframe) => {
  const multipliers = {
    hourly: 0.042,
    daily: 1,
    weekly: 7,
    monthly: 30,
    quarterly: 90,
    yearly: 365
  };
  return multipliers[timeframe] || 1;
};

const generateFlowMatrix = (timeframe = 'daily') => {
  const multiplier = generateTimeframeMultiplier(timeframe);
  const baseMatrix = {
    areas: [
      [150, 80, 60, 200, 40, 90, 30, 50],
      [40, 30, 25, 280, 50, 20, 15, 35],
      [120, 180, 250, 40, 160, 200, 180, 140],
      [60, 45, 80, 30, 90, 120, 40, 100],
      [200, 160, 220, 80, 180, 140, 120, 250],
      [80, 60, 45, 150, 70, 30, 25, 40]
    ],
    specialities: [
      [200, 120, 80, 60, 140, 50, 110, 90],
      [60, 40, 180, 30, 100, 25, 70, 55],
      [100, 80, 200, 180, 60, 150, 90, 120],
      [50, 70, 45, 220, 40, 35, 80, 60],
      [160, 140, 100, 120, 200, 180, 130, 170],
      [120, 90, 250, 50, 80, 45, 60, 75]
    ],
    wards: [
      [180, 120, 80, 40, 35, 60, 50, 45],
      [50, 40, 30, 25, 20, 35, 180, 40],
      [140, 200, 280, 180, 160, 100, 80, 120],
      [70, 50, 100, 120, 90, 40, 60, 80],
      [180, 160, 240, 200, 180, 120, 100, 140],
      [90, 70, 50, 60, 45, 200, 80, 55]
    ]
  };

  const result = {};
  Object.keys(baseMatrix).forEach(key => {
    result[key] = baseMatrix[key].map(row => 
      row.map(val => Math.round(val * multiplier * (0.8 + Math.random() * 0.4)))
    );
  });
  return result;
};

const generateConsumptionStatus = () => {
  const statuses = ['over', 'normal', 'under', 'dead'];
  const weights = [0.15, 0.55, 0.2, 0.1];
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) return statuses[i];
  }
  return 'normal';
};

export const generateChordData = (filterType = 'areas', timeframe = 'daily') => {
  const matrix = generateFlowMatrix(timeframe);
  const destinations = areaOptions[filterType] || areaOptions.areas;
  
  const connections = [];
  pharmaCategories.forEach((category, sourceIdx) => {
    destinations.forEach((dest, destIdx) => {
      const volume = matrix[filterType]?.[sourceIdx]?.[destIdx] || 
                     Math.round(50 + Math.random() * 200);
      connections.push({
        source: category.id,
        sourceName: category.name,
        sourceColor: category.color,
        target: dest.id,
        targetName: dest.name,
        volume,
        consumption: generateConsumptionStatus(),
        movement: ['fast', 'medium', 'slow', 'occasional'][Math.floor(Math.random() * 4)]
      });
    });
  });
  
  return {
    categories: pharmaCategories,
    destinations,
    connections,
    matrix: matrix[filterType]
  };
};

export const generateKPIData = (timeframe = 'daily') => {
  const getHistoricalData = (baseline, goal, current, days = 7) => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const progress = (days - i) / days;
      const value = baseline + (current - baseline) * progress + (Math.random() - 0.5) * 5;
      data.push({
        day: i === 0 ? 'Today' : `Day ${days - i}`,
        value: Math.max(0, Math.min(100, value)),
        goal
      });
    }
    return data;
  };

  const timeframeFactors = {
    hourly: { otif: 85, expiry: 3.5, overConsumption: 13, wastage: 3.0 },
    daily: { otif: 87, expiry: 3.2, overConsumption: 12, wastage: 2.8 },
    weekly: { otif: 88, expiry: 3.0, overConsumption: 11, wastage: 2.5 },
    monthly: { otif: 89, expiry: 2.8, overConsumption: 10, wastage: 2.2 },
    quarterly: { otif: 90, expiry: 2.5, overConsumption: 9.5, wastage: 2.0 },
    yearly: { otif: 91, expiry: 2.2, overConsumption: 9, wastage: 1.8 }
  };

  const factors = timeframeFactors[timeframe] || timeframeFactors.daily;

  return {
    otif: {
      current: factors.otif,
      baseline: 55,
      goal: 95,
      trend: getHistoricalData(55, 95, factors.otif),
      change: factors.otif - 55,
      improving: true
    },
    expiryRate: {
      current: factors.expiry,
      baseline: 5,
      goal: 1,
      trend: getHistoricalData(5, 1, factors.expiry),
      change: 5 - factors.expiry,
      improving: factors.expiry < 5
    },
    overConsumption: {
      current: factors.overConsumption,
      baseline: 15,
      goal: 8,
      trend: getHistoricalData(15, 8, factors.overConsumption),
      change: 15 - factors.overConsumption,
      improving: factors.overConsumption < 15
    },
    wastageRate: {
      current: factors.wastage,
      baseline: 4,
      goal: 1,
      trend: getHistoricalData(4, 1, factors.wastage),
      change: 4 - factors.wastage,
      improving: factors.wastage < 4
    }
  };
};

export const generateBottomStats = () => {
  const base = {
    overConsumption: { count: 12, percentage: 15 },
    underConsumption: { count: 8, percentage: 10 },
    deadStock: { count: 5, percentage: 6 },
    expiryNear: { count: 7, percentage: 9 }
  };

  return {
    overConsumption: {
      count: Math.round(base.overConsumption.count * (0.8 + Math.random() * 0.4)),
      percentage: (base.overConsumption.percentage * (0.9 + Math.random() * 0.2)).toFixed(1)
    },
    underConsumption: {
      count: Math.round(base.underConsumption.count * (0.8 + Math.random() * 0.4)),
      percentage: (base.underConsumption.percentage * (0.9 + Math.random() * 0.2)).toFixed(1)
    },
    deadStock: {
      count: Math.round(base.deadStock.count * (0.8 + Math.random() * 0.4)),
      percentage: (base.deadStock.percentage * (0.9 + Math.random() * 0.2)).toFixed(1)
    },
    expiryNear: {
      count: Math.round(base.expiryNear.count * (0.8 + Math.random() * 0.4)),
      percentage: (base.expiryNear.percentage * (0.9 + Math.random() * 0.2)).toFixed(1)
    }
  };
};

export const generateKPIGraphData = (timeframe = 'daily') => {
  const getDaysForTimeframe = (tf) => {
    const mapping = { hourly: 24, daily: 7, weekly: 4, monthly: 6, quarterly: 4, yearly: 5 };
    return mapping[tf] || 7;
  };

  const getLabels = (tf, count) => {
    if (tf === 'hourly') return Array.from({ length: count }, (_, i) => `${i}:00`);
    if (tf === 'daily') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, count);
    if (tf === 'weekly') return Array.from({ length: count }, (_, i) => `Week ${i + 1}`);
    if (tf === 'monthly') return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].slice(0, count);
    if (tf === 'quarterly') return ['Q1', 'Q2', 'Q3', 'Q4'].slice(0, count);
    if (tf === 'yearly') return Array.from({ length: count }, (_, i) => `${2020 + i}`);
    return Array.from({ length: count }, (_, i) => `Day ${i + 1}`);
  };

  const points = getDaysForTimeframe(timeframe);
  const labels = getLabels(timeframe, points);

  const generateTrend = (start, end, count, variance = 5) => {
    return Array.from({ length: count }, (_, i) => {
      const progress = i / (count - 1);
      const base = start + (end - start) * progress;
      return Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance));
    });
  };

  return {
    otif: {
      label: 'OTIF (On Time, In Full)',
      goal: 95,
      baseline: 55,
      current: 87,
      color: '#3b82f6',
      data: labels.map((label, i) => ({
        name: label,
        value: generateTrend(75, 87, points)[i],
        goal: 95
      })),
      unit: '%',
      improving: true,
      change: 32
    },
    costSaving: {
      label: 'Procurement Cost Saving',
      goal: 5,
      baseline: 0,
      current: 3.2,
      color: '#22c55e',
      data: labels.map((label, i) => ({
        name: label,
        value: generateTrend(1, 3.2, points, 0.5)[i],
        goal: 5
      })),
      unit: '%',
      improving: true,
      change: 3.2
    },
    expiryDuration: {
      label: 'Expiry Duration Rate',
      goal: 1,
      baseline: 3,
      current: 2.1,
      color: '#f97316',
      data: labels.map((label, i) => ({
        name: label,
        value: generateTrend(2.8, 2.1, points, 0.3)[i],
        goal: 1
      })),
      unit: '%',
      improving: true,
      change: -0.9
    },
    emergencyPurchase: {
      label: 'Emergency Purchase Rate',
      goal: 5,
      baseline: 12,
      current: 7.5,
      color: '#ef4444',
      data: labels.map((label, i) => ({
        name: label,
        value: generateTrend(10, 7.5, points, 1)[i],
        goal: 5
      })),
      unit: '%',
      improving: true,
      change: -4.5
    }
  };
};
