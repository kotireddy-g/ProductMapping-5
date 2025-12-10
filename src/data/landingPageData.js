// Landing Page Synthetic Data for Experienceflow Hospital Pharmacy OTIF Application
// Organization: Experienceflow Software Technologies Private Limited

import {
  Activity,
  Heart,
  Stethoscope,
  Bed,
  Truck,
  Users,
  Building2,
  FlaskConical,
  Pill,
  Syringe,
  Thermometer,
  ClipboardList
} from 'lucide-react';

// Overall OTIF Percentage
export const overallOTIF = 92.4;

// OTIF Department Data
// Color Coding: Green (94-100%), Amber (85-94%), Red (<85%)
export const otifDepartments = [
  {
    id: 'icu',
    name: 'ICU',
    icon: Heart,
    otifPercentage: 95.2,
    status: 'green',
    description: 'Intensive Care Unit'
  },
  {
    id: 'ot',
    name: 'OT',
    icon: Activity,
    otifPercentage: 88.5,
    status: 'amber',
    description: 'Operation Theatre'
  },
  {
    id: 'ward',
    name: 'Ward',
    icon: Bed,
    otifPercentage: 82.3,
    status: 'red',
    description: 'General Ward'
  },
  {
    id: 'daycare',
    name: 'Daycare',
    icon: Users,
    otifPercentage: 91.7,
    status: 'amber',
    description: 'Daycare Center'
  },
  {
    id: 'er',
    name: 'ER',
    icon: Truck,
    otifPercentage: 78.9,
    status: 'red',
    description: 'Emergency Room'
  },
  {
    id: 'opd',
    name: 'OPD',
    icon: Stethoscope,
    otifPercentage: 96.8,
    status: 'green',
    description: 'Out Patient Department'
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    icon: Pill,
    otifPercentage: 94.5,
    status: 'green',
    description: 'Central Pharmacy'
  },
  {
    id: 'lab',
    name: 'Lab',
    icon: FlaskConical,
    otifPercentage: 87.2,
    status: 'amber',
    description: 'Laboratory'
  },
  {
    id: 'dialysis',
    name: 'Dialysis',
    icon: Syringe,
    otifPercentage: 93.1,
    status: 'amber',
    description: 'Dialysis Unit'
  },
  {
    id: 'nicu',
    name: 'NICU',
    icon: Thermometer,
    otifPercentage: 97.4,
    status: 'green',
    description: 'Neonatal ICU'
  },
  {
    id: 'oncology',
    name: 'Oncology',
    icon: ClipboardList,
    otifPercentage: 89.6,
    status: 'amber',
    description: 'Oncology Department'
  },
  {
    id: 'radiology',
    name: 'Radiology',
    icon: Building2,
    otifPercentage: 81.4,
    status: 'red',
    description: 'Radiology Department'
  }
];

// Decision Actions Data (7 main categories)
// Total pending actions: 230
export const decisionActions = [
  {
    id: 'usage-velocity',
    name: 'Usage / Velocity',
    pendingCount: 45,
    severity: 'high', // high = red, medium = light red
    description: 'Items with abnormal usage patterns or velocity changes',
    details: 'Fast-moving items requiring immediate attention'
  },
  {
    id: 'stock-position',
    name: 'Stock Position',
    pendingCount: 38,
    severity: 'high',
    description: 'Items with critical stock levels',
    details: 'Overstocking or understocking situations'
  },
  {
    id: 'expiry-shelf-life',
    name: 'Expiry / Shelf-Life',
    pendingCount: 52,
    severity: 'high',
    description: 'Items approaching expiry or with short shelf-life',
    details: 'Medicines expiring within 30-90 days'
  },
  {
    id: 'demand-pattern',
    name: 'Demand Pattern & Predictability',
    pendingCount: 28,
    severity: 'medium',
    description: 'Items with unpredictable demand patterns',
    details: 'Seasonal or irregular demand items'
  },
  {
    id: 'criticality-service',
    name: 'Criticality & Service Level',
    pendingCount: 31,
    severity: 'high',
    description: 'Critical items affecting service levels',
    details: 'Life-saving drugs and essential medicines'
  },
  {
    id: 'value-cost',
    name: 'Value / Cost Impact',
    pendingCount: 22,
    severity: 'medium',
    description: 'High-value items requiring cost optimization',
    details: 'Expensive medicines and cost-sensitive items'
  },
  {
    id: 'policy-handling',
    name: 'Policy / Handling',
    pendingCount: 14,
    severity: 'medium',
    description: 'Items requiring special handling or policy compliance',
    details: 'Controlled substances and special storage items'
  }
];

// Total pending actions count
export const totalPendingActions = decisionActions.reduce((sum, action) => sum + action.pendingCount, 0);

// Forecast Data for Hospital Areas
// Overall forecast surge: 10%
export const forecastSurge = 10;

export const forecastAreas = [
  {
    id: 'icu-forecast',
    areaName: 'ICU',
    currentForecast: 15.2,
    previousForecast: 13.8,
    changePercentage: 10.1,
    trend: 'up',
    description: 'Intensive Care Unit forecast'
  },
  {
    id: 'ot-forecast',
    areaName: 'OT',
    currentForecast: 12.5,
    previousForecast: 11.3,
    changePercentage: 10.6,
    trend: 'up',
    description: 'Operation Theatre forecast'
  },
  {
    id: 'ward-forecast',
    areaName: 'Ward',
    currentForecast: 22.8,
    previousForecast: 20.7,
    changePercentage: 10.1,
    trend: 'up',
    description: 'General Ward forecast'
  },
  {
    id: 'daycare-forecast',
    areaName: 'Daycare',
    currentForecast: 8.4,
    previousForecast: 7.6,
    changePercentage: 10.5,
    trend: 'up',
    description: 'Daycare Center forecast'
  },
  {
    id: 'er-forecast',
    areaName: 'ER',
    currentForecast: 18.9,
    previousForecast: 17.2,
    changePercentage: 9.9,
    trend: 'up',
    description: 'Emergency Room forecast'
  },
  {
    id: 'opd-forecast',
    areaName: 'OPD',
    currentForecast: 25.3,
    previousForecast: 23.0,
    changePercentage: 10.0,
    trend: 'up',
    description: 'Out Patient Department forecast'
  },
  {
    id: 'pharmacy-forecast',
    areaName: 'Pharmacy',
    currentForecast: 32.1,
    previousForecast: 29.2,
    changePercentage: 9.9,
    trend: 'up',
    description: 'Central Pharmacy forecast'
  },
  {
    id: 'lab-forecast',
    areaName: 'Lab',
    currentForecast: 9.7,
    previousForecast: 8.8,
    changePercentage: 10.2,
    trend: 'up',
    description: 'Laboratory forecast'
  },
  {
    id: 'dialysis-forecast',
    areaName: 'Dialysis',
    currentForecast: 6.5,
    previousForecast: 5.9,
    changePercentage: 10.2,
    trend: 'up',
    description: 'Dialysis Unit forecast'
  },
  {
    id: 'nicu-forecast',
    areaName: 'NICU',
    currentForecast: 11.3,
    previousForecast: 10.3,
    changePercentage: 9.7,
    trend: 'up',
    description: 'Neonatal ICU forecast'
  }
];

// Search Suggestions Data
export const searchSuggestions = {
  otif: [
    'OTIF Overall',
    'OTIF ICU',
    'OTIF OT',
    'OTIF Ward',
    'OTIF Daycare',
    'OTIF ER',
    'OTIF OPD',
    'OTIF Pharmacy',
    'OTIF Lab',
    'OTIF by Department',
    'OTIF Trends'
  ],
  medicines: [
    'Paracetamol',
    'Amoxicillin',
    'Metformin',
    'Aspirin',
    'Ibuprofen',
    'Omeprazole',
    'Atorvastatin',
    'Insulin',
    'Ciprofloxacin',
    'Amlodipine',
    'Losartan',
    'Ceftriaxone',
    'Dexamethasone',
    'Morphine',
    'Heparin',
    'Warfarin',
    'Propofol',
    'Midazolam',
    'Fentanyl',
    'Norepinephrine'
  ],
  actions: [
    'Usage / Velocity',
    'Stock Position',
    'Expiry / Shelf-Life',
    'Demand Pattern & Predictability',
    'Criticality & Service Level',
    'Value / Cost Impact',
    'Policy / Handling',
    'Overstocking',
    'Understocking',
    'Expiring Soon',
    'Critical Stock',
    'High Value Items'
  ],
  labels: [
    'Critical',
    'High Priority',
    'Controlled Substance',
    'Refrigerated',
    'Hazardous',
    'Fast Moving',
    'Slow Moving',
    'Expensive',
    'Generic',
    'Brand',
    'Life Saving',
    'Emergency Stock'
  ]
};

// Helper function to get color class based on OTIF status
export const getOTIFColorClass = (status) => {
  switch (status) {
    case 'green':
      return {
        bg: 'bg-green-50',
        border: 'border-green-300',
        text: 'text-green-800',
        iconBg: 'bg-green-100'
      };
    case 'amber':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-800',
        iconBg: 'bg-amber-100'
      };
    case 'red':
      return {
        bg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-800',
        iconBg: 'bg-red-100'
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-300',
        text: 'text-gray-800',
        iconBg: 'bg-gray-100'
      };
  }
};

// Helper function to get color class for decision actions
export const getActionColorClass = (severity) => {
  if (severity === 'high') {
    return {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-900',
      badge: 'bg-red-600 text-white'
    };
  } else {
    return {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      text: 'text-orange-900',
      badge: 'bg-orange-500 text-white'
    };
  }
};

// Helper function to get color class for forecast
export const getForecastColorClass = (trend) => {
  return {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-900',
    badge: trend === 'up' ? 'bg-green-600 text-white' : 'bg-red-600 text-white',
    arrow: trend === 'up' ? '↑' : '↓'
  };
};
