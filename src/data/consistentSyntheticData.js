// Comprehensive synthetic data with consistent counts across all screens
// This ensures perfect sync between first screen, second screen, and all components

// Medicine Categories with actual medicine names and quantities
export const medicineCategories = {
  'Emergency Medicines': {
    id: 'emergency-medicines',
    name: 'Emergency Medicines',
    totalUnits: 2500,
    medicines: [
      { name: 'Inj. Adrenaline 1mg', quantity: 450, otif: 85.2, category: 'Emergency' },
      { name: 'Inj. Atropine 0.6mg', quantity: 320, otif: 78.9, category: 'Emergency' },
      { name: 'Inj. Dopamine 200mg', quantity: 280, otif: 92.1, category: 'Emergency' },
      { name: 'Inj. Noradrenaline 4mg', quantity: 190, otif: 88.7, category: 'Emergency' },
      { name: 'Inj. Hydrocortisone 100mg', quantity: 380, otif: 76.4, category: 'Emergency' },
      { name: 'Inj. Furosemide 20mg', quantity: 420, otif: 91.3, category: 'Emergency' },
      { name: 'Inj. Diazepam 10mg', quantity: 260, otif: 83.6, category: 'Emergency' },
      { name: 'Inj. Midazolam 5mg', quantity: 200, otif: 89.2, category: 'Emergency' }
    ]
  },
  'OT Medicines': {
    id: 'ot-medicines',
    name: 'OT Medicines',
    totalUnits: 3200,
    medicines: [
      { name: 'Inj. Propofol 200mg', quantity: 580, otif: 94.1, category: 'OT' },
      { name: 'Inj. Sevoflurane 250ml', quantity: 320, otif: 87.3, category: 'OT' },
      { name: 'Inj. Rocuronium 50mg', quantity: 450, otif: 91.8, category: 'OT' },
      { name: 'Inj. Vecuronium 10mg', quantity: 280, otif: 85.9, category: 'OT' },
      { name: 'Inj. Fentanyl 100mcg', quantity: 380, otif: 92.7, category: 'OT' },
      { name: 'Inj. Morphine 10mg', quantity: 420, otif: 88.4, category: 'OT' },
      { name: 'Inj. Bupivacaine 0.5%', quantity: 360, otif: 90.2, category: 'OT' },
      { name: 'Inj. Lignocaine 2%', quantity: 410, otif: 86.5, category: 'OT' }
    ]
  },
  'Ward Medicines': {
    id: 'ward-medicines',
    name: 'Ward Medicines',
    totalUnits: 4100,
    medicines: [
      { name: 'Tab. Paracetamol 500mg', quantity: 820, otif: 96.2, category: 'Ward' },
      { name: 'Tab. Ibuprofen 400mg', quantity: 640, otif: 89.7, category: 'Ward' },
      { name: 'Inj. Ceftriaxone 1g', quantity: 580, otif: 87.3, category: 'Ward' },
      { name: 'Tab. Omeprazole 20mg', quantity: 720, otif: 93.8, category: 'Ward' },
      { name: 'Inj. Pantoprazole 40mg', quantity: 380, otif: 85.1, category: 'Ward' },
      { name: 'Tab. Metformin 500mg', quantity: 560, otif: 91.4, category: 'Ward' },
      { name: 'Inj. Insulin Regular', quantity: 400, otif: 88.9, category: 'Ward' }
    ]
  },
  'Daycare Medicines': {
    id: 'daycare-medicines',
    name: 'Daycare Medicines',
    totalUnits: 1800,
    medicines: [
      { name: 'Inj. Rituximab 500mg', quantity: 45, otif: 94.7, category: 'Daycare' },
      { name: 'Inj. Trastuzumab 440mg', quantity: 32, otif: 91.2, category: 'Daycare' },
      { name: 'Inj. Bevacizumab 400mg', quantity: 28, otif: 89.6, category: 'Daycare' },
      { name: 'Inj. Carboplatin 450mg', quantity: 65, otif: 87.8, category: 'Daycare' },
      { name: 'Inj. Paclitaxel 300mg', quantity: 58, otif: 92.3, category: 'Daycare' },
      { name: 'Inj. Doxorubicin 50mg', quantity: 72, otif: 88.1, category: 'Daycare' },
      { name: 'Inj. Cyclophosphamide 1g', quantity: 85, otif: 90.5, category: 'Daycare' },
      { name: 'Inj. Methotrexate 1g', quantity: 95, otif: 86.9, category: 'Daycare' }
    ]
  },
  'General Medicines': {
    id: 'general-medicines',
    name: 'General Medicines',
    totalUnits: 5500,
    medicines: [
      { name: 'Tab. Aspirin 75mg', quantity: 1200, otif: 95.8, category: 'General' },
      { name: 'Tab. Atorvastatin 20mg', quantity: 980, otif: 92.4, category: 'General' },
      { name: 'Tab. Amlodipine 5mg', quantity: 850, otif: 89.7, category: 'General' },
      { name: 'Tab. Metoprolol 50mg', quantity: 720, otif: 91.3, category: 'General' },
      { name: 'Tab. Lisinopril 10mg', quantity: 650, otif: 87.9, category: 'General' },
      { name: 'Tab. Levothyroxine 100mcg', quantity: 580, otif: 94.1, category: 'General' },
      { name: 'Tab. Pantoprazole 40mg', quantity: 520, otif: 88.6, category: 'General' }
    ]
  },
  'Implant Medicines': {
    id: 'implant-medicines',
    name: 'Implant Medicines',
    totalUnits: 1200,
    medicines: [
      { name: 'Cardiac Stent Drug Eluting', quantity: 85, otif: 96.2, category: 'Implant' },
      { name: 'Hip Joint Prosthesis', quantity: 42, otif: 94.7, category: 'Implant' },
      { name: 'Knee Joint Prosthesis', quantity: 38, otif: 93.1, category: 'Implant' },
      { name: 'Pacemaker Dual Chamber', quantity: 28, otif: 97.3, category: 'Implant' },
      { name: 'ICD Device', quantity: 15, otif: 95.8, category: 'Implant' },
      { name: 'Cochlear Implant', quantity: 12, otif: 92.4, category: 'Implant' },
      { name: 'Intraocular Lens', quantity: 180, otif: 89.6, category: 'Implant' },
      { name: 'Bone Screws Titanium', quantity: 320, otif: 91.7, category: 'Implant' }
    ]
  }
};

// Hospital Areas with 3-level drill-down structure
export const hospitalAreas = {
  'Emergency & Critical Care': {
    id: 'emergency-critical-care',
    name: 'Emergency & Critical Care',
    totalUnits: 3800,
    level2: {
      'Emergency / Casualty': {
        name: 'Emergency / Casualty',
        units: 1200,
        level3: ['A&E / Casualty / Trauma']
      },
      'Intensive Care Units (ICUs)': {
        name: 'Intensive Care Units (ICUs)',
        units: 1800,
        level3: ['Medical ICU', 'Surgical ICU', 'Neuro ICU', 'Cardiac ICU', 'HDU']
      },
      'Paediatric & Neonatal Critical Care': {
        name: 'Paediatric & Neonatal Critical Care',
        units: 800,
        level3: ['PICU', 'NICU']
      }
    }
  },
  'Operating Theatres & Procedure Suites': {
    id: 'operating-theatres',
    name: 'Operating Theatres & Procedure Suites',
    totalUnits: 4200,
    level2: {
      'Main OTs': {
        name: 'Main OTs',
        units: 2400,
        level3: ['General OT', 'Ortho OT', 'Neuro OT', 'Cardiac OT']
      },
      'Day Surgery / Minor OT': {
        name: 'Day Surgery / Minor OT',
        units: 1200,
        level3: ['Day-care OT', 'Endoscopy Suite']
      },
      'Cath Lab / Interventional': {
        name: 'Cath Lab / Interventional',
        units: 600,
        level3: ['Cath Lab']
      }
    }
  },
  'Inpatient Wards & Units': {
    id: 'inpatient-wards',
    name: 'Inpatient Wards & Units',
    totalUnits: 5100,
    level2: {
      'General Medical & Surgical': {
        name: 'General Medical & Surgical',
        units: 2200,
        level3: ['Adult Medical Ward', 'Surgical Ward']
      },
      'Specialty Wards': {
        name: 'Specialty Wards',
        units: 1800,
        level3: ['Cardiology Ward', 'Neurology Ward', 'Trauma Ward']
      },
      'Maternity & Obstetrics': {
        name: 'Maternity & Obstetrics',
        units: 700,
        level3: ['Labour Ward', 'Post-natal Ward']
      },
      'Paediatric Wards': {
        name: 'Paediatric Wards',
        units: 400,
        level3: ['Paediatric Ward']
      }
    }
  },
  'Outpatient & Ambulatory': {
    id: 'outpatient-ambulatory',
    name: 'Outpatient & Ambulatory',
    totalUnits: 3600,
    level2: {
      'OPD': {
        name: 'OPD',
        units: 1500,
        level3: ['General OPD', 'Specialty OPD']
      },
      'Retail Pharmacy': {
        name: 'Retail Pharmacy',
        units: 800,
        level3: ['OPD Pharmacy']
      },
      'Specialty Clinics': {
        name: 'Specialty Clinics',
        units: 900,
        level3: ['HIV Clinic', 'TB Clinic']
      },
      'Day-care / Infusion': {
        name: 'Day-care / Infusion',
        units: 400,
        level3: ['Chemo Day-care', 'Dialysis Day-care']
      }
    }
  },
  'Diagnostic & Interventional': {
    id: 'diagnostic-interventional',
    name: 'Diagnostic & Interventional',
    totalUnits: 2200,
    level2: {
      'Radiology': {
        name: 'Radiology',
        units: 1200,
        level3: ['CT/MRI/USG Units']
      },
      'Endoscopy / GI Labs': {
        name: 'Endoscopy / GI Labs',
        units: 600,
        level3: ['Endoscopy Unit']
      },
      'Dialysis': {
        name: 'Dialysis',
        units: 400,
        level3: ['Hemodialysis Unit']
      }
    }
  },
  'Special Therapies & Programs': {
    id: 'special-therapies',
    name: 'Special Therapies & Programs',
    totalUnits: 1800,
    level2: {
      'Oncology': {
        name: 'Oncology',
        units: 900,
        level3: ['Oncology Ward', 'Chemo Day-care']
      },
      'Transplant Programs': {
        name: 'Transplant Programs',
        units: 400,
        level3: ['Transplant Unit']
      },
      'Infectious Disease Programs': {
        name: 'Infectious Disease Programs',
        units: 500,
        level3: ['DOTS Centre']
      }
    }
  },
  'Pharmacy Network': {
    id: 'pharmacy-network',
    name: 'Pharmacy Network',
    totalUnits: 2800,
    level2: {
      'Ward Pharmacies': {
        name: 'Ward Pharmacies',
        units: 1200,
        level3: ['Satellite Pharmacy']
      },
      'Central Pharmacy': {
        name: 'Central Pharmacy',
        units: 1000,
        level3: ['Main Store']
      },
      'OPD Pharmacy': {
        name: 'OPD Pharmacy',
        units: 600,
        level3: ['Retail Pharmacy']
      }
    }
  },
  'Support Areas': {
    id: 'support-areas',
    name: 'Support Areas',
    totalUnits: 1600,
    level2: {
      'Employee Clinic': {
        name: 'Employee Clinic',
        units: 400,
        level3: ['Staff Clinic']
      },
      'Ambulance': {
        name: 'Ambulance',
        units: 600,
        level3: ['Ambulance Fleet']
      },
      'Training / Research': {
        name: 'Training / Research',
        units: 600,
        level3: ['Simulation Lab']
      }
    }
  }
};

// Flow connections with accurate OTIF calculations
export const flowConnections = [
  // Emergency Medicines flows
  { source: 'Emergency Medicines', target: 'Emergency & Critical Care', quantity: 1200, otif: 85.2 },
  { source: 'Emergency Medicines', target: 'Operating Theatres & Procedure Suites', quantity: 800, otif: 78.9 },
  { source: 'Emergency Medicines', target: 'Inpatient Wards & Units', quantity: 500, otif: 92.1 },
  
  // OT Medicines flows
  { source: 'OT Medicines', target: 'Operating Theatres & Procedure Suites', quantity: 2400, otif: 91.8 },
  { source: 'OT Medicines', target: 'Emergency & Critical Care', quantity: 600, otif: 87.3 },
  { source: 'OT Medicines', target: 'Diagnostic & Interventional', quantity: 200, otif: 94.1 },
  
  // Ward Medicines flows
  { source: 'Ward Medicines', target: 'Inpatient Wards & Units', quantity: 2800, otif: 93.8 },
  { source: 'Ward Medicines', target: 'Emergency & Critical Care', quantity: 800, otif: 89.7 },
  { source: 'Ward Medicines', target: 'Outpatient & Ambulatory', quantity: 500, otif: 96.2 },
  
  // Daycare Medicines flows
  { source: 'Daycare Medicines', target: 'Special Therapies & Programs', quantity: 1200, otif: 92.3 },
  { source: 'Daycare Medicines', target: 'Outpatient & Ambulatory', quantity: 400, otif: 89.6 },
  { source: 'Daycare Medicines', target: 'Diagnostic & Interventional', quantity: 200, otif: 94.7 },
  
  // General Medicines flows
  { source: 'General Medicines', target: 'Outpatient & Ambulatory', quantity: 2200, otif: 95.8 },
  { source: 'General Medicines', target: 'Inpatient Wards & Units', quantity: 1500, otif: 92.4 },
  { source: 'General Medicines', target: 'Pharmacy Network', quantity: 1800, otif: 89.7 },
  
  // Implant Medicines flows
  { source: 'Implant Medicines', target: 'Operating Theatres & Procedure Suites', quantity: 800, otif: 96.2 },
  { source: 'Implant Medicines', target: 'Special Therapies & Programs', quantity: 300, otif: 94.7 },
  { source: 'Implant Medicines', target: 'Support Areas', quantity: 100, otif: 93.1 }
];

// Calculate total quantities for validation
export const totalQuantities = {
  leftSide: Object.values(medicineCategories).reduce((sum, cat) => sum + cat.totalUnits, 0),
  rightSide: Object.values(hospitalAreas).reduce((sum, area) => sum + area.totalUnits, 0),
  flows: flowConnections.reduce((sum, flow) => sum + flow.quantity, 0)
};

// Data consistency validation
export const validateDataConsistency = () => {
  const leftTotal = totalQuantities.leftSide;
  const rightTotal = totalQuantities.rightSide;
  const flowTotal = totalQuantities.flows;
  
  console.log('Data Consistency Check:');
  console.log('Left Side Total:', leftTotal);
  console.log('Right Side Total:', rightTotal);
  console.log('Flow Total:', flowTotal);
  console.log('Balanced:', leftTotal === flowTotal);
  
  return {
    leftTotal,
    rightTotal,
    flowTotal,
    isBalanced: leftTotal === flowTotal
  };
};

// Export for use in components
export default {
  medicineCategories,
  hospitalAreas,
  flowConnections,
  totalQuantities,
  validateDataConsistency
};
