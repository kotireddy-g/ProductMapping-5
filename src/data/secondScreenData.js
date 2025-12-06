// Second Screen Data - Sankey Diagram, KPIs, and Drill-down Data

// Label Filters for each core label type
export const labelFilters = {
  'usage-velocity': [
    { id: 'FAST_MOVING', name: 'Fast Moving', description: 'High and regular consumption (top X% by volume or value)', examples: ['IV fluids', 'common antibiotics', 'chronic OPD meds'] },
    { id: 'MEDIUM_MOVING', name: 'Medium Moving', description: 'Steady but not extreme usage', examples: ['Typical general-ward meds'] },
    { id: 'SLOW_MOVING', name: 'Slow Moving', description: 'Low-frequency usage but still used occasionally', examples: ['Niche drugs', 'low-volume specialties'] },
    { id: 'VERY_SLOW_MOVING', name: 'Very Slow Moving / Non-Moving', description: 'Almost no issues over long periods', examples: ['Stock may sit untouched for months'] },
    { id: 'NEW_ITEM', name: 'New Item', description: 'Recently introduced, insufficient history to classify yet', examples: ['New pharmaceutical products'] },
    { id: 'OBSOLETE', name: 'Obsolete / To Be Discontinued', description: 'Phasing out; replaced by other items or protocols', examples: ['Discontinued medications'] }
  ],
  'stock-position': [
    { id: 'STOCKOUT', name: 'Stockout / No Stock', description: 'Current stock = 0, demand > 0', examples: ['Out of stock items'] },
    { id: 'CRITICAL_LOW_STOCK', name: 'Critical Low Stock', description: 'Below minimum or < X days of cover (e.g. < 2 days). Very high OTIF risk', examples: ['Emergency restocking needed'] },
    { id: 'LOW_STOCK', name: 'Low Stock', description: 'Below target but not yet critical', examples: ['Reorder point reached'] },
    { id: 'HEALTHY_STOCK', name: 'Healthy Stock', description: 'Within min–max or target days of cover range', examples: ['Optimal inventory levels'] },
    { id: 'OVERSTOCK', name: 'Overstock', description: 'Above max or > N days of cover (e.g. > 60 days)', examples: ['Excess inventory'] },
    { id: 'EXCESS_STOCK', name: 'Excess Stock / Surplus', description: 'Severe overstock, clearly more than likely consumption before expiry', examples: ['Significant surplus'] },
    { id: 'BLOCKED_STOCK', name: 'Blocked Stock', description: 'Not usable (quality hold, recall, investigation)', examples: ['Quality issues'] },
    { id: 'QUARANTINED_STOCK', name: 'Quarantined Stock', description: 'Temporarily isolated, awaiting QC or decision', examples: ['Under investigation'] }
  ],
  'expiry-shelf-life': [
    { id: 'EXPIRING_IMMINENT', name: 'Expiring Imminent', description: 'Less than X days/weeks to expiry (e.g., < 30 days)', examples: ['Immediate action required'] },
    { id: 'NEAR_EXPIRY', name: 'Near Expiry', description: 'Within a defined near-expiry window (e.g., 1–3 months)', examples: ['Monitor closely'] },
    { id: 'MEDIUM_SHELF_LIFE', name: 'Medium Shelf Life', description: 'Not yet near expiry, moderate time left', examples: ['Standard monitoring'] },
    { id: 'LONG_SHELF_LIFE', name: 'Long Shelf Life', description: 'Plenty of time remaining (e.g., > 12 months)', examples: ['Low priority monitoring'] },
    { id: 'EXPIRED', name: 'Expired', description: 'Past expiry date; should be blocked from use', examples: ['Remove from inventory'] },
    { id: 'HIGH_EXPIRY_RISK', name: 'High Expiry Risk', description: 'Forecast shows likely that quantity won\'t be consumed before expiry', examples: ['Risk of wastage'] },
    { id: 'LOW_EXPIRY_RISK', name: 'Low Expiry Risk', description: 'Forecast shows consumption will clear before expiry comfortably', examples: ['Safe inventory levels'] }
  ],
  'demand-pattern': [
    { id: 'STABLE_DEMAND', name: 'Stable Demand', description: 'Low variability, predictable pattern', examples: ['Consistent usage'] },
    { id: 'VOLATILE_DEMAND', name: 'Volatile Demand', description: 'High variability, big swings week to week', examples: ['Unpredictable consumption'] },
    { id: 'SEASONAL_DEMAND', name: 'Seasonal Demand', description: 'Peaks and troughs linked to seasons/outbreaks (e.g., flu, dengue meds)', examples: ['Flu medications', 'dengue treatments'] },
    { id: 'PROGRAMMATIC_DEMAND', name: 'Programmatic Demand', description: 'Driven by structured programs (HIV, TB, vaccines, chemo cycles)', examples: ['HIV drugs', 'TB medications', 'vaccines'] },
    { id: 'EVENT_DRIVEN_DEMAND', name: 'Event Driven Demand', description: 'Tied to specific events (camps, screenings, limited projects)', examples: ['Campaign medications'] },
    { id: 'ONE_OFF_DEMAND', name: 'One-off / Exceptional Demand', description: 'Unusual spike not expected to repeat', examples: ['Emergency situations'] },
    { id: 'UNPREDICTABLE_DEMAND', name: 'Unpredictable Demand', description: 'Insufficient or too noisy data; model confidence low', examples: ['New or rare conditions'] }
  ],
  'criticality-service': [
    { id: 'LIFE_SAVING', name: 'Life Saving / Critical Care Item', description: 'Absolute priority; stockout unacceptable (ICU/ER emergency meds)', examples: ['ICU medications', 'emergency drugs'] },
    { id: 'HIGH_CRITICALITY', name: 'High Criticality', description: 'Strong service requirement but not as extreme as life-saving', examples: ['Important medications'] },
    { id: 'MEDIUM_CRITICALITY', name: 'Medium Criticality', description: 'Important, but short-term stockouts can sometimes be managed', examples: ['Standard medications'] },
    { id: 'LOW_CRITICALITY', name: 'Low Criticality', description: 'Convenience / comfort / non-essential items', examples: ['Comfort medications'] },
    { id: 'HIGH_SERVICE_LEVEL', name: 'High Service Level Target', description: 'Eg. OTIF target ≥ 99%', examples: ['Premium service items'] },
    { id: 'NORMAL_SERVICE_LEVEL', name: 'Normal Service Level Target', description: 'Eg. OTIF target 95–98%', examples: ['Standard service items'] },
    { id: 'LOW_SERVICE_LEVEL', name: 'Low Service Level Target', description: 'Eg. OTIF target < 95% (low-critical items where cost dominates)', examples: ['Cost-focused items'] }
  ],
  'value-cost-impact': [
    { id: 'HIGH_VALUE_ITEM', name: 'High Value Item', description: 'High per-unit cost (e.g., chemo, biologics, implants)', examples: ['Chemotherapy drugs', 'biologics', 'implants'] },
    { id: 'MEDIUM_VALUE_ITEM', name: 'Medium Value Item', description: 'Standard meds', examples: ['Standard medications'] },
    { id: 'LOW_VALUE_ITEM', name: 'Low Value Item', description: 'Very low cost; stockouts more painful in reputation than in finance', examples: ['Basic medications'] },
    { id: 'HIGH_MARGIN_ITEM', name: 'High Margin Item', description: 'Revenue-generating focus (especially for OPD/retail)', examples: ['OPD retail items'] },
    { id: 'LOW_MARGIN_ITEM', name: 'Low Margin Item', description: 'Needed for service but financially thin', examples: ['Essential low-cost items'] },
    { id: 'HIGH_STOCK_VALUE', name: 'High Stock Value', description: 'Large amount of capital tied up in this item/lot', examples: ['High-value inventory'] },
    { id: 'LOW_STOCK_VALUE', name: 'Low Stock Value', description: 'Even if overstocked, financial risk is limited', examples: ['Low-risk inventory'] }
  ],
  'policy-handling': [
    { id: 'RESTRICTED_USE', name: 'Restricted Use', description: 'Only certain departments/consultants can order (e.g., high-risk meds)', examples: ['Controlled medications'] },
    { id: 'FORMULARY_ITEM', name: 'Formulary Item', description: 'On standard list; preferred option', examples: ['Standard formulary'] },
    { id: 'NON_FORMULARY_ITEM', name: 'Non-Formulary Item', description: 'Allowed by exception; not routinely stocked', examples: ['Special request items'] },
    { id: 'SUBSTITUTION_ALLOWED', name: 'Substitution Allowed', description: 'Therapeutic or generic substitution permitted', examples: ['Generic alternatives'] },
    { id: 'SUBSTITUTION_NOT_ALLOWED', name: 'Substitution Not Allowed', description: 'Must supply exact molecule/brand', examples: ['Brand-specific items'] },
    { id: 'COLD_CHAIN_ITEM', name: 'Cold Chain Item', description: 'Needs special storage & logistics', examples: ['Vaccines', 'biologics'] },
    { id: 'CONTROLLED_SUBSTANCE', name: 'Controlled Substance', description: 'Extra documentation, stricter tracking', examples: ['Narcotics', 'controlled drugs'] },
    { id: 'KIT_COMPONENT', name: 'Kit Component', description: 'Part of predefined kits (OT, chemo, procedure kits)', examples: ['Surgical kits', 'procedure sets'] }
  ]
};

// Sankey Diagram Data
export const sankeyData = {
  leftNodes: [
    { id: 'emergency-medicines', name: 'Emergency Medicines', value: 2500, color: '#ef4444' },
    { id: 'ot-medicines', name: 'OT Medicines', value: 3200, color: '#f97316' },
    { id: 'ward-medicines', name: 'Ward Medicines', value: 4100, color: '#eab308' },
    { id: 'daycare-medicines', name: 'Daycare Medicines', value: 1800, color: '#22c55e' },
    { id: 'general-medicines', name: 'General Medicines', value: 5500, color: '#3b82f6' },
    { id: 'implant-medicines', name: 'Implant Medicines', value: 1200, color: '#8b5cf6' }
  ],
  rightNodes: [
    { 
      id: 'emergency-critical-care', 
      name: 'Emergency & Critical Care', 
      value: 3800,
      color: '#ef4444',
      drillDown: [
        { id: 'emergency-casualty', name: 'Emergency / Casualty', subItems: ['A&E / Casualty / Trauma'] },
        { id: 'intensive-care', name: 'Intensive Care Units (ICUs)', subItems: ['Medical ICU', 'Surgical ICU', 'Neuro ICU', 'Cardiac ICU'] },
        { id: 'hdu', name: 'HDU', subItems: ['High Dependency Unit'] },
        { id: 'pediatric-critical', name: 'Paediatric & Neonatal Critical', subItems: ['PICU', 'NICU'] }
      ]
    },
    { 
      id: 'operating-theatres', 
      name: 'Operating Theatres & Procedure Suites', 
      value: 4200,
      color: '#f97316',
      drillDown: [
        { id: 'main-ots', name: 'Main OTs', subItems: ['General OT', 'Ortho OT', 'Neuro OT', 'Cardiac OT'] },
        { id: 'day-surgery', name: 'Day Surgery / Minor OT', subItems: ['Day-care OT', 'Endoscopy Suite'] },
        { id: 'cath-lab', name: 'Cath Lab / Interventional', subItems: ['Cath Lab'] }
      ]
    },
    { 
      id: 'inpatient-wards', 
      name: 'Inpatient Wards & Units', 
      value: 5100,
      color: '#eab308',
      drillDown: [
        { id: 'general-medical', name: 'General Medical & Surgical', subItems: ['Adult Medical Ward', 'Surgical Ward'] },
        { id: 'specialty-wards', name: 'Specialty Wards', subItems: ['Cardiology Ward', 'Neurology Ward', 'Trauma Ward'] },
        { id: 'maternity-obstetrics', name: 'Maternity & Obstetrics', subItems: ['Labour Ward', 'Post-natal Ward'] },
        { id: 'pediatric-wards', name: 'Paediatric Wards', subItems: ['Paediatric Ward'] }
      ]
    },
    { 
      id: 'outpatient-ambulatory', 
      name: 'Outpatient & Ambulatory', 
      value: 3600,
      color: '#22c55e',
      drillDown: [
        { id: 'opd', name: 'OPD', subItems: ['General OPD', 'Specialty OPD'] },
        { id: 'retail-pharmacy', name: 'Retail Pharmacy', subItems: ['OPD Pharmacy'] },
        { id: 'specialty-clinics', name: 'Specialty Clinics', subItems: ['HIV Clinic', 'TB Clinic'] },
        { id: 'day-care-infusion', name: 'Day-care / Infusion', subItems: ['Chemo Day-care', 'Dialysis Day-care'] }
      ]
    },
    { 
      id: 'diagnostic-interventional', 
      name: 'Diagnostic & Interventional', 
      value: 2200,
      color: '#3b82f6',
      drillDown: [
        { id: 'radiology', name: 'Radiology', subItems: ['CT/MRI/USG Units'] },
        { id: 'endoscopy-gi', name: 'Endoscopy / GI Labs', subItems: ['Endoscopy Unit'] },
        { id: 'dialysis', name: 'Dialysis', subItems: ['Hemodialysis Unit'] }
      ]
    },
    { 
      id: 'special-therapies', 
      name: 'Special Therapies & Programs', 
      value: 1800,
      color: '#8b5cf6',
      drillDown: [
        { id: 'oncology', name: 'Oncology', subItems: ['Oncology Ward', 'Chemo Day-care'] },
        { id: 'transplant-programs', name: 'Transplant Programs', subItems: ['Transplant Unit'] },
        { id: 'infectious-disease', name: 'Infectious Disease Program', subItems: ['DOTS Centre'] }
      ]
    },
    { 
      id: 'pharmacy-network', 
      name: 'Pharmacy Network', 
      value: 2800,
      color: '#06b6d4',
      drillDown: [
        { id: 'ward-pharmacies', name: 'Ward Pharmacies', subItems: ['Satellite Pharmacy'] },
        { id: 'central-pharmacy', name: 'Central Pharmacy', subItems: ['Main Store'] },
        { id: 'opd-pharmacy', name: 'OPD Pharmacy', subItems: ['Retail Pharmacy'] }
      ]
    },
    { 
      id: 'support-areas', 
      name: 'Support Areas', 
      value: 1500,
      color: '#64748b',
      drillDown: [
        { id: 'employee-clinic', name: 'Employee Clinic', subItems: ['Staff Clinic'] },
        { id: 'ambulance', name: 'Ambulance', subItems: ['Ambulance Fleet'] },
        { id: 'training-research', name: 'Training / Research', subItems: ['Simulation Lab'] }
      ]
    }
  ]
};

// KPI Cards Data for OTIF
export const otifKpiCards = {
  dataSet1: [
    {
      id: 'stock-out-frequency',
      title: 'Stock-out Frequency',
      current: 15,
      target: 2,
      forecast: 8,
      unit: 'incidents',
      trend: 'improving',
      chartData: [
        { period: 'Week 1', current: 16, forecast: 14, target: 2 },
        { period: 'Week 2', current: 15, forecast: 13, target: 2 },
        { period: 'Week 3', current: 13, forecast: 11, target: 2 },
        { period: 'Week 4', current: 12, forecast: 10, target: 2 },
        { period: 'Week 5', current: 11, forecast: 9, target: 2 },
        { period: 'Week 6', current: 10, forecast: 8, target: 2 },
        { period: 'Week 7', current: 9, forecast: 7, target: 2 },
        { period: 'Week 8', current: 8, forecast: 6, target: 2 }
      ]
    },
    {
      id: 'delivery-performance',
      title: 'Delivery Performance',
      current: 88.9,
      target: 98.0,
      forecast: 94.5,
      unit: '%',
      trend: 'improving',
      chartData: [
        { period: 'Week 1', current: 86.2, forecast: 87.5, target: 98 },
        { period: 'Week 2', current: 87.1, forecast: 89.2, target: 98 },
        { period: 'Week 3', current: 88.9, forecast: 91.0, target: 98 },
        { period: 'Week 4', current: 89.5, forecast: 92.5, target: 98 },
        { period: 'Week 5', current: 90.2, forecast: 93.8, target: 98 },
        { period: 'Week 6', current: 91.0, forecast: 94.5, target: 98 },
        { period: 'Week 7', current: 91.8, forecast: 95.2, target: 98 },
        { period: 'Week 8', current: 92.5, forecast: 95.8, target: 98 }
      ]
    },
    {
      id: 'inventory-turnover',
      title: 'Inventory Turnover',
      current: 4.2,
      target: 6.0,
      forecast: 5.1,
      unit: 'times/year',
      trend: 'improving',
      chartData: [
        { period: 'Q1', current: 3.8, forecast: 4.2, target: 6.0 },
        { period: 'Q2', current: 4.0, forecast: 4.5, target: 6.0 },
        { period: 'Q3', current: 4.2, forecast: 4.8, target: 6.0 },
        { period: 'Q4', current: 4.4, forecast: 5.1, target: 6.0 }
      ]
    },
    {
      id: 'cost-efficiency',
      title: 'Cost Efficiency',
      current: 76.3,
      target: 85.0,
      forecast: 82.1,
      unit: '%',
      trend: 'improving',
      chartData: [
        { period: 'Month 1', current: 74.5, forecast: 76.2, target: 85 },
        { period: 'Month 2', current: 75.8, forecast: 78.1, target: 85 },
        { period: 'Month 3', current: 76.3, forecast: 79.5, target: 85 },
        { period: 'Month 4', current: 77.2, forecast: 80.8, target: 85 },
        { period: 'Month 5', current: 78.1, forecast: 81.9, target: 85 },
        { period: 'Month 6', current: 79.0, forecast: 82.1, target: 85 }
      ]
    }
  ],
  dataSet2: [
    {
      id: 'stock-out-frequency',
      title: 'Stock-out Frequency',
      current: 3,
      target: 2,
      forecast: 2,
      unit: 'incidents',
      trend: 'stable',
      chartData: [
        { period: 'Week 1', current: 8, forecast: 6, target: 2 },
        { period: 'Week 2', current: 6, forecast: 5, target: 2 },
        { period: 'Week 3', current: 5, forecast: 4, target: 2 },
        { period: 'Week 4', current: 4, forecast: 3, target: 2 },
        { period: 'Week 5', current: 3, forecast: 3, target: 2 },
        { period: 'Week 6', current: 3, forecast: 2, target: 2 },
        { period: 'Week 7', current: 2, forecast: 2, target: 2 },
        { period: 'Week 8', current: 2, forecast: 2, target: 2 }
      ]
    },
    {
      id: 'delivery-performance',
      title: 'Delivery Performance',
      current: 97.1,
      target: 98.0,
      forecast: 98.2,
      unit: '%',
      trend: 'improving',
      chartData: [
        { period: 'Week 1', current: 94.5, forecast: 95.2, target: 98 },
        { period: 'Week 2', current: 95.8, forecast: 96.5, target: 98 },
        { period: 'Week 3', current: 96.5, forecast: 97.1, target: 98 },
        { period: 'Week 4', current: 97.1, forecast: 97.8, target: 98 },
        { period: 'Week 5', current: 97.5, forecast: 98.0, target: 98 },
        { period: 'Week 6', current: 97.8, forecast: 98.2, target: 98 },
        { period: 'Week 7', current: 98.0, forecast: 98.4, target: 98 },
        { period: 'Week 8', current: 98.2, forecast: 98.5, target: 98 }
      ]
    },
    {
      id: 'inventory-turnover',
      title: 'Inventory Turnover',
      current: 5.8,
      target: 6.0,
      forecast: 6.2,
      unit: 'times/year',
      trend: 'improving',
      chartData: [
        { period: 'Q1', current: 5.1, forecast: 5.4, target: 6.0 },
        { period: 'Q2', current: 5.5, forecast: 5.8, target: 6.0 },
        { period: 'Q3', current: 5.8, forecast: 6.0, target: 6.0 },
        { period: 'Q4', current: 6.0, forecast: 6.2, target: 6.0 }
      ]
    },
    {
      id: 'cost-efficiency',
      title: 'Cost Efficiency',
      current: 84.7,
      target: 85.0,
      forecast: 87.2,
      unit: '%',
      trend: 'improving',
      chartData: [
        { period: 'Month 1', current: 82.1, forecast: 83.5, target: 85 },
        { period: 'Month 2', current: 83.2, forecast: 84.8, target: 85 },
        { period: 'Month 3', current: 84.1, forecast: 85.5, target: 85 },
        { period: 'Month 4', current: 84.7, forecast: 86.2, target: 85 },
        { period: 'Month 5', current: 85.3, forecast: 86.8, target: 85 },
        { period: 'Month 6', current: 85.9, forecast: 87.2, target: 85 }
      ]
    }
  ]
};

// Periodic options
export const periodicOptions = [
  { id: 'live', name: 'Live', enabled: false },
  { id: 'daily', name: 'Daily', enabled: true },
  { id: 'weekly', name: 'Weekly', enabled: true },
  { id: 'monthly', name: 'Monthly', enabled: true },
  { id: 'quarterly', name: 'Quarterly', enabled: true },
  { id: 'yearly', name: 'Yearly', enabled: true }
];
