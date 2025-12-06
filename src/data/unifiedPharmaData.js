const medicineCategories = [
  { id: 'emergency', name: 'Emergency Medicines', itemCount: 350, color: '#ef4444', icon: 'AlertTriangle' },
  { id: 'ot', name: 'OT Medicines', itemCount: 180, color: '#8b5cf6', icon: 'Scissors' },
  { id: 'ward', name: 'Ward Medicines', itemCount: 420, color: '#3b82f6', icon: 'Building2' },
  { id: 'daycare', name: 'Daycare Medicines', itemCount: 95, color: '#10b981', icon: 'Sun' },
  { id: 'general', name: 'General Medicines', itemCount: 510, color: '#f59e0b', icon: 'Pill' },
  { id: 'implant', name: 'Implant Medicines', itemCount: 75, color: '#ec4899', icon: 'Heart' }
];

const totalMedicines = medicineCategories.reduce((sum, cat) => sum + cat.itemCount, 0);

const hospitalDepartments = {
  level1: [
    { id: 'emergency_critical', name: 'Emergency & Critical Care', color: '#ef4444' },
    { id: 'operating_theatres', name: 'Operating Theatres & Procedure Suites', color: '#8b5cf6' },
    { id: 'inpatient_wards', name: 'Inpatient Wards & Units', color: '#3b82f6' },
    { id: 'outpatient_ambulatory', name: 'Outpatient & Ambulatory', color: '#10b981' },
    { id: 'diagnostic_interventional', name: 'Diagnostic & Interventional', color: '#f59e0b' },
    { id: 'special_therapies', name: 'Special Therapies & Programs', color: '#ec4899' },
    { id: 'pharmacy_network', name: 'Pharmacy Network', color: '#06b6d4' },
    { id: 'support_areas', name: 'Support Areas', color: '#84cc16' }
  ],
  level2: {
    emergency_critical: [
      { id: 'emergency_casualty', name: 'Emergency / Casualty' },
      { id: 'icu_units', name: 'Intensive Care Units (ICUs)' },
      { id: 'paediatric_neonatal', name: 'Paediatric & Neonatal Critical' }
    ],
    operating_theatres: [
      { id: 'main_ots', name: 'Main OTs' },
      { id: 'day_surgery', name: 'Day Surgery / Minor OT' },
      { id: 'cath_lab', name: 'Cath Lab / Interventional' }
    ],
    inpatient_wards: [
      { id: 'general_medical_surgical', name: 'General Medical & Surgical' },
      { id: 'specialty_wards', name: 'Specialty Wards' },
      { id: 'maternity_obstetrics', name: 'Maternity & Obstetrics' },
      { id: 'paediatric_wards', name: 'Paediatric Wards' }
    ],
    outpatient_ambulatory: [
      { id: 'opd', name: 'OPD' },
      { id: 'retail_pharmacy', name: 'Retail Pharmacy' },
      { id: 'specialty_clinics', name: 'Specialty Clinics' },
      { id: 'daycare_infusion', name: 'Day-care / Infusion' }
    ],
    diagnostic_interventional: [
      { id: 'radiology', name: 'Radiology' },
      { id: 'endoscopy_gi', name: 'Endoscopy / GI Labs' },
      { id: 'dialysis', name: 'Dialysis' }
    ],
    special_therapies: [
      { id: 'oncology', name: 'Oncology' },
      { id: 'transplant_programs', name: 'Transplant Programs' },
      { id: 'infectious_disease', name: 'Infectious Disease Programs' }
    ],
    pharmacy_network: [
      { id: 'ward_pharmacies', name: 'Ward Pharmacies' },
      { id: 'central_pharmacy', name: 'Central Pharmacy' },
      { id: 'opd_pharmacy', name: 'OPD Pharmacy' }
    ],
    support_areas: [
      { id: 'employee_clinic', name: 'Employee Clinic' },
      { id: 'ambulance', name: 'Ambulance' },
      { id: 'training_research', name: 'Training / Research' }
    ]
  },
  level3: {
    emergency_casualty: [{ id: 'ae_casualty_trauma', name: 'A&E / Casualty / Trauma' }],
    icu_units: [
      { id: 'medical_icu', name: 'Medical ICU' },
      { id: 'surgical_icu', name: 'Surgical ICU' },
      { id: 'neuro_icu', name: 'Neuro ICU' },
      { id: 'cardiac_icu', name: 'Cardiac ICU' },
      { id: 'hdu', name: 'HDU' }
    ],
    paediatric_neonatal: [
      { id: 'picu', name: 'PICU' },
      { id: 'nicu', name: 'NICU' }
    ],
    main_ots: [
      { id: 'general_ot', name: 'General OT' },
      { id: 'ortho_ot', name: 'Ortho OT' },
      { id: 'neuro_ot', name: 'Neuro OT' },
      { id: 'cardiac_ot', name: 'Cardiac OT' }
    ],
    day_surgery: [
      { id: 'daycare_ot', name: 'Day-care OT' },
      { id: 'endoscopy_suite', name: 'Endoscopy Suite' }
    ],
    cath_lab: [{ id: 'cath_lab_unit', name: 'Cath Lab' }],
    general_medical_surgical: [
      { id: 'adult_medical_ward', name: 'Adult Medical Ward' },
      { id: 'surgical_ward', name: 'Surgical Ward' }
    ],
    specialty_wards: [
      { id: 'cardiology_ward', name: 'Cardiology Ward' },
      { id: 'neurology_ward', name: 'Neurology Ward' },
      { id: 'trauma_ward', name: 'Trauma Ward' }
    ],
    maternity_obstetrics: [
      { id: 'labour_ward', name: 'Labour Ward' },
      { id: 'postnatal_ward', name: 'Post-natal Ward' }
    ],
    paediatric_wards: [{ id: 'paediatric_ward', name: 'Paediatric Ward' }],
    opd: [
      { id: 'general_opd', name: 'General OPD' },
      { id: 'specialty_opd', name: 'Specialty OPD' }
    ],
    retail_pharmacy: [{ id: 'opd_pharmacy_retail', name: 'OPD Pharmacy' }],
    specialty_clinics: [
      { id: 'hiv_clinic', name: 'HIV Clinic' },
      { id: 'tb_clinic', name: 'TB Clinic' }
    ],
    daycare_infusion: [
      { id: 'chemo_daycare', name: 'Chemo Day-care' },
      { id: 'dialysis_daycare', name: 'Dialysis Day-care' }
    ],
    radiology: [{ id: 'ct_mri_usg', name: 'CT/MRI/USG Units' }],
    endoscopy_gi: [{ id: 'endoscopy_unit', name: 'Endoscopy Unit' }],
    dialysis: [{ id: 'hemodialysis_unit', name: 'Hemodialysis Unit' }],
    oncology: [
      { id: 'oncology_ward', name: 'Oncology Ward' },
      { id: 'chemo_daycare_oncology', name: 'Chemo Day-care' }
    ],
    transplant_programs: [{ id: 'transplant_unit', name: 'Transplant Unit' }],
    infectious_disease: [{ id: 'dots_centre', name: 'DOTS Centre' }],
    ward_pharmacies: [{ id: 'satellite_pharmacy', name: 'Satellite Pharmacy' }],
    central_pharmacy: [{ id: 'main_store', name: 'Main Store' }],
    opd_pharmacy: [{ id: 'retail_pharmacy_opd', name: 'Retail Pharmacy' }],
    employee_clinic: [{ id: 'staff_clinic', name: 'Staff Clinic' }],
    ambulance: [{ id: 'ambulance_fleet', name: 'Ambulance Fleet' }],
    training_research: [{ id: 'simulation_lab', name: 'Simulation Lab' }]
  }
};

const otifMetrics = {
  overall: 92.4,
  onTimeDelivery: 94.2,
  inFullDelivery: 93.8,
  perfectOrderRate: 89.6,
  averageDelayHours: 2.3,
  byCategory: [
    { category: 'Emergency Medicines', otif: 96.8, onTime: 97.2, inFull: 96.5, orders: 1245, delayed: 40, color: '#ef4444' },
    { category: 'OT Medicines', otif: 94.5, onTime: 95.1, inFull: 94.0, orders: 892, delayed: 49, color: '#8b5cf6' },
    { category: 'Ward Medicines', otif: 91.2, onTime: 92.4, inFull: 90.1, orders: 2156, delayed: 190, color: '#3b82f6' },
    { category: 'Daycare Medicines', otif: 93.7, onTime: 94.8, inFull: 92.9, orders: 456, delayed: 29, color: '#10b981' },
    { category: 'General Medicines', otif: 89.4, onTime: 90.6, inFull: 88.5, orders: 3421, delayed: 362, color: '#f59e0b' },
    { category: 'Implant Medicines', otif: 97.1, onTime: 97.8, inFull: 96.5, orders: 234, delayed: 7, color: '#ec4899' }
  ],
  reasons: [
    { reason: 'Supplier Delay', count: 245, percentage: 35.8, impact: 'High' },
    { reason: 'Transportation Issues', count: 156, percentage: 22.8, impact: 'Medium' },
    { reason: 'Stock Unavailability', count: 112, percentage: 16.4, impact: 'High' },
    { reason: 'Quality Hold', count: 89, percentage: 13.0, impact: 'Medium' },
    { reason: 'Documentation Errors', count: 52, percentage: 7.6, impact: 'Low' },
    { reason: 'Other', count: 30, percentage: 4.4, impact: 'Low' }
  ]
};

const coreLabels = [
  {
    id: 'usage_velocity',
    name: 'Usage / Velocity',
    count: 133,
    color: '#3b82f6',
    icon: 'TrendingUp',
    subLabels: [
      { id: 'fast_moving', name: 'FAST_MOVING', count: 40, description: 'High consumption rate' },
      { id: 'medium_moving', name: 'MEDIUM_MOVING', count: 35, description: 'Moderate consumption' },
      { id: 'slow_moving', name: 'SLOW_MOVING', count: 25, description: 'Low consumption rate' },
      { id: 'very_slow_moving', name: 'VERY_SLOW_MOVING / NON_MOVING', count: 15, description: 'Minimal usage' },
      { id: 'new_item', name: 'NEW_ITEM', count: 10, description: 'Recently added' },
      { id: 'obsolete', name: 'OBSOLETE / TO_BE_DISCONTINUED', count: 8, description: 'No longer in use' }
    ]
  },
  {
    id: 'stock_position',
    name: 'Stock Position',
    count: 175,
    color: '#8b5cf6',
    icon: 'FileCheck',
    subLabels: [
      { id: 'stockout', name: 'STOCKOUT / NO_STOCK', count: 15, description: 'Out of stock' },
      { id: 'critical_low_stock', name: 'CRITICAL_LOW_STOCK', count: 25, description: 'Critically low levels' },
      { id: 'low_stock', name: 'LOW_STOCK', count: 30, description: 'Below minimum levels' },
      { id: 'healthy_stock', name: 'HEALTHY_STOCK', count: 65, description: 'Optimal stock levels' },
      { id: 'overstock', name: 'OVERSTOCK', count: 20, description: 'Above maximum levels' },
      { id: 'excess_stock', name: 'EXCESS_STOCK / SURPLUS', count: 12, description: 'Excessive inventory' },
      { id: 'blocked_stock', name: 'BLOCKED_STOCK', count: 5, description: 'Blocked inventory' },
      { id: 'quarantined_stock', name: 'QUARANTINED_STOCK', count: 3, description: 'Quality hold' }
    ]
  },
  {
    id: 'expiry_shelf_life',
    name: 'Expiry / Shelf-Life',
    count: 185,
    color: '#ef4444',
    icon: 'AlertTriangle',
    subLabels: [
      { id: 'expiring_imminent', name: 'EXPIRING_IMMINENT (<30 days)', count: 18, description: 'Expires within 30 days' },
      { id: 'near_expiry', name: 'NEAR_EXPIRY (1–3 months)', count: 32, description: 'Expires in 1-3 months' },
      { id: 'medium_shelf_life', name: 'MEDIUM_SHELF_LIFE', count: 65, description: 'Moderate shelf life' },
      { id: 'long_shelf_life', name: 'LONG_SHELF_LIFE', count: 45, description: 'Extended shelf life' },
      { id: 'expired', name: 'EXPIRED', count: 8, description: 'Past expiry date' },
      { id: 'high_expiry_risk', name: 'HIGH_EXPIRY_RISK', count: 12, description: 'High risk of expiry' },
      { id: 'low_expiry_risk', name: 'LOW_EXPIRY_RISK', count: 5, description: 'Low expiry risk' }
    ]
  },
  {
    id: 'demand_pattern',
    name: 'Demand Pattern & Predictability',
    count: 195,
    color: '#10b981',
    icon: 'Stethoscope',
    subLabels: [
      { id: 'stable_demand', name: 'STABLE_DEMAND', count: 75, description: 'Consistent demand pattern' },
      { id: 'volatile_demand', name: 'VOLATILE_DEMAND', count: 35, description: 'Highly variable demand' },
      { id: 'seasonal_demand', name: 'SEASONAL_DEMAND', count: 28, description: 'Seasonal variations' },
      { id: 'programmatic_demand', name: 'PROGRAMMATIC_DEMAND', count: 22, description: 'Program-driven demand' },
      { id: 'event_driven_demand', name: 'EVENT_DRIVEN_DEMAND', count: 15, description: 'Event-based demand' },
      { id: 'one_off_demand', name: 'ONE_OFF / EXCEPTIONAL_DEMAND', count: 12, description: 'One-time requirements' },
      { id: 'unpredictable_demand', name: 'UNPREDICTABLE_DEMAND', count: 8, description: 'Unpredictable pattern' }
    ]
  },
  {
    id: 'criticality_service',
    name: 'Criticality & Service Level',
    count: 75,
    color: '#06b6d4',
    icon: 'Thermometer',
    subLabels: [
      { id: 'life_saving', name: 'LIFE_SAVING / CRITICAL_CARE_ITEM', count: 18, description: 'Critical for survival' },
      { id: 'high_criticality', name: 'HIGH_CRITICALITY', count: 22, description: 'High importance' },
      { id: 'medium_criticality', name: 'MEDIUM_CRITICALITY', count: 20, description: 'Medium importance' },
      { id: 'low_criticality', name: 'LOW_CRITICALITY', count: 8, description: 'Low importance' },
      { id: 'high_service_level', name: 'HIGH_SERVICE_LEVEL_TARGET', count: 3, description: 'High service requirements' },
      { id: 'normal_service_level', name: 'NORMAL_SERVICE_LEVEL_TARGET', count: 3, description: 'Standard service level' },
      { id: 'low_service_level', name: 'LOW_SERVICE_LEVEL_TARGET', count: 1, description: 'Low service requirements' }
    ]
  },
  {
    id: 'value_cost_impact',
    name: 'Value / Cost Impact',
    count: 215,
    color: '#f59e0b',
    icon: 'DollarSign',
    subLabels: [
      { id: 'high_value_item', name: 'HIGH_VALUE_ITEM', count: 40, description: '>₹10,000 per unit' },
      { id: 'medium_value_item', name: 'MEDIUM_VALUE_ITEM', count: 80, description: '₹1,000-10,000' },
      { id: 'low_value_item', name: 'LOW_VALUE_ITEM', count: 60, description: '<₹1,000 per unit' },
      { id: 'high_margin_item', name: 'HIGH_MARGIN_ITEM', count: 15, description: 'High profit margin' },
      { id: 'low_margin_item', name: 'LOW_MARGIN_ITEM', count: 12, description: 'Low profit margin' },
      { id: 'high_stock_value', name: 'HIGH_STOCK_VALUE', count: 5, description: 'High inventory value' },
      { id: 'low_stock_value', name: 'LOW_STOCK_VALUE', count: 3, description: 'Low inventory value' }
    ]
  },
  {
    id: 'policy_handling',
    name: 'Policy / Handling',
    count: 205,
    color: '#ec4899',
    icon: 'RefreshCw',
    subLabels: [
      { id: 'restricted_use', name: 'RESTRICTED_USE', count: 35, description: 'Limited authorization' },
      { id: 'formulary_item', name: 'FORMULARY_ITEM', count: 85, description: 'Approved formulary' },
      { id: 'non_formulary_item', name: 'NON_FORMULARY_ITEM', count: 25, description: 'Non-formulary item' },
      { id: 'substitution_allowed', name: 'SUBSTITUTION_ALLOWED', count: 20, description: 'Substitution permitted' },
      { id: 'substitution_not_allowed', name: 'SUBSTITUTION_NOT_ALLOWED', count: 15, description: 'No substitution' },
      { id: 'cold_chain_item', name: 'COLD_CHAIN_ITEM', count: 12, description: '2-8°C storage' },
      { id: 'controlled_substance', name: 'CONTROLLED_SUBSTANCE', count: 8, description: 'Regulated storage' },
      { id: 'kit_component', name: 'KIT_COMPONENT', count: 5, description: 'Part of kit' }
    ]
  }
];

const forecastData = {
  totalItems: 1630,
  accuracy: 87.5,
  underForecasted: 45,
  overForecasted: 38,
  byCategory: medicineCategories.map(cat => ({
    ...cat,
    forecastAccuracy: 82 + Math.random() * 15,
    variance: -8 + Math.random() * 16,
    demandVariability: 5 + Math.random() * 20
  })),
  kpis: {
    forecastVsActual: 94.2,
    demandVariability: 12.4,
    safetyStockDays: 18,
    forecastBias: -2.3
  }
};

const generateTrendData = (baseValue, variance, points = 30) => {
  const data = [];
  let currentValue = baseValue;
  for (let i = 0; i < points; i++) {
    currentValue = currentValue + (Math.random() - 0.5) * variance;
    currentValue = Math.max(0, Math.min(100, currentValue));
    data.push({
      day: i + 1,
      value: parseFloat(currentValue.toFixed(1)),
      date: new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    });
  }
  return data;
};

const otifKPIs = [
  {
    id: 'on_time_delivery',
    title: 'On-Time Delivery %',
    value: 94.2,
    unit: '%',
    change: 2.3,
    trend: 'up',
    trendData: generateTrendData(92, 4),
    color: '#10b981'
  },
  {
    id: 'in_full_delivery',
    title: 'In-Full Delivery %',
    value: 93.8,
    unit: '%',
    change: 1.8,
    trend: 'up',
    trendData: generateTrendData(91, 5),
    color: '#3b82f6'
  },
  {
    id: 'perfect_order_rate',
    title: 'Perfect Order Rate',
    value: 89.6,
    unit: '%',
    change: -0.5,
    trend: 'down',
    trendData: generateTrendData(90, 3),
    color: '#f59e0b'
  },
  {
    id: 'avg_delay',
    title: 'Average Delay',
    value: 2.3,
    unit: 'hrs',
    change: -0.8,
    trend: 'up',
    trendData: generateTrendData(3, 1),
    color: '#ef4444'
  }
];

const labelKPIs = [
  {
    id: 'stock_coverage',
    title: 'Stock Coverage Days',
    value: 24,
    unit: 'days',
    change: 3,
    trend: 'up',
    trendData: generateTrendData(22, 4),
    color: '#10b981'
  },
  {
    id: 'stockout_risk',
    title: 'Stockout Risk Products',
    value: 35,
    unit: '',
    change: -8,
    trend: 'up',
    trendData: generateTrendData(42, 6),
    color: '#ef4444'
  },
  {
    id: 'inventory_value',
    title: 'Avg Inventory Value',
    value: 8.4,
    unit: 'Cr',
    change: 0.6,
    trend: 'up',
    trendData: generateTrendData(7.8, 0.8),
    color: '#3b82f6'
  },
  {
    id: 'expiry_risk',
    title: 'Expiry Risk Items',
    value: 12,
    unit: '',
    change: -4,
    trend: 'up',
    trendData: generateTrendData(16, 3),
    color: '#f59e0b'
  }
];

const forecastKPIs = [
  {
    id: 'forecast_vs_actual',
    title: 'Forecast vs Actual %',
    value: 94.2,
    unit: '%',
    change: 3.1,
    trend: 'up',
    trendData: generateTrendData(91, 4),
    color: '#10b981'
  },
  {
    id: 'demand_variability',
    title: 'Demand Variability',
    value: 12.4,
    unit: '%',
    change: -2.1,
    trend: 'up',
    trendData: generateTrendData(14, 3),
    color: '#3b82f6'
  },
  {
    id: 'safety_stock',
    title: 'Safety Stock Days',
    value: 18,
    unit: 'days',
    change: 2,
    trend: 'up',
    trendData: generateTrendData(16, 3),
    color: '#f59e0b'
  },
  {
    id: 'forecast_bias',
    title: 'Forecast Bias',
    value: -2.3,
    unit: '%',
    change: 1.2,
    trend: 'up',
    trendData: generateTrendData(-3.5, 2),
    color: '#8b5cf6'
  }
];

const chordConnections = [];
medicineCategories.forEach(medCat => {
  hospitalDepartments.level1.forEach(dept => {
    const strength = Math.floor(Math.random() * 100) + 20;
    chordConnections.push({
      source: medCat.id,
      sourceName: medCat.name,
      target: dept.id,
      targetName: dept.name,
      value: strength,
      color: medCat.color
    });
  });
});

const sampleMedicines = [
  { id: 1, name: 'Adrenaline Injection', category: 'Emergency Medicines', sku: 'EM-001', stock: 1245, reorderPoint: 500, price: 125, unit: 'Amp' },
  { id: 2, name: 'Propofol 1%', category: 'OT Medicines', sku: 'OT-001', stock: 892, reorderPoint: 300, price: 450, unit: 'Vial' },
  { id: 3, name: 'Paracetamol 500mg', category: 'General Medicines', sku: 'GM-001', stock: 15420, reorderPoint: 5000, price: 2.5, unit: 'Tab' },
  { id: 4, name: 'Insulin Glargine', category: 'Ward Medicines', sku: 'WM-001', stock: 560, reorderPoint: 200, price: 1850, unit: 'Pen' },
  { id: 5, name: 'Metformin 500mg', category: 'General Medicines', sku: 'GM-002', stock: 23450, reorderPoint: 8000, price: 1.8, unit: 'Tab' },
  { id: 6, name: 'Atorvastatin 20mg', category: 'General Medicines', sku: 'GM-003', stock: 18920, reorderPoint: 6000, price: 8.5, unit: 'Tab' },
  { id: 7, name: 'Cardiac Stent DES', category: 'Implant Medicines', sku: 'IM-001', stock: 45, reorderPoint: 15, price: 45000, unit: 'Unit' },
  { id: 8, name: 'Ondansetron 4mg', category: 'Daycare Medicines', sku: 'DM-001', stock: 2340, reorderPoint: 800, price: 45, unit: 'Inj' },
  { id: 9, name: 'Fentanyl Patch', category: 'OT Medicines', sku: 'OT-002', stock: 234, reorderPoint: 80, price: 850, unit: 'Patch' },
  { id: 10, name: 'Dopamine Infusion', category: 'Emergency Medicines', sku: 'EM-002', stock: 890, reorderPoint: 300, price: 180, unit: 'Vial' }
];

const productJourneyData = {
  categories: ['Cardiac', 'Emergency', 'Antibiotics', 'Surgical'],
  products: {
    Cardiac: {
      name: 'Cardiac',
      totalUnits: 1146,
      distribution: [
        { name: 'ICU', units: 16, color: '#ef4444', type: 'critical' },
        { name: 'Emergency Ward', units: 101, color: '#ef4444', type: 'critical' },
        { name: 'General Ward', units: 214, color: '#10b981', type: 'normal' },
        { name: 'Operation Theater', units: 312, color: '#3b82f6', type: 'routine' },
        { name: 'Pharmacy Store', units: 290, color: '#3b82f6', type: 'routine' }
      ],
      consumption: [
        { name: 'Patient Care', rate: 7, unit: '/hr' },
        { name: 'Procedures', rate: 4, unit: '/hr' },
        { name: 'Outpatient', rate: 3, unit: '/hr' },
        { name: 'Research', rate: 7, unit: '/hr' }
      ]
    },
    Emergency: {
      name: 'Emergency',
      totalUnits: 2340,
      distribution: [
        { name: 'ICU', units: 245, color: '#ef4444', type: 'critical' },
        { name: 'Emergency Ward', units: 567, color: '#ef4444', type: 'critical' },
        { name: 'General Ward', units: 423, color: '#10b981', type: 'normal' },
        { name: 'Operation Theater', units: 512, color: '#3b82f6', type: 'routine' },
        { name: 'Pharmacy Store', units: 593, color: '#3b82f6', type: 'routine' }
      ],
      consumption: [
        { name: 'Patient Care', rate: 12, unit: '/hr' },
        { name: 'Procedures', rate: 8, unit: '/hr' },
        { name: 'Outpatient', rate: 5, unit: '/hr' },
        { name: 'Research', rate: 3, unit: '/hr' }
      ]
    },
    Antibiotics: {
      name: 'Antibiotics',
      totalUnits: 3560,
      distribution: [
        { name: 'ICU', units: 312, color: '#ef4444', type: 'critical' },
        { name: 'Emergency Ward', units: 445, color: '#ef4444', type: 'critical' },
        { name: 'General Ward', units: 1234, color: '#10b981', type: 'normal' },
        { name: 'Operation Theater', units: 678, color: '#3b82f6', type: 'routine' },
        { name: 'Pharmacy Store', units: 891, color: '#3b82f6', type: 'routine' }
      ],
      consumption: [
        { name: 'Patient Care', rate: 15, unit: '/hr' },
        { name: 'Procedures', rate: 6, unit: '/hr' },
        { name: 'Outpatient', rate: 9, unit: '/hr' },
        { name: 'Research', rate: 4, unit: '/hr' }
      ]
    },
    Surgical: {
      name: 'Surgical',
      totalUnits: 1890,
      distribution: [
        { name: 'ICU', units: 89, color: '#ef4444', type: 'critical' },
        { name: 'Emergency Ward', units: 156, color: '#ef4444', type: 'critical' },
        { name: 'General Ward', units: 234, color: '#10b981', type: 'normal' },
        { name: 'Operation Theater', units: 892, color: '#3b82f6', type: 'routine' },
        { name: 'Pharmacy Store', units: 519, color: '#3b82f6', type: 'routine' }
      ],
      consumption: [
        { name: 'Patient Care', rate: 5, unit: '/hr' },
        { name: 'Procedures', rate: 11, unit: '/hr' },
        { name: 'Outpatient', rate: 2, unit: '/hr' },
        { name: 'Research', rate: 6, unit: '/hr' }
      ]
    }
  }
};

const notifications = [
  { id: 1, type: 'stockout', title: 'Critical Stockout Alert', message: '35 products are currently stocked out', severity: 'critical', timestamp: new Date().toISOString(), read: false },
  { id: 2, type: 'low_stock', title: 'Low Stock Warning', message: '48 products below reorder point', severity: 'warning', timestamp: new Date().toISOString(), read: false },
  { id: 3, type: 'expiry', title: 'Expiry Alert', message: '12 products expiring within 30 days', severity: 'warning', timestamp: new Date().toISOString(), read: false },
  { id: 4, type: 'otif', title: 'OTIF Issue', message: '15 delayed deliveries today', severity: 'info', timestamp: new Date().toISOString(), read: false },
  { id: 5, type: 'forecast', title: 'Forecast Deviation', message: '8 products exceeded forecast by >20%', severity: 'info', timestamp: new Date().toISOString(), read: false }
];

const rcaData = {
  supplierDelay: {
    causes: [
      { id: 1, cause: 'Raw Material Shortage', impact: 'High', probability: 65 },
      { id: 2, cause: 'Production Capacity Issues', impact: 'Medium', probability: 45 },
      { id: 3, cause: 'Quality Control Failures', impact: 'High', probability: 30 },
      { id: 4, cause: 'Logistics Bottlenecks', impact: 'Medium', probability: 55 }
    ],
    recommendations: [
      { id: 1, action: 'Diversify supplier base', priority: 'High', effort: 'Medium', timeline: '3 months' },
      { id: 2, action: 'Increase safety stock levels', priority: 'Medium', effort: 'Low', timeline: '1 month' },
      { id: 3, action: 'Implement supplier scorecards', priority: 'High', effort: 'Medium', timeline: '2 months' }
    ]
  },
  transportationIssues: {
    causes: [
      { id: 1, cause: 'Cold Chain Failure', impact: 'High', probability: 45 },
      { id: 2, cause: 'Route Optimization Issues', impact: 'Medium', probability: 55 },
      { id: 3, cause: 'Vehicle Breakdown', impact: 'Medium', probability: 35 },
      { id: 4, cause: 'Traffic Delays', impact: 'Low', probability: 70 }
    ],
    recommendations: [
      { id: 1, action: 'Upgrade temperature monitoring systems', priority: 'High', effort: 'Medium', timeline: '2 months' },
      { id: 2, action: 'Implement GPS tracking', priority: 'Medium', effort: 'Low', timeline: '1 month' },
      { id: 3, action: 'Partner with backup carriers', priority: 'High', effort: 'Medium', timeline: '1 month' }
    ]
  },
  stockUnavailability: {
    causes: [
      { id: 1, cause: 'Demand Forecast Error', impact: 'High', probability: 60 },
      { id: 2, cause: 'Safety Stock Too Low', impact: 'High', probability: 50 },
      { id: 3, cause: 'Lead Time Variability', impact: 'Medium', probability: 45 },
      { id: 4, cause: 'Seasonal Demand Spike', impact: 'Medium', probability: 40 }
    ],
    recommendations: [
      { id: 1, action: 'Improve demand forecasting model', priority: 'High', effort: 'High', timeline: '4 months' },
      { id: 2, action: 'Increase safety stock for critical items', priority: 'High', effort: 'Low', timeline: '2 weeks' },
      { id: 3, action: 'Implement vendor-managed inventory', priority: 'Medium', effort: 'High', timeline: '6 months' }
    ]
  },
  qualityHold: {
    causes: [
      { id: 1, cause: 'Batch Rejection', impact: 'High', probability: 40 },
      { id: 2, cause: 'Documentation Incomplete', impact: 'Medium', probability: 55 },
      { id: 3, cause: 'Temperature Excursion', impact: 'High', probability: 35 },
      { id: 4, cause: 'Regulatory Compliance Issue', impact: 'High', probability: 25 }
    ],
    recommendations: [
      { id: 1, action: 'Strengthen supplier quality audits', priority: 'High', effort: 'Medium', timeline: '3 months' },
      { id: 2, action: 'Automate document verification', priority: 'Medium', effort: 'Medium', timeline: '2 months' },
      { id: 3, action: 'Install real-time temperature alerts', priority: 'High', effort: 'Low', timeline: '1 month' }
    ]
  },
  documentationErrors: {
    causes: [
      { id: 1, cause: 'Manual Data Entry Errors', impact: 'Medium', probability: 65 },
      { id: 2, cause: 'Missing Certificates', impact: 'Medium', probability: 45 },
      { id: 3, cause: 'Invoice Discrepancies', impact: 'Low', probability: 55 },
      { id: 4, cause: 'System Integration Issues', impact: 'Medium', probability: 30 }
    ],
    recommendations: [
      { id: 1, action: 'Implement barcode scanning', priority: 'High', effort: 'Low', timeline: '1 month' },
      { id: 2, action: 'Create document checklist automation', priority: 'Medium', effort: 'Low', timeline: '2 weeks' },
      { id: 3, action: 'Integrate ERP with supplier systems', priority: 'Medium', effort: 'High', timeline: '4 months' }
    ]
  },
  labelSpecific: {
    causes: [
      { id: 1, cause: 'Incorrect Label Classification', impact: 'High', probability: 40 },
      { id: 2, cause: 'Outdated Label Information', impact: 'Medium', probability: 50 },
      { id: 3, cause: 'Missing Sub-Label Assignment', impact: 'Medium', probability: 35 },
      { id: 4, cause: 'Category Overlap Issues', impact: 'Low', probability: 45 }
    ],
    recommendations: [
      { id: 1, action: 'Review and update label taxonomy', priority: 'High', effort: 'Medium', timeline: '2 months' },
      { id: 2, action: 'Automate label validation rules', priority: 'Medium', effort: 'Medium', timeline: '3 months' },
      { id: 3, action: 'Train staff on label protocols', priority: 'Medium', effort: 'Low', timeline: '2 weeks' }
    ]
  }
};

const getRCADataForContext = (contextData) => {
  if (!contextData) return rcaData.supplierDelay;
  
  if (contextData.type === 'otif_reason') {
    const reasonKey = contextData.data?.reason?.toLowerCase().replace(/\s+/g, '') || 'supplierDelay';
    const keyMap = {
      'supplierdelay': 'supplierDelay',
      'transportationissues': 'transportationIssues',
      'stockunavailability': 'stockUnavailability',
      'qualityhold': 'qualityHold',
      'documentationerrors': 'documentationErrors',
      'other': 'supplierDelay'
    };
    return rcaData[keyMap[reasonKey] || 'supplierDelay'];
  }
  
  if (contextData.type === 'label') {
    return rcaData.labelSpecific;
  }
  
  return rcaData.supplierDelay;
};

export {
  medicineCategories,
  totalMedicines,
  hospitalDepartments,
  otifMetrics,
  coreLabels,
  forecastData,
  otifKPIs,
  labelKPIs,
  forecastKPIs,
  chordConnections,
  sampleMedicines,
  productJourneyData,
  notifications,
  rcaData,
  getRCADataForContext,
  generateTrendData
};
