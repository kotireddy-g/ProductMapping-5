// Multi-Vertical Data for ExperienceFlow Procurement Platform
// Supports: Hospitality, Supermarket, Hospital Pharma

// Vertical Configuration
export const verticals = {
  hospitality: {
    name: 'Hospitality',
    icon: '🏨',
    description: 'Hotels, Restaurants & Food Service',
    color: '#3b82f6',
    departments: ['Kitchen', 'Bar', 'Restaurant', 'Room Service', 'Banquet', 'Storage'],
    locations: ['Downtown Hotel', 'Beach Resort', 'Airport Restaurant', 'Rooftop Bar', 'Conference Center', 'Fine Dining', 'Suburban Hotel', 'City Cafe']
  },
  supermarket: {
    name: 'Supermarket',
    icon: '🛒',
    description: 'Retail Chains & Grocery Stores',
    color: '#10b981',
    departments: ['Fresh Produce', 'Dairy & Frozen', 'Packaged Foods', 'Beverages', 'Personal Care', 'Household'],
    locations: ['Main Store', 'Express Outlet', 'Mall Branch', 'Suburban Store', 'City Center', 'Airport Branch', 'Highway Stop', 'Metro Station']
  },
  pharma: {
    name: 'Hospital Pharma',
    icon: '🏥',
    description: 'Hospitals & Pharmaceutical Supply',
    color: '#ef4444',
    departments: ['Emergency Meds', 'Surgery Supplies', 'ICU Equipment', 'General Pharmacy', 'Lab Reagents', 'Medical Devices'],
    locations: ['General Hospital', 'Specialty Clinic', 'Emergency Center', 'Surgical Wing', 'ICU Department', 'Outpatient Pharmacy', 'Research Lab', 'Pediatric Unit']
  }
};

// Hospitality Data (Enhanced from existing)
export const hospitalityData = {
  Kitchen: {
    products: [
      { name: 'Fresh Fish', category: 'fast', status: 'normal', flow: 45, cost: 5000, revenue: 15000, margin: 67, expiryDays: 2, 
        locations: { 'Downtown Hotel': { status: 'normal', flow: 25 }, 'Beach Resort': { status: 'over-consumed', flow: 35 }, 'Airport Restaurant': { status: 'normal', flow: 20 } },
        timeframes: { hourly: 2, daily: 45, weekly: 315, monthly: 1350, quarterly: 4050, yearly: 16425 } },
      { name: 'Premium Beef', category: 'fast', status: 'over-consumed', flow: 35, cost: 8000, revenue: 24000, margin: 67, expiryDays: 3,
        locations: { 'Fine Dining': { status: 'over-consumed', flow: 45 }, 'Downtown Hotel': { status: 'normal', flow: 30 }, 'Suburban Hotel': { status: 'under-consumed', flow: 15 } },
        timeframes: { hourly: 1.5, daily: 35, weekly: 245, monthly: 1050, quarterly: 3150, yearly: 12775 } },
      { name: 'Organic Vegetables', category: 'medium', status: 'expiry-near', flow: 28, cost: 2000, revenue: 6000, margin: 67, expiryDays: 1,
        locations: { 'Downtown Hotel': { status: 'expiry-near', flow: 30 }, 'Beach Resort': { status: 'normal', flow: 25 }, 'Conference Center': { status: 'under-consumed', flow: 20 } },
        timeframes: { hourly: 1.2, daily: 28, weekly: 196, monthly: 840, quarterly: 2520, yearly: 10220 } }
    ]
  },
  Bar: {
    products: [
      { name: 'Premium Wine', category: 'fast', status: 'normal', flow: 40, cost: 3000, revenue: 12000, margin: 75, expiryDays: 365,
        locations: { 'Rooftop Bar': { status: 'over-consumed', flow: 50 }, 'Downtown Hotel': { status: 'normal', flow: 35 }, 'Beach Resort': { status: 'under-consumed', flow: 25 } },
        timeframes: { hourly: 1.7, daily: 40, weekly: 280, monthly: 1200, quarterly: 3600, yearly: 14600 } },
      { name: 'Craft Spirits', category: 'medium', status: 'under-consumed', flow: 22, cost: 4000, revenue: 16000, margin: 75, expiryDays: 730,
        locations: { 'Rooftop Bar': { status: 'normal', flow: 30 }, 'Fine Dining': { status: 'under-consumed', flow: 18 }, 'Beach Resort': { status: 'dead-stock', flow: 5 } },
        timeframes: { hourly: 0.9, daily: 22, weekly: 154, monthly: 660, quarterly: 1980, yearly: 8030 } }
    ]
  },
  Restaurant: {
    products: [
      { name: 'Artisan Spices', category: 'slow', status: 'normal', flow: 15, cost: 1500, revenue: 4500, margin: 67, expiryDays: 90,
        locations: { 'Fine Dining': { status: 'normal', flow: 20 }, 'Downtown Hotel': { status: 'normal', flow: 15 }, 'City Cafe': { status: 'under-consumed', flow: 8 } },
        timeframes: { hourly: 0.6, daily: 15, weekly: 105, monthly: 450, quarterly: 1350, yearly: 5475 } }
    ]
  },
  'Room Service': {
    products: [
      { name: 'Fresh Garnishes', category: 'fast', status: 'expiry-near', flow: 25, cost: 800, revenue: 2400, margin: 67, expiryDays: 1,
        locations: { 'Downtown Hotel': { status: 'expiry-near', flow: 30 }, 'Beach Resort': { status: 'normal', flow: 25 }, 'Suburban Hotel': { status: 'under-consumed', flow: 15 } },
        timeframes: { hourly: 1.0, daily: 25, weekly: 175, monthly: 750, quarterly: 2250, yearly: 9125 } }
    ]
  },
  Banquet: {
    products: [
      { name: 'Imported Seafood', category: 'occasional', status: 'dead-stock', flow: 8, cost: 6000, revenue: 18000, margin: 67, expiryDays: 2,
        locations: { 'Conference Center': { status: 'dead-stock', flow: 5 }, 'Downtown Hotel': { status: 'occasional', flow: 10 }, 'Beach Resort': { status: 'under-consumed', flow: 12 } },
        timeframes: { hourly: 0.3, daily: 8, weekly: 56, monthly: 240, quarterly: 720, yearly: 2920 } }
    ]
  },
  Storage: {
    products: [
      { name: 'Truffle Oil', category: 'slow', status: 'dead-stock', flow: 5, cost: 2500, revenue: 7500, margin: 67, expiryDays: 180,
        locations: { 'Fine Dining': { status: 'normal', flow: 8 }, 'Downtown Hotel': { status: 'dead-stock', flow: 3 }, 'Beach Resort': { status: 'dead-stock', flow: 2 } },
        timeframes: { hourly: 0.2, daily: 5, weekly: 35, monthly: 150, quarterly: 450, yearly: 1825 } }
    ]
  }
};

// Supermarket Data
export const supermarketData = {
  'Fresh Produce': {
    products: [
      { name: 'Organic Apples', category: 'fast', status: 'normal', flow: 120, cost: 3000, revenue: 9000, margin: 67, expiryDays: 7,
        locations: { 'Main Store': { status: 'normal', flow: 150 }, 'Mall Branch': { status: 'over-consumed', flow: 180 }, 'Express Outlet': { status: 'under-consumed', flow: 80 } },
        timeframes: { hourly: 5, daily: 120, weekly: 840, monthly: 3600, quarterly: 10800, yearly: 43800 } },
      { name: 'Fresh Bananas', category: 'fast', status: 'over-consumed', flow: 200, cost: 2000, revenue: 6000, margin: 67, expiryDays: 5,
        locations: { 'Main Store': { status: 'over-consumed', flow: 250 }, 'Suburban Store': { status: 'normal', flow: 180 }, 'City Center': { status: 'over-consumed', flow: 220 } },
        timeframes: { hourly: 8.3, daily: 200, weekly: 1400, monthly: 6000, quarterly: 18000, yearly: 73000 } },
      { name: 'Leafy Greens', category: 'medium', status: 'expiry-near', flow: 85, cost: 1500, revenue: 4500, margin: 67, expiryDays: 2,
        locations: { 'Main Store': { status: 'expiry-near', flow: 100 }, 'Mall Branch': { status: 'normal', flow: 75 }, 'Express Outlet': { status: 'expiry-near', flow: 60 } },
        timeframes: { hourly: 3.5, daily: 85, weekly: 595, monthly: 2550, quarterly: 7650, yearly: 31025 } }
    ]
  },
  'Dairy & Frozen': {
    products: [
      { name: 'Premium Milk', category: 'fast', status: 'normal', flow: 300, cost: 4000, revenue: 12000, margin: 67, expiryDays: 5,
        locations: { 'Main Store': { status: 'normal', flow: 350 }, 'Suburban Store': { status: 'over-consumed', flow: 400 }, 'Mall Branch': { status: 'normal', flow: 280 } },
        timeframes: { hourly: 12.5, daily: 300, weekly: 2100, monthly: 9000, quarterly: 27000, yearly: 109500 } },
      { name: 'Frozen Vegetables', category: 'medium', status: 'under-consumed', flow: 150, cost: 2500, revenue: 7500, margin: 67, expiryDays: 180,
        locations: { 'Main Store': { status: 'under-consumed', flow: 120 }, 'Mall Branch': { status: 'normal', flow: 160 }, 'Airport Branch': { status: 'under-consumed', flow: 100 } },
        timeframes: { hourly: 6.25, daily: 150, weekly: 1050, monthly: 4500, quarterly: 13500, yearly: 54750 } },
      { name: 'Ice Cream', category: 'fast', status: 'over-consumed', flow: 180, cost: 3500, revenue: 10500, margin: 67, expiryDays: 90,
        locations: { 'Mall Branch': { status: 'over-consumed', flow: 220 }, 'Main Store': { status: 'normal', flow: 170 }, 'City Center': { status: 'over-consumed', flow: 200 } },
        timeframes: { hourly: 7.5, daily: 180, weekly: 1260, monthly: 5400, quarterly: 16200, yearly: 65700 } }
    ]
  },
  'Packaged Foods': {
    products: [
      { name: 'Breakfast Cereals', category: 'medium', status: 'normal', flow: 90, cost: 2000, revenue: 6000, margin: 67, expiryDays: 365,
        locations: { 'Main Store': { status: 'normal', flow: 100 }, 'Suburban Store': { status: 'normal', flow: 85 }, 'Express Outlet': { status: 'under-consumed', flow: 60 } },
        timeframes: { hourly: 3.75, daily: 90, weekly: 630, monthly: 2700, quarterly: 8100, yearly: 32850 } },
      { name: 'Pasta & Noodles', category: 'slow', status: 'dead-stock', flow: 45, cost: 1200, revenue: 3600, margin: 67, expiryDays: 730,
        locations: { 'Main Store': { status: 'dead-stock', flow: 30 }, 'Mall Branch': { status: 'under-consumed', flow: 50 }, 'Express Outlet': { status: 'dead-stock', flow: 25 } },
        timeframes: { hourly: 1.9, daily: 45, weekly: 315, monthly: 1350, quarterly: 4050, yearly: 16425 } }
    ]
  },
  Beverages: {
    products: [
      { name: 'Soft Drinks', category: 'fast', status: 'normal', flow: 250, cost: 5000, revenue: 15000, margin: 67, expiryDays: 180,
        locations: { 'Main Store': { status: 'normal', flow: 280 }, 'Mall Branch': { status: 'over-consumed', flow: 320 }, 'Airport Branch': { status: 'normal', flow: 200 } },
        timeframes: { hourly: 10.4, daily: 250, weekly: 1750, monthly: 7500, quarterly: 22500, yearly: 91250 } },
      { name: 'Energy Drinks', category: 'medium', status: 'under-consumed', flow: 80, cost: 3000, revenue: 9000, margin: 67, expiryDays: 365,
        locations: { 'Mall Branch': { status: 'normal', flow: 100 }, 'Main Store': { status: 'under-consumed', flow: 70 }, 'City Center': { status: 'under-consumed', flow: 60 } },
        timeframes: { hourly: 3.3, daily: 80, weekly: 560, monthly: 2400, quarterly: 7200, yearly: 29200 } }
    ]
  },
  'Personal Care': {
    products: [
      { name: 'Shampoo & Conditioner', category: 'slow', status: 'normal', flow: 35, cost: 1800, revenue: 5400, margin: 67, expiryDays: 730,
        locations: { 'Main Store': { status: 'normal', flow: 40 }, 'Mall Branch': { status: 'normal', flow: 35 }, 'Suburban Store': { status: 'under-consumed', flow: 25 } },
        timeframes: { hourly: 1.5, daily: 35, weekly: 245, monthly: 1050, quarterly: 3150, yearly: 12775 } }
    ]
  },
  Household: {
    products: [
      { name: 'Cleaning Supplies', category: 'medium', status: 'normal', flow: 60, cost: 1500, revenue: 4500, margin: 67, expiryDays: 1095,
        locations: { 'Main Store': { status: 'normal', flow: 70 }, 'Suburban Store': { status: 'normal', flow: 55 }, 'Express Outlet': { status: 'under-consumed', flow: 40 } },
        timeframes: { hourly: 2.5, daily: 60, weekly: 420, monthly: 1800, quarterly: 5400, yearly: 21900 } }
    ]
  }
};

// Hospital Pharma Data
export const pharmaData = {
  'Emergency Meds': {
    products: [
      { name: 'Epinephrine Auto-Injectors', category: 'fast', status: 'normal', flow: 25, cost: 15000, revenue: 45000, margin: 67, expiryDays: 365,
        locations: { 'Emergency Center': { status: 'normal', flow: 35 }, 'General Hospital': { status: 'normal', flow: 20 }, 'Pediatric Unit': { status: 'under-consumed', flow: 15 } },
        timeframes: { hourly: 1, daily: 25, weekly: 175, monthly: 750, quarterly: 2250, yearly: 9125 } },
      { name: 'Cardiac Medications', category: 'fast', status: 'over-consumed', flow: 40, cost: 12000, revenue: 36000, margin: 67, expiryDays: 730,
        locations: { 'Emergency Center': { status: 'over-consumed', flow: 50 }, 'ICU Department': { status: 'normal', flow: 35 }, 'General Hospital': { status: 'over-consumed', flow: 45 } },
        timeframes: { hourly: 1.7, daily: 40, weekly: 280, monthly: 1200, quarterly: 3600, yearly: 14600 } },
      { name: 'Pain Management', category: 'medium', status: 'expiry-near', flow: 30, cost: 8000, revenue: 24000, margin: 67, expiryDays: 30,
        locations: { 'Emergency Center': { status: 'expiry-near', flow: 35 }, 'General Hospital': { status: 'normal', flow: 28 }, 'Outpatient Pharmacy': { status: 'expiry-near', flow: 25 } },
        timeframes: { hourly: 1.25, daily: 30, weekly: 210, monthly: 900, quarterly: 2700, yearly: 10950 } }
    ]
  },
  'Surgery Supplies': {
    products: [
      { name: 'Surgical Instruments', category: 'medium', status: 'normal', flow: 15, cost: 25000, revenue: 75000, margin: 67, expiryDays: 1095,
        locations: { 'Surgical Wing': { status: 'normal', flow: 20 }, 'General Hospital': { status: 'normal', flow: 12 }, 'Specialty Clinic': { status: 'under-consumed', flow: 8 } },
        timeframes: { hourly: 0.6, daily: 15, weekly: 105, monthly: 450, quarterly: 1350, yearly: 5475 } },
      { name: 'Anesthesia Supplies', category: 'fast', status: 'under-consumed', flow: 20, cost: 18000, revenue: 54000, margin: 67, expiryDays: 365,
        locations: { 'Surgical Wing': { status: 'normal', flow: 25 }, 'General Hospital': { status: 'under-consumed', flow: 15 }, 'Emergency Center': { status: 'under-consumed', flow: 18 } },
        timeframes: { hourly: 0.8, daily: 20, weekly: 140, monthly: 600, quarterly: 1800, yearly: 7300 } },
      { name: 'Sutures & Dressings', category: 'fast', status: 'normal', flow: 35, cost: 5000, revenue: 15000, margin: 67, expiryDays: 1095,
        locations: { 'Surgical Wing': { status: 'normal', flow: 40 }, 'Emergency Center': { status: 'normal', flow: 35 }, 'General Hospital': { status: 'normal', flow: 30 } },
        timeframes: { hourly: 1.5, daily: 35, weekly: 245, monthly: 1050, quarterly: 3150, yearly: 12775 } }
    ]
  },
  'ICU Equipment': {
    products: [
      { name: 'Ventilator Supplies', category: 'fast', status: 'over-consumed', flow: 18, cost: 30000, revenue: 90000, margin: 67, expiryDays: 365,
        locations: { 'ICU Department': { status: 'over-consumed', flow: 25 }, 'Emergency Center': { status: 'normal', flow: 15 }, 'General Hospital': { status: 'normal', flow: 12 } },
        timeframes: { hourly: 0.75, daily: 18, weekly: 126, monthly: 540, quarterly: 1620, yearly: 6570 } },
      { name: 'Monitoring Equipment', category: 'medium', status: 'normal', flow: 12, cost: 20000, revenue: 60000, margin: 67, expiryDays: 730,
        locations: { 'ICU Department': { status: 'normal', flow: 15 }, 'Emergency Center': { status: 'normal', flow: 10 }, 'Surgical Wing': { status: 'under-consumed', flow: 8 } },
        timeframes: { hourly: 0.5, daily: 12, weekly: 84, monthly: 360, quarterly: 1080, yearly: 4380 } }
    ]
  },
  'General Pharmacy': {
    products: [
      { name: 'Antibiotics', category: 'fast', status: 'normal', flow: 80, cost: 6000, revenue: 18000, margin: 67, expiryDays: 730,
        locations: { 'General Hospital': { status: 'normal', flow: 90 }, 'Outpatient Pharmacy': { status: 'over-consumed', flow: 100 }, 'Specialty Clinic': { status: 'normal', flow: 70 } },
        timeframes: { hourly: 3.3, daily: 80, weekly: 560, monthly: 2400, quarterly: 7200, yearly: 29200 } },
      { name: 'Diabetes Medications', category: 'medium', status: 'under-consumed', flow: 45, cost: 8000, revenue: 24000, margin: 67, expiryDays: 365,
        locations: { 'Outpatient Pharmacy': { status: 'under-consumed', flow: 35 }, 'General Hospital': { status: 'normal', flow: 50 }, 'Specialty Clinic': { status: 'under-consumed', flow: 30 } },
        timeframes: { hourly: 1.9, daily: 45, weekly: 315, monthly: 1350, quarterly: 4050, yearly: 16425 } },
      { name: 'Blood Pressure Meds', category: 'slow', status: 'dead-stock', flow: 25, cost: 4000, revenue: 12000, margin: 67, expiryDays: 730,
        locations: { 'Outpatient Pharmacy': { status: 'dead-stock', flow: 15 }, 'General Hospital': { status: 'under-consumed', flow: 30 }, 'Specialty Clinic': { status: 'dead-stock', flow: 20 } },
        timeframes: { hourly: 1, daily: 25, weekly: 175, monthly: 750, quarterly: 2250, yearly: 9125 } }
    ]
  },
  'Lab Reagents': {
    products: [
      { name: 'Blood Test Reagents', category: 'medium', status: 'normal', flow: 60, cost: 10000, revenue: 30000, margin: 67, expiryDays: 180,
        locations: { 'Research Lab': { status: 'normal', flow: 70 }, 'General Hospital': { status: 'normal', flow: 55 }, 'Specialty Clinic': { status: 'under-consumed', flow: 45 } },
        timeframes: { hourly: 2.5, daily: 60, weekly: 420, monthly: 1800, quarterly: 5400, yearly: 21900 } },
      { name: 'Urine Analysis Kits', category: 'fast', status: 'expiry-near', flow: 40, cost: 3000, revenue: 9000, margin: 67, expiryDays: 90,
        locations: { 'Research Lab': { status: 'expiry-near', flow: 45 }, 'General Hospital': { status: 'normal', flow: 38 }, 'Outpatient Pharmacy': { status: 'expiry-near', flow: 35 } },
        timeframes: { hourly: 1.7, daily: 40, weekly: 280, monthly: 1200, quarterly: 3600, yearly: 14600 } }
    ]
  },
  'Medical Devices': {
    products: [
      { name: 'Disposable Syringes', category: 'fast', status: 'normal', flow: 200, cost: 2000, revenue: 6000, margin: 67, expiryDays: 1095,
        locations: { 'General Hospital': { status: 'normal', flow: 250 }, 'Emergency Center': { status: 'over-consumed', flow: 280 }, 'Outpatient Pharmacy': { status: 'normal', flow: 180 } },
        timeframes: { hourly: 8.3, daily: 200, weekly: 1400, monthly: 6000, quarterly: 18000, yearly: 73000 } },
      { name: 'Blood Pressure Cuffs', category: 'slow', status: 'under-consumed', flow: 8, cost: 15000, revenue: 45000, margin: 67, expiryDays: 1825,
        locations: { 'General Hospital': { status: 'under-consumed', flow: 5 }, 'Specialty Clinic': { status: 'normal', flow: 10 }, 'Outpatient Pharmacy': { status: 'under-consumed', flow: 6 } },
        timeframes: { hourly: 0.3, daily: 8, weekly: 56, monthly: 240, quarterly: 720, yearly: 2920 } },
      { name: 'Thermometers', category: 'medium', status: 'normal', flow: 15, cost: 5000, revenue: 15000, margin: 67, expiryDays: 1095,
        locations: { 'General Hospital': { status: 'normal', flow: 18 }, 'Emergency Center': { status: 'normal', flow: 15 }, 'Pediatric Unit': { status: 'normal', flow: 12 } },
        timeframes: { hourly: 0.6, daily: 15, weekly: 105, monthly: 450, quarterly: 1350, yearly: 5475 } }
    ]
  }
};

// Export all vertical data
export const verticalDataMap = {
  hospitality: hospitalityData,
  supermarket: supermarketData,
  pharma: pharmaData
};

// RLHF Products for each vertical
export const verticalRLHFProducts = {
  hospitality: [
    { id: 1, name: 'Fresh Fish', suggestedLabel: 'Premium Seafood', confidence: 0.95, status: 'pending', category: 'Protein', location: 'Kitchen' },
    { id: 2, name: 'Premium Wine', suggestedLabel: 'House Selection Wine', confidence: 0.88, status: 'approved', category: 'Beverage', location: 'Bar' },
    { id: 3, name: 'Organic Vegetables', suggestedLabel: 'Farm Fresh Produce', confidence: 0.92, status: 'pending', category: 'Produce', location: 'Kitchen' },
    { id: 4, name: 'Artisan Spices', suggestedLabel: 'Gourmet Seasonings', confidence: 0.85, status: 'rejected', category: 'Condiment', location: 'Kitchen' },
    { id: 5, name: 'Craft Spirits', suggestedLabel: 'Premium Liquor', confidence: 0.90, status: 'approved', category: 'Beverage', location: 'Bar' }
  ],
  supermarket: [
    { id: 6, name: 'Organic Apples', suggestedLabel: 'Premium Fresh Apples', confidence: 0.93, status: 'pending', category: 'Fresh Produce', location: 'Produce Section' },
    { id: 7, name: 'Premium Milk', suggestedLabel: 'Farm Fresh Dairy', confidence: 0.89, status: 'approved', category: 'Dairy', location: 'Refrigerated' },
    { id: 8, name: 'Breakfast Cereals', suggestedLabel: 'Healthy Morning Choice', confidence: 0.87, status: 'pending', category: 'Packaged Food', location: 'Grocery Aisle' },
    { id: 9, name: 'Soft Drinks', suggestedLabel: 'Refreshing Beverages', confidence: 0.91, status: 'approved', category: 'Beverages', location: 'Beverage Section' },
    { id: 10, name: 'Ice Cream', suggestedLabel: 'Premium Frozen Dessert', confidence: 0.86, status: 'rejected', category: 'Frozen', location: 'Freezer Section' }
  ],
  pharma: [
    { id: 11, name: 'Epinephrine Auto-Injectors', suggestedLabel: 'Emergency Allergy Treatment', confidence: 0.98, status: 'approved', category: 'Emergency Medicine', location: 'Emergency Pharmacy' },
    { id: 12, name: 'Cardiac Medications', suggestedLabel: 'Heart Health Treatment', confidence: 0.94, status: 'pending', category: 'Cardiovascular', location: 'ICU Pharmacy' },
    { id: 13, name: 'Antibiotics', suggestedLabel: 'Infection Control Medicine', confidence: 0.96, status: 'approved', category: 'Anti-Infective', location: 'General Pharmacy' },
    { id: 14, name: 'Surgical Instruments', suggestedLabel: 'Sterile Surgical Tools', confidence: 0.92, status: 'pending', category: 'Medical Device', location: 'Surgery Supply' },
    { id: 15, name: 'Blood Test Reagents', suggestedLabel: 'Diagnostic Lab Supplies', confidence: 0.90, status: 'rejected', category: 'Laboratory', location: 'Lab Storage' }
  ]
};
