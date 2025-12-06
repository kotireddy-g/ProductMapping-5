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