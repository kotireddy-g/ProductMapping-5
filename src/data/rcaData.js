// Root Causes Analysis Data for Command Centre
// Comprehensive RCA table with interactive features

export const rcaData = [
  {
    id: 'rca-1',
    reason: 'Demand Spike',
    why: '+30-40% surge in usage',
    medicineType: 'Fast moving critical, Low stock',
    demand: 140,
    supplied: 120,
    forecast: 260,
    actions: 'Trigger Emergency Supply',
    preventiveRecommendations: 'Adjust Reorder Threshold',
    priority: 'urgent',
    // Detail data for popup when clicking Why, Demand, or Supplied
    details: [
      {
        icuType: 'ICU-A',
        bedNo: '101',
        patientStatus: 'Critical',
        medicineOrdered: 'Norepinephrine 4mg',
        forecast: 45,
        label: 'High Priority'
      },
      {
        icuType: 'ICU-A',
        bedNo: '102',
        patientStatus: 'Stable',
        medicineOrdered: 'Propofol 200mg',
        forecast: 30,
        label: 'Medium Priority'
      },
      {
        icuType: 'ICU-B',
        bedNo: '205',
        patientStatus: 'Critical',
        medicineOrdered: 'Fentanyl 100mcg',
        forecast: 35,
        label: 'High Priority'
      },
      {
        icuType: 'ICU-B',
        bedNo: '208',
        patientStatus: 'Recovering',
        medicineOrdered: 'Midazolam 5mg',
        forecast: 30,
        label: 'Low Priority'
      }
    ]
  },
  {
    id: 'rca-2',
    reason: 'Supplier Delay',
    why: 'Logistics disruption',
    medicineType: 'Critical antibiotics',
    demand: 200,
    supplied: 180,
    forecast: 220,
    actions: 'Expedite Delivery',
    preventiveRecommendations: 'Diversify Suppliers',
    priority: 'normal',
    details: [
      {
        icuType: 'ICU-A',
        bedNo: '103',
        patientStatus: 'Infection',
        medicineOrdered: 'Meropenem 1g',
        forecast: 50,
        label: 'High Priority'
      },
      {
        icuType: 'ICU-C',
        bedNo: '301',
        patientStatus: 'Post-Op',
        medicineOrdered: 'Vancomycin 500mg',
        forecast: 60,
        label: 'Medium Priority'
      },
      {
        icuType: 'ICU-B',
        bedNo: '210',
        patientStatus: 'Sepsis',
        medicineOrdered: 'Piperacillin 4.5g',
        forecast: 70,
        label: 'High Priority'
      }
    ]
  },
  {
    id: 'rca-3',
    reason: 'Forecast Error',
    why: 'Unexpected patient influx',
    medicineType: 'Pain management',
    demand: 80,
    supplied: 75,
    forecast: 65,
    actions: 'Redistribute from OPD',
    preventiveRecommendations: 'Improve Forecast Model',
    priority: 'routine',
    details: [
      {
        icuType: 'ICU-A',
        bedNo: '105',
        patientStatus: 'Post-Surgery',
        medicineOrdered: 'Morphine 10mg',
        forecast: 20,
        label: 'Medium Priority'
      },
      {
        icuType: 'ICU-C',
        bedNo: '305',
        patientStatus: 'Trauma',
        medicineOrdered: 'Tramadol 50mg',
        forecast: 25,
        label: 'High Priority'
      },
      {
        icuType: 'ICU-B',
        bedNo: '212',
        patientStatus: 'Chronic Pain',
        medicineOrdered: 'Oxycodone 5mg',
        forecast: 20,
        label: 'Low Priority'
      }
    ]
  },
  {
    id: 'rca-4',
    reason: 'Stock Expiry',
    why: 'Overstocking last quarter',
    medicineType: 'Injectable solutions',
    demand: 100,
    supplied: 0,
    forecast: 95,
    actions: 'Replace Stock',
    preventiveRecommendations: 'Implement FEFO Strictly',
    priority: 'critical',
    details: [
      {
        icuType: 'ICU-A',
        bedNo: '107',
        patientStatus: 'Dehydration',
        medicineOrdered: 'Normal Saline 500ml',
        forecast: 30,
        label: 'Medium Priority'
      },
      {
        icuType: 'ICU-B',
        bedNo: '215',
        patientStatus: 'Electrolyte Imbalance',
        medicineOrdered: 'Ringer Lactate 1L',
        forecast: 35,
        label: 'High Priority'
      },
      {
        icuType: 'ICU-C',
        bedNo: '310',
        patientStatus: 'IV Therapy',
        medicineOrdered: 'Dextrose 5% 1L',
        forecast: 30,
        label: 'Medium Priority'
      }
    ]
  },
  {
    id: 'rca-5',
    reason: 'Process Delay',
    why: 'Manual approval bottleneck',
    medicineType: 'Controlled substances',
    demand: 120,
    supplied: 95,
    forecast: 110,
    actions: 'Approval Required',
    preventiveRecommendations: 'Automate Approval Workflow',
    priority: 'normal',
    details: [
      {
        icuType: 'ICU-A',
        bedNo: '110',
        patientStatus: 'Sedation Required',
        medicineOrdered: 'Diazepam 10mg',
        forecast: 25,
        label: 'High Priority'
      },
      {
        icuType: 'ICU-B',
        bedNo: '220',
        patientStatus: 'Anxiety',
        medicineOrdered: 'Lorazepam 2mg',
        forecast: 30,
        label: 'Medium Priority'
      },
      {
        icuType: 'ICU-C',
        bedNo: '315',
        patientStatus: 'Seizure Control',
        medicineOrdered: 'Clonazepam 1mg',
        forecast: 40,
        label: 'High Priority'
      }
    ]
  },
  {
    id: 'rca-6',
    reason: 'Under Stock',
    why: 'Below minimum threshold',
    medicineType: 'Emergency medications',
    demand: 60,
    supplied: 40,
    forecast: 75,
    actions: 'Reorder',
    preventiveRecommendations: 'Increase Safety Stock',
    priority: 'urgent',
    details: [
      {
        icuType: 'ICU-A',
        bedNo: '112',
        patientStatus: 'Cardiac Arrest Risk',
        medicineOrdered: 'Epinephrine 1mg',
        forecast: 20,
        label: 'Critical'
      },
      {
        icuType: 'ICU-B',
        bedNo: '225',
        patientStatus: 'Anaphylaxis Risk',
        medicineOrdered: 'Atropine 0.5mg',
        forecast: 15,
        label: 'High Priority'
      },
      {
        icuType: 'ICU-C',
        bedNo: '320',
        patientStatus: 'Emergency',
        medicineOrdered: 'Adenosine 6mg',
        forecast: 20,
        label: 'Critical'
      }
    ]
  }
];

// Priority color mapping
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'critical':
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-300',
        badge: 'bg-red-500 text-white'
      };
    case 'urgent':
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-300',
        badge: 'bg-orange-500 text-white'
      };
    case 'normal':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300',
        badge: 'bg-blue-500 text-white'
      };
    case 'routine':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        badge: 'bg-gray-500 text-white'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        badge: 'bg-gray-500 text-white'
      };
  }
};

// Keep old exports for backward compatibility
export const rcaProducts = [
  { id: 'SKU-112', name: 'Paracetamol 500mg', category: 'General Medicines', quantity: 1200, label: 'over-stocking' },
  { id: 'SKU-118', name: 'Amoxicillin 250mg', category: 'Emergency Medicines', quantity: 800, label: 'under-stocking' },
  { id: 'SKU-125', name: 'Insulin Glargine', category: 'Ward Medicines', quantity: 450, label: 'expiry-risk' },
  { id: 'SKU-131', name: 'Metformin 850mg', category: 'General Medicines', quantity: 2000, label: 'over-stocking' },
  { id: 'SKU-145', name: 'Ceftriaxone 1g', category: 'Emergency Medicines', quantity: 300, label: 'stockout-risk' },
  { id: 'SKU-152', name: 'Omeprazole 20mg', category: 'Daycare Medicines', quantity: 1500, label: 'high-velocity' },
  { id: 'SKU-167', name: 'Atorvastatin 10mg', category: 'Ward Medicines', quantity: 900, label: 'slow-moving' },
  { id: 'SKU-178', name: 'Adrenaline 1mg/ml', category: 'Emergency Medicines', quantity: 150, label: 'emergency-shortage' },
  { id: 'SKU-183', name: 'Surgical Sutures', category: 'OT Medicines', quantity: 500, label: 'cost-overrun' },
  { id: 'SKU-195', name: 'IV Fluids NS 500ml', category: 'General Medicines', quantity: 3000, label: 'wastage' }
];

export const generateRCAData = (productId) => {
  const product = rcaProducts.find(p => p.id === productId) || rcaProducts[0];
  const vendors = ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D'];
  const selectedVendor = vendors[Math.floor(Math.random() * vendors.length)];

  const recommendedQty = Math.round(80 + Math.random() * 80);
  const lastWeekQty = Math.round(recommendedQty * (0.8 + Math.random() * 0.4));
  const qtyDiff = recommendedQty - lastWeekQty;

  return {
    product,
    decision: {
      recommendedQty,
      lastWeekQty,
      qtyDiff,
      vendor: selectedVendor,
      otif: Math.round(85 + Math.random() * 13),
      confidence: (0.75 + Math.random() * 0.2).toFixed(2),
      route: Math.random() > 0.3 ? 'AUTO' : 'MANUAL',
      riskLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
      stockoutRisk: Math.round(2 + Math.random() * 10),
      decisionId: `DEC-2025-${productId.split('-')[1]}-01`
    },
    counterfactual: [
      {
        scenario: 'Recommended',
        orderQty: recommendedQty,
        totalCost: recommendedQty * 40,
        stockoutRisk: Math.round(2 + Math.random() * 5),
        serviceLevel: Math.round(94 + Math.random() * 4)
      },
      {
        scenario: '+20% Qty',
        orderQty: Math.round(recommendedQty * 1.2),
        totalCost: Math.round(recommendedQty * 1.2 * 40),
        stockoutRisk: Math.round(1 + Math.random() * 2),
        serviceLevel: Math.round(97 + Math.random() * 2)
      },
      {
        scenario: '-20% Qty',
        orderQty: Math.round(recommendedQty * 0.8),
        totalCost: Math.round(recommendedQty * 0.8 * 40),
        stockoutRisk: Math.round(8 + Math.random() * 8),
        serviceLevel: Math.round(85 + Math.random() * 5)
      }
    ],
    feedbackHistory: [
      {
        date: 'Today',
        action: 'Auto-approved',
        status: 'approved',
        systemQty: recommendedQty,
        userQty: null,
        rating: 4,
        comment: null
      },
      {
        date: '30 Nov',
        action: 'Modified by User',
        status: 'modified',
        systemQty: Math.round(recommendedQty * 0.9),
        userQty: Math.round(recommendedQty * 0.75),
        rating: 3,
        comment: 'Banquet cancelled'
      },
      {
        date: '24 Nov',
        action: 'Rejected',
        status: 'rejected',
        systemQty: Math.round(recommendedQty * 0.7),
        userQty: null,
        rating: 2,
        comment: 'User chose Vendor B instead'
      }
    ],
    policyHealth: {
      episodesReward: Math.round(200 + Math.random() * 200),
      rewardTrend: 'improving',
      stockoutDays: Math.round(1 + Math.random() * 3),
      lastMonthStockoutDays: Math.round(3 + Math.random() * 3)
    },
    rcaDrivers: [
      { factor: 'Days of Stock Remaining (DoC)', impact: -(0.3 + Math.random() * 0.2), type: 'negative' },
      { factor: 'Supplier Lead Time Variability', impact: -(0.2 + Math.random() * 0.15), type: 'negative' },
      { factor: 'Recent Consumption Trend', impact: 0.25 + Math.random() * 0.2, type: 'positive' },
      { factor: 'Seasonal Demand Factor', impact: 0.1 + Math.random() * 0.15, type: 'positive' },
      { factor: 'Vendor OTIF Score', impact: 0.15 + Math.random() * 0.15, type: 'positive' }
    ],
    overrideRate: Math.round(20 + Math.random() * 15),
    avgRating: (3.8 + Math.random() * 0.8).toFixed(1)
  };
};

export const vendorsList = [
  'Vendor A', 'Vendor B', 'Vendor C', 'Vendor D', 'Vendor E'
];