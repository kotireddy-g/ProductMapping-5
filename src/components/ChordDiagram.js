import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, Maximize2, X } from 'lucide-react';
import supplyDemandService from '../services/supplyDemandService';

// Mock data structures (fallback)
const hospitalSupply = {
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

const hospitalDemand = {
  level1: [
    { id: 'class_1_critical_controlled', name: 'Class 1 – Critical Controlled Medicines' },
    { id: 'class_2_standard_prescription', name: 'Class 2 – Standard Prescription Medicines' },
    { id: 'class_3_restricted_complementary', name: 'Class 3 – Restricted / Complementary' },
    { id: 'class_4_pharmacy_otc', name: 'Class 4 – Pharmacy-only / OTC Medicines' },
    { id: 'class_5_lab_technical', name: 'Class 5 – Lab / Technical' }
  ],
  level2: {
    class_1_critical_controlled: [
      { id: 'analgesics_anaesthetics', name: 'Analgesics & Anaesthetics' },
      { id: 'anti_infectives', name: 'Anti-infectives' },
      { id: 'blood_products', name: 'Blood & Blood Products' },
      { id: 'cns_psychiatric', name: 'CNS & Psychiatric' },
      { id: 'cardiovascular', name: 'Cardiovascular' },
      { id: 'emergency_resuscitation', name: 'Emergency & Resuscitation' },
      { id: 'endocrine_metabolic', name: 'Endocrine & Metabolic' },
      { id: 'obstetrics_gynaecology', name: 'Obstetrics & Gynaecology' },
      { id: 'oncology_immunology', name: 'Oncology & Immunology' },
      { id: 'renal_electrolytes_iv_fluids', name: 'Renal, Electrolytes & IV Fluids' }
    ],
    class_2_standard_prescription: [
      { id: 'analgesics_anaesthetics_2', name: 'Analgesics & Anaesthetics' },
      { id: 'anti_infectives_2', name: 'Anti-infectives' },
      { id: 'cns_psychiatric_2', name: 'CNS & Psychiatric' },
      { id: 'cardiovascular_2', name: 'Cardiovascular' },
      { id: 'dermatologicals', name: 'Dermatologicals' },
      { id: 'emergency_resuscitation_2', name: 'Emergency & Resuscitation' },
      { id: 'endocrine_metabolic_2', name: 'Endocrine & Metabolic' },
      { id: 'gastrointestinal', name: 'Gastrointestinal' },
      { id: 'nutrition', name: 'Nutrition' },
      { id: 'obstetrics_gynaecology_2', name: 'Obstetrics & Gynaecology' },
      { id: 'ophthalmic_otic', name: 'Ophthalmic & Otic' },
      { id: 'renal_electrolytes_iv_fluids_2', name: 'Renal, Electrolytes & IV Fluids' },
      { id: 'respiratory', name: 'Respiratory' },
      { id: 'vaccines_immunologicals', name: 'Vaccines & Immunologicals' }
    ],
    class_4_pharmacy_otc: [
      { id: 'nutrition_4', name: 'Nutrition' }
    ]
  },
  level3: {
    analgesics_anaesthetics: [
      { id: 'general_anaesthetics', name: 'General anaesthetics' },
      { id: 'neuromuscular_blockers', name: 'Neuromuscular blockers' },
      { id: 'opioid_analgesics', name: 'Opioid analgesics' }
    ],
    anti_infectives: [
      { id: 'antifungals', name: 'Antifungals' },
      { id: 'carbapenems', name: 'Carbapenems' },
      { id: 'glycopeptides', name: 'Glycopeptides' },
      { id: 'oxazolidinones', name: 'Oxazolidinones' }
    ],
    blood_products: [
      { id: 'blood_components', name: 'Blood components' },
      { id: 'coagulation_factors', name: 'Coagulation factors / haemostatics' }
    ],
    cns_psychiatric: [
      { id: 'anxiolytics', name: 'Anxiolytics' },
      { id: 'mood_stabilisers', name: 'Mood Stabilisers' },
      { id: 'antidepressants', name: 'Antidepressants' },
      { id: 'antiepileptics', name: 'Antiepileptics' },
      { id: 'antiparkinsonian', name: 'Antiparkinsonian' },
      { id: 'antipsychotics', name: 'Antipsychotics' }
    ],
    cardiovascular: [
      { id: 'anticoagulants', name: 'Anticoagulants' },
      { id: 'vasopressors_inotropes', name: 'Vasopressors / Inotropes' },
      { id: 'antianginals', name: 'Antianginals' },
      { id: 'antiarrhythmics', name: 'Antiarrhythmics' },
      { id: 'antihypertensives_ace', name: 'Antihypertensives - ACE inhibitors' },
      { id: 'antihypertensives_arbs', name: 'Antihypertensives - ARBs' },
      { id: 'antihypertensives_ccbs', name: 'Antihypertensives - CCBs' },
      { id: 'antihypertensives_beta', name: 'Antihypertensives - beta blockers' },
      { id: 'antiplatelets', name: 'Antiplatelets' },
      { id: 'diuretics', name: 'Diuretics' },
      { id: 'lipid_lowering', name: 'Lipid-lowering' }
    ],
    emergency_resuscitation: [
      { id: 'acute_coronary_syndrome', name: 'Acute coronary syndrome' },
      { id: 'anaphylaxis_cardiac_arrest', name: 'Anaphylaxis / Cardiac arrest' },
      { id: 'status_epilepticus', name: 'Status epilepticus' },
      { id: 'opioid_overdose', name: 'Opioid overdose' },
      { id: 'severe_asthma', name: 'Severe asthma exacerbation' },
      { id: 'severe_hyperkalaemia', name: 'Severe hyperkalaemia' },
      { id: 'poisoning_toxicology', name: 'Poisoning / toxicology' },
      { id: 'shock_resuscitation', name: 'Shock / volume resuscitation' }
    ],
    endocrine_metabolic: [
      { id: 'insulins', name: 'Insulins' },
      { id: 'corticosteroids', name: 'Corticosteroids' },
      { id: 'oral_antidiabetics', name: 'Oral antidiabetics' },
      { id: 'osteoporosis', name: 'Osteoporosis' },
      { id: 'thyroid_hormones', name: 'Thyroid hormones' }
    ],
    obstetrics_gynaecology: [
      { id: 'uterotonics', name: 'Uterotonics' },
      { id: 'contraceptives', name: 'Contraceptives' },
      { id: 'emergency_contraception', name: 'Emergency contraception' },
      { id: 'tocolytics', name: 'Tocolytics' }
    ],
    oncology_immunology: [
      { id: 'adjuncts', name: 'Adjuncts' },
      { id: 'cytotoxic_chemotherapy', name: 'Cytotoxic chemotherapy' }
    ],
    renal_electrolytes_iv_fluids: [
      { id: 'acid_base_therapy', name: 'Acid–base therapy' },
      { id: 'electrolytes', name: 'Electrolytes' },
      { id: 'crystalloids', name: 'Crystalloids' },
      { id: 'maintenance_fluids', name: 'Maintenance fluids' }
    ],
    gastrointestinal: [
      { id: 'antidiarrhoeals', name: 'Antidiarrhoeals' },
      { id: 'antiemetics', name: 'Antiemetics' },
      { id: 'antispasmodics', name: 'Antispasmodics' },
      { id: 'h2_antagonists', name: 'H2 antagonists' },
      { id: 'laxatives', name: 'Laxatives' },
      { id: 'ppis', name: 'Proton pump inhibitors (PPIs)' },
      { id: 'ulcer_healing_agents', name: 'Ulcer-healing agents' }
    ],
    nutrition: [
      { id: 'enteral_feeds', name: 'Enteral feeds' },
      { id: 'vitamins_minerals', name: 'Vitamins & minerals' }
    ],
    ophthalmic_otic: [
      { id: 'ophthalmic_antiallergics', name: 'Ophthalmic antiallergics' },
      { id: 'ophthalmic_antibiotics', name: 'Ophthalmic antibiotics' },
      { id: 'ophthalmic_lubricants', name: 'Ophthalmic lubricants' },
      { id: 'otic_preparations', name: 'Otic preparations' }
    ],
    respiratory: [
      { id: 'ics_laba', name: 'ICS/LABA combinations' },
      { id: 'inhaled_anticholinergics', name: 'Inhaled anticholinergics' },
      { id: 'inhaled_corticosteroids', name: 'Inhaled corticosteroids (ICS)' },
      { id: 'leukotriene_antagonists', name: 'Leukotriene receptor antagonists' },
      { id: 'saba', name: 'Short-acting beta agonists (SABA)' },
      { id: 'systemic_corticosteroids', name: 'Systemic corticosteroids' }
    ],
    vaccines_immunologicals: [
      { id: 'adult_vaccines', name: 'Adult vaccines' },
      { id: 'childhood_vaccines', name: 'Childhood vaccines' }
    ]
  }
};

// Simple hash function for CONSISTENT values
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Get consistent stock value for a node
const getStockValue = (nodeId) => {
  const hash = hashCode(nodeId);
  return 100 + (hash % 450);
};

// Get consistent OTIF value for a node
const getOTIFValue = (nodeId) => {
  const hash = hashCode(nodeId);
  return (85 + (hash % 13)).toFixed(1);
};

// Get consistent TAT value for a node
const getTATValue = (nodeId) => {
  const hash = hashCode(nodeId);
  return (1.5 + ((hash % 30) / 10)).toFixed(1);
};

// Generate CONSISTENT connections - values won't change
// Generate CONSISTENT connections - values won't change
const generateConnections = (supplyItems, demandItems, flowsData) => {
  // If we have real flow data from API, use it
  if (flowsData && flowsData.length > 0) {
    // Filter flows to only include connections between current supply and demand items
    const supplyIds = supplyItems.map(s => s.id);
    const demandIds = demandItems.map(d => d.id);

    return flowsData
      .filter(flow => supplyIds.includes(flow.source) && demandIds.includes(flow.target))
      .map(flow => ({
        source: flow.source,
        target: flow.target,
        value: flow.quantity || flow.value || 0,
        speed: flow.velocity || flow.speed || 'medium',
        otif: flow.otif?.toFixed(1) || '0.0',
        tat: flow.tat?.toFixed(1) || flow.timeHours?.toFixed(1) || '0.0',
        ordered: flow.ordered,
        delivered: flow.delivered,
        // Forecast data
        forecastQty: flow.forecastQty || 0,
        forecastSharePct: flow.forecastSharePct || 0,
        forecastCount: flow.forecastCount || 0
      }));
  }

  // Fallback to mock data generation if no API data
  const connections = [];
  const speeds = ['fast', 'medium', 'slow', 'occasional'];

  supplyItems.forEach((supply) => {
    demandItems.forEach((demand) => {
      const combinedId = `${supply.id}-${demand.id}`;
      const hash = hashCode(combinedId);

      // Use hash to determine if connection exists (consistent)
      const shouldConnect = (hash % 10) > 2;

      if (shouldConnect) {
        const speedIndex = hash % speeds.length;
        const speed = speeds[speedIndex];

        // Consistent value based on hash
        const baseValue = (hash % 50) + 10;
        const value = speed === 'fast' ? baseValue + 20 :
          speed === 'medium' ? baseValue + 10 :
            speed === 'slow' ? baseValue :
              baseValue / 2;

        // Consistent metrics based on hash
        const otifBase = 85 + (hash % 13);
        const tatBase = 1.5 + ((hash % 30) / 10);

        connections.push({
          source: supply.id,
          target: demand.id,
          value: value,
          speed: speed,
          otif: otifBase.toFixed(1),
          tat: tatBase.toFixed(1)
        });
      }
    });
  });

  return connections;
};

const HospitalSankeyDiagram = () => {
  // Drill-down state
  const [supplyLevel, setSupplyLevel] = useState(1);
  const [demandLevel, setDemandLevel] = useState(1);
  const [supplyPath, setSupplyPath] = useState([]);
  const [demandPath, setDemandPath] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: null });
  const [connections, setConnections] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [timePeriod, setTimePeriod] = useState('next_7_days'); // New state for time period filter
  const [focusedSupplyNode, setFocusedSupplyNode] = useState(null); // Focus mode state
  const [focusedDemandNode, setFocusedDemandNode] = useState(null); // Focus mode state
  const svgRef = useRef(null);

  // API data state
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use API data if available, otherwise fall back to mock data
  const supplyData = apiData?.supply || hospitalSupply;
  const demandData = apiData?.demand || hospitalDemand;
  const flowsData = apiData?.flows || []; // Empty array fallback - will use mock generation in generateConnections

  // Fetch data from API on mount and when drill-down or time period changes
  useEffect(() => {
    const fetchFlowData = async () => {
      try {
        setLoading(true);

        // Build query parameters for drill-down and time period
        const params = {
          time_period: timePeriod // Add time period to API call
        };
        if (supplyLevel > 1 && supplyPath.length > 0) {
          params.supplyLevel = supplyLevel;
          params.supplyParent = supplyPath[supplyLevel - 2];
        }
        if (demandLevel > 1 && demandPath.length > 0) {
          params.demandLevel = demandLevel;
          params.demandParent = demandPath[demandLevel - 2];
        }

        const response = await supplyDemandService.getFlowData(params);

        if (response.success && response.data) {
          setApiData(response.data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch supply-demand flow data:', err);
        setError('Failed to load data. Using cached data.');
        // Keep using mock data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchFlowData();
  }, [supplyLevel, demandLevel, supplyPath, demandPath, timePeriod]); // Added timePeriod dependency

  // Get current items based on drill-down state
  const getCurrentSupplyItems = () => {
    if (supplyLevel === 1) return supplyData.level1;
    if (supplyLevel === 2) {
      const parentId = supplyPath[0];
      return supplyData.level2[parentId] || [];
    }
    if (supplyLevel === 3) {
      const parentId = supplyPath[1];
      return supplyData.level3[parentId] || [];
    }
    return [];
  };

  const getCurrentDemandItems = () => {
    if (demandLevel === 1) return demandData.level1;
    if (demandLevel === 2) {
      const parentId = demandPath[0];
      return demandData.level2[parentId] || [];
    }
    if (demandLevel === 3) {
      const parentId = demandPath[1];
      return demandData.level3[parentId] || [];
    }
    return [];
  };

  const supplyItems = getCurrentSupplyItems();
  const demandItems = getCurrentDemandItems();

  // Update connections when items or flows change
  useEffect(() => {
    setConnections(generateConnections(supplyItems, demandItems, flowsData));
  }, [supplyItems, demandItems, flowsData]);

  // Handle supply node click
  const handleSupplyClick = (item) => {
    // Check if this node is already focused
    if (focusedSupplyNode?.id === item.id) {
      // Second click - perform drill-down
      setFocusedSupplyNode(null); // Clear focus before drill-down

      // Existing drill-down logic
      if (supplyLevel === 1) {
        setSupplyLevel(2);
        setSupplyPath([item.id]);
      } else if (supplyLevel === 2) {
        setSupplyLevel(3);
        setSupplyPath([...supplyPath, item.id]);
      }
    } else {
      // First click - enter focus mode
      setFocusedSupplyNode(item);
      setFocusedDemandNode(null); // Clear opposite side focus
    }
  };

  // Handle demand node click
  const handleDemandClick = (item) => {
    // Check if this node is already focused
    if (focusedDemandNode?.id === item.id) {
      // Second click - perform drill-down
      setFocusedDemandNode(null); // Clear focus before drill-down

      // Existing drill-down logic
      if (demandLevel === 1) {
        setDemandLevel(2);
        setDemandPath([item.id]);
      } else if (demandLevel === 2) {
        setDemandLevel(3);
        setDemandPath([...demandPath, item.id]);
      }
    } else {
      // First click - enter focus mode
      setFocusedDemandNode(item);
      setFocusedSupplyNode(null); // Clear opposite side focus
    }
  };

  // Reset to initial state
  const resetView = () => {
    setSupplyLevel(1);
    setDemandLevel(1);
    setSupplyPath([]);
    setDemandPath([]);
    setFocusedSupplyNode(null); // Clear focus
    setFocusedDemandNode(null); // Clear focus
  };

  // Clear focus function
  const clearFocus = () => {
    setFocusedSupplyNode(null);
    setFocusedDemandNode(null);
  };

  // Auto-clear focus when level changes
  useEffect(() => {
    setFocusedSupplyNode(null);
    setFocusedDemandNode(null);
  }, [supplyLevel, demandLevel]);

  // Go back one level on supply side
  const goBackSupply = () => {
    if (supplyLevel > 1) {
      setSupplyLevel(supplyLevel - 1);
      setSupplyPath(supplyPath.slice(0, -1));
    }
  };

  // Go back one level on demand side
  const goBackDemand = () => {
    if (demandLevel > 1) {
      setDemandLevel(demandLevel - 1);
      setDemandPath(demandPath.slice(0, -1));
    }
  };

  // Get breadcrumb text
  const getSupplyBreadcrumb = () => {
    if (supplyLevel === 1) return 'Supply: Level 1';
    const parts = ['Supply'];
    supplyPath.forEach((id, idx) => {
      const level = idx + 1;
      const items = level === 1 ? hospitalSupply.level1 :
        level === 2 ? hospitalSupply.level2[supplyPath[0]] :
          hospitalSupply.level3[supplyPath[1]];
      const item = items?.find(i => i.id === id);
      if (item) parts.push(item.name);
    });
    return parts.join(' > ');
  };

  const getDemandBreadcrumb = () => {
    if (demandLevel === 1) return 'Demand: Level 1';
    const parts = ['Demand'];
    demandPath.forEach((id, idx) => {
      const level = idx + 1;
      const items = level === 1 ? hospitalDemand.level1 :
        level === 2 ? hospitalDemand.level2[demandPath[0]] :
          hospitalDemand.level3[demandPath[1]];
      const item = items?.find(i => i.id === id);
      if (item) parts.push(item.name);
    });
    return parts.join(' > ');
  };

  // SVG dimensions and layout
  const width = 1400;
  const height = Math.max(600, Math.max(supplyItems.length, demandItems.length) * 45);
  const leftMargin = 350;
  const rightMargin = 350;
  const centerWidth = width - leftMargin - rightMargin;
  const nodeWidth = 12;
  const nodeSpacing = height / Math.max(supplyItems.length, demandItems.length);

  // Calculate node positions
  const supplyNodes = supplyItems.map((item, i) => ({
    ...item,
    x: leftMargin - nodeWidth,
    y: i * nodeSpacing + nodeSpacing / 2,
    height: nodeSpacing * 0.7
  }));

  const demandNodes = demandItems.map((item, i) => ({
    ...item,
    x: width - rightMargin,
    y: i * nodeSpacing + nodeSpacing / 2,
    height: nodeSpacing * 0.7
  }));

  // Filter nodes based on focus mode
  const visibleSupplyNodes = focusedSupplyNode
    ? supplyNodes.filter(n => n.id === focusedSupplyNode.id)
    : supplyNodes;

  const visibleDemandNodes = focusedDemandNode
    ? demandNodes.filter(n => n.id === focusedDemandNode.id)
    : demandNodes;

  // Filter connections based on focus mode
  const visibleConnections = useMemo(() => {
    let filtered = connections;

    // Filter by focused supply node
    if (focusedSupplyNode) {
      filtered = filtered.filter(conn => conn.source === focusedSupplyNode.id);
    }

    // Filter by focused demand node
    if (focusedDemandNode) {
      filtered = filtered.filter(conn => conn.target === focusedDemandNode.id);
    }

    return filtered;
  }, [connections, focusedSupplyNode, focusedDemandNode]);

  // Create flow paths using FULL bar height
  const createFlowPath = (sourceNode, targetNode, sourceConnections, connectionIndex) => {
    // Calculate cumulative offset for this connection from source node
    let sourceYOffset = 0;
    for (let i = 0; i < connectionIndex; i++) {
      const conn = sourceConnections[i];
      const totalValue = sourceConnections.reduce((sum, c) => sum + c.value, 0);
      sourceYOffset += (conn.value / totalValue) * sourceNode.height;
    }

    const totalSourceValue = sourceConnections.reduce((sum, c) => sum + c.value, 0);
    const flowHeight = (sourceConnections[connectionIndex].value / totalSourceValue) * sourceNode.height;

    const sx = sourceNode.x + nodeWidth;
    const sy1 = (sourceNode.y - sourceNode.height / 2) + sourceYOffset;
    const sy2 = sy1 + flowHeight;

    // Find target connections to calculate target offset
    const targetConnections = connections.filter(c => c.target === targetNode.id);
    const targetConnectionIndex = targetConnections.findIndex(
      c => c.source === sourceNode.id && c.target === targetNode.id
    );

    let targetYOffset = 0;
    for (let i = 0; i < targetConnectionIndex; i++) {
      const conn = targetConnections[i];
      const totalValue = targetConnections.reduce((sum, c) => sum + c.value, 0);
      targetYOffset += (conn.value / totalValue) * targetNode.height;
    }

    const totalTargetValue = targetConnections.reduce((sum, c) => sum + c.value, 0);
    const targetFlowHeight = (targetConnections[targetConnectionIndex].value / totalTargetValue) * targetNode.height;

    const tx = targetNode.x;
    const ty1 = (targetNode.y - targetNode.height / 2) + targetYOffset;
    const ty2 = ty1 + targetFlowHeight;

    const midX = sx + centerWidth / 2;

    // Create the ribbon path using full bar space
    return `
      M ${sx} ${sy1}
      C ${midX} ${sy1}, ${midX} ${ty1}, ${tx} ${ty1}
      L ${tx} ${ty2}
      C ${midX} ${ty2}, ${midX} ${sy2}, ${sx} ${sy2}
Z
    `;
  };

  // Speed colors (for tooltip display only)
  const speedColors = {
    fast: '#10b981',
    medium: '#f59e0b',
    slow: '#eab308',
    occasional: '#9ca3af'
  };

  // Get OTIF-based color for ribbons and text
  const getOTIFColor = (otif) => {
    const otifValue = parseFloat(otif);
    if (otifValue >= 95) return '#10b981'; // Green
    if (otifValue >= 90) return '#f59e0b'; // Yellow/Amber
    return '#ef4444'; // Red
  };

  const handleMouseMove = (e, connection, sourceName, targetName) => {
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      content: {
        source: sourceName,
        target: targetName,
        speed: connection.speed,
        otif: connection.otif,
        tat: connection.tat,
        value: connection.value.toFixed(0),
        // Forecast data
        forecastQty: connection.forecastQty || 0,
        forecastSharePct: connection.forecastSharePct || 0,
        forecastCount: connection.forecastCount || 0
      }
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: null });
  };

  return (
    <>
      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-12 w-12 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-slate-600 font-medium">Loading supply-demand flow data...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {/* Full-Screen Modal */}
      {!loading && isFullScreen && (
        <div className="fixed inset-0 z-50 bg-white overflow-auto">
          {/* Close Button */}
          <button
            onClick={() => setIsFullScreen(false)}
            className="fixed top-4 right-4 z-50 p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
          >
            <X size={24} />
          </button>

          {/* Full-Screen Content */}
          <div className="p-8">
            {/* Movement Speed Legend */}
            <div className="flex gap-6 items-center mb-4 p-3 bg-slate-50 rounded-lg">
              <span className="font-semibold text-gray-700 text-sm">Movement Speed:</span>
              {Object.entries(speedColors).map(([speed, color]) => (
                <div key={speed} className="flex items-center gap-2">
                  <div style={{ width: '32px', height: '8px', background: color, borderRadius: '4px' }} />
                  <span className="text-sm text-gray-700 capitalize">{speed}</span>
                </div>
              ))}
            </div>

            {/* Breadcrumbs */}
            <div className="flex justify-between items-center mb-4 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                {supplyLevel > 1 && (
                  <button
                    onClick={goBackSupply}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    <ChevronLeft size={14} />
                    Back
                  </button>
                )}
                <span className="text-sm text-gray-600">{getSupplyBreadcrumb()}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Clear Focus button - only show when in focus mode */}
                {(focusedSupplyNode || focusedDemandNode) && (
                  <button
                    onClick={clearFocus}
                    className="px-4 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    Clear Focus
                  </button>
                )}

                <button
                  onClick={resetView}
                  className="px-4 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Reset View
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{getDemandBreadcrumb()}</span>
                {demandLevel > 1 && (
                  <button
                    onClick={goBackDemand}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    Back
                    <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                )}
              </div>
            </div>

            {/* Sankey Diagram */}
            <div className="relative overflow-x-auto">
              <svg
                ref={svgRef}
                width={width}
                height={height}
                style={{ overflow: 'visible' }}
              >
                {/* Draw flows first (so they're behind nodes) */}
                {visibleSupplyNodes.map(sourceNode => {
                  const sourceConnections = visibleConnections.filter(c => c.source === sourceNode.id);

                  return sourceConnections.map((conn, connIdx) => {
                    const targetNode = visibleDemandNodes.find(n => n.id === conn.target);
                    if (!targetNode) return null;

                    const sourceName = sourceNode.name;
                    const targetName = targetNode.name;

                    return (
                      <path
                        key={`${sourceNode.id} -${conn.target} `}
                        d={createFlowPath(sourceNode, targetNode, sourceConnections, connIdx)}
                        fill={getOTIFColor(conn.otif)}
                        opacity={0.5}
                        style={{
                          cursor: 'pointer',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.8';
                          handleMouseMove(e, conn, sourceName, targetName);
                        }}
                        onMouseMove={(e) => handleMouseMove(e, conn, sourceName, targetName)}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0.5';
                          handleMouseLeave();
                        }}
                      />
                    );
                  });
                })}

                {/* Supply nodes */}
                {visibleSupplyNodes.map((node) => {
                  const stock = node.stock || getStockValue(node.id);
                  const forecastQty = node.forecastQty || 0;
                  const canDrillDown = (supplyLevel === 1 && hospitalSupply.level2[node.id]) ||
                    (supplyLevel === 2 && hospitalSupply.level3[node.id]);

                  return (
                    <g key={node.id}>
                      <rect
                        x={node.x}
                        y={node.y - node.height / 2}
                        width={nodeWidth}
                        height={node.height}
                        fill="#3b82f6"
                        rx={2}
                        style={{
                          cursor: canDrillDown ? 'pointer' : 'default',
                          filter: canDrillDown ? 'brightness(1.1) drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                        }}
                        onClick={() => canDrillDown && handleSupplyClick(node)}
                      />

                      <text
                        x={node.x - 16}
                        y={node.y - 8}
                        textAnchor="end"
                        dominantBaseline="middle"
                        style={{
                          fontSize: '0.875rem',
                          fill: '#1e293b',
                          fontWeight: 500,
                          cursor: canDrillDown ? 'pointer' : 'default',
                          pointerEvents: 'none'
                        }}
                      >
                        {node.name}
                      </text>

                      <text
                        x={node.x - 16}
                        y={node.y + 8}
                        textAnchor="end"
                        style={{
                          fontSize: '0.7rem',
                          fill: '#64748b',
                          pointerEvents: 'none'
                        }}
                      >
                        Stock: {stock}
                      </text>

                      {forecastQty > 0 && (
                        <text
                          x={node.x - 16}
                          y={node.y + 22}
                          textAnchor="end"
                          style={{
                            fontSize: '0.875rem',
                            fill: '#2563eb',
                            fontWeight: 700,
                            pointerEvents: 'none'
                          }}
                        >
                          Forecast: {forecastQty.toLocaleString()}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Demand nodes */}
                {visibleDemandNodes.map((node) => {
                  const otif = node.otif || getOTIFValue(node.id);
                  const forecastOtif = node.otifForecastPct || null;
                  const tat = node.tat || getTATValue(node.id);
                  const canDrillDown = (demandLevel === 1 && hospitalDemand.level2[node.id]) ||
                    (demandLevel === 2 && hospitalDemand.level3[node.id]);

                  return (
                    <g key={node.id}>
                      <rect
                        x={node.x}
                        y={node.y - node.height / 2}
                        width={nodeWidth}
                        height={node.height}
                        fill="#3b82f6"
                        rx={2}
                        style={{
                          cursor: canDrillDown ? 'pointer' : 'default',
                          filter: canDrillDown ? 'brightness(1.1) drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                        }}
                        onClick={() => canDrillDown && handleDemandClick(node)}
                      />

                      <text
                        x={node.x + nodeWidth + 16}
                        y={node.y - 12}
                        textAnchor="start"
                        dominantBaseline="middle"
                        style={{
                          fontSize: '0.875rem',
                          fill: '#1e293b',
                          fontWeight: 500,
                          cursor: canDrillDown ? 'pointer' : 'default',
                          pointerEvents: 'none'
                        }}
                      >
                        {node.name}
                      </text>

                      <text
                        x={node.x + nodeWidth + 16}
                        y={node.y + 4}
                        textAnchor="start"
                        style={{
                          fontSize: '0.7rem',
                          fill: getOTIFColor(otif),
                          fontWeight: 600,
                          pointerEvents: 'none'
                        }}
                      >
                        OTIF: {typeof otif === 'number' ? otif.toFixed(1) : otif}%
                      </text>

                      {forecastOtif !== null && (
                        <text
                          x={node.x + nodeWidth + 16}
                          y={node.y + 18}
                          textAnchor="start"
                          style={{
                            fontSize: '0.875rem',
                            fill: getOTIFColor(forecastOtif),
                            fontWeight: 700,
                            pointerEvents: 'none'
                          }}
                        >
                          Forecast: {forecastOtif.toFixed(1)}%
                        </text>
                      )}

                      <text
                        x={node.x + nodeWidth + 16}
                        y={node.y + (forecastOtif !== null ? 32 : 18)}
                        textAnchor="start"
                        style={{
                          fontSize: '0.7rem',
                          fill: '#64748b',
                          pointerEvents: 'none'
                        }}
                      >
                        TAT: {typeof tat === 'number' ? tat.toFixed(1) : tat}h
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip */}
              {tooltip.visible && tooltip.content && (
                <div style={{
                  position: 'absolute',
                  left: tooltip.x + 15,
                  top: tooltip.y - 10,
                  background: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  pointerEvents: 'none',
                  zIndex: 1000,
                  minWidth: '240px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                    Flow Details
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.25rem' }}>
                    {tooltip.content.source}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                    → {tooltip.content.target}
                  </div>

                  {/* Forecast Data - Prominent */}
                  {tooltip.content.forecastQty > 0 && (
                    <div style={{
                      background: 'rgba(37, 99, 235, 0.15)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      marginBottom: '0.75rem',
                      border: '1px solid rgba(37, 99, 235, 0.3)'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                        FORECAST
                      </div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.25rem' }}>
                        {tooltip.content.forecastQty.toLocaleString()} units
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {tooltip.content.forecastSharePct}% share • {tooltip.content.forecastCount} items
                      </div>
                    </div>
                  )}

                  {/* Current Data */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    borderTop: '1px solid rgba(148, 163, 184, 0.3)',
                    paddingTop: '0.5rem'
                  }}>
                    <div>
                      <div style={{ color: '#94a3b8' }}>Speed</div>
                      <div style={{
                        color: speedColors[tooltip.content.speed],
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {tooltip.content.speed}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8' }}>Current</div>
                      <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{tooltip.content.value}</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8' }}>OTIF</div>
                      <div style={{ color: getOTIFColor(tooltip.content.otif), fontWeight: 600 }}>{tooltip.content.otif}%</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8' }}>TAT</div>
                      <div style={{ color: '#60a5fa', fontWeight: 600 }}>{tooltip.content.tat}h</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                {
                  label: 'Current Pending Supply',
                  value: apiData?.metrics?.currentPendingSupply?.toLocaleString() || '0',
                  color: '#f59e0b'
                },
                {
                  label: 'Forecast Next Hour',
                  value: apiData?.metrics?.forecastNextHour?.toLocaleString() || '0',
                  color: '#10b981'
                },
                {
                  label: 'Today Demand',
                  value: apiData?.metrics?.todayDemand?.toLocaleString() || '0',
                  color: '#3b82f6'
                }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-4 border-l-4" style={{ borderLeftColor: stat.color }}>
                  <div className="text-sm text-gray-600 mb-1 font-medium">
                    {stat.label}
                  </div>
                  <div className="text-3xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Normal View */}
      {!isFullScreen && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Supply & Demand Flow</h3>
              <p className="text-sm text-gray-600">Interactive visualization of hospital supply chain</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Periodic Filters */}
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
                {[
                  { label: 'Today', value: 'today' },
                  { label: 'Next 7 Days', value: 'next_7_days' },
                  { label: 'Next 14 Days', value: 'next_14_days' },
                  { label: 'Next 28 Days', value: 'next_28_days' }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setTimePeriod(filter.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter.value === timePeriod
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              {/* Expand Button - Icon Only */}
              <button
                onClick={() => setIsFullScreen(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Expand to fullscreen"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          </div>

          {/* Movement Speed Legend */}
          <div className="flex gap-6 items-center mb-4 p-3 bg-slate-50 rounded-lg">
            <span className="font-semibold text-gray-700 text-sm">Movement Speed:</span>
            {Object.entries(speedColors).map(([speed, color]) => (
              <div key={speed} className="flex items-center gap-2">
                <div style={{ width: '32px', height: '8px', background: color, borderRadius: '4px' }} />
                <span className="text-sm text-gray-700 capitalize">{speed}</span>
              </div>
            ))}
          </div>

          {/* Breadcrumbs */}
          <div className="flex justify-between items-center mb-4 p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              {supplyLevel > 1 && (
                <button
                  onClick={goBackSupply}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                >
                  <ChevronLeft size={14} />
                  Back
                </button>
              )}
              <span className="text-sm text-gray-600">{getSupplyBreadcrumb()}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Clear Focus button - only show when in focus mode */}
              {(focusedSupplyNode || focusedDemandNode) && (
                <button
                  onClick={clearFocus}
                  className="px-4 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  Clear Focus
                </button>
              )}

              <button
                onClick={resetView}
                className="px-4 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Reset View
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{getDemandBreadcrumb()}</span>
              {demandLevel > 1 && (
                <button
                  onClick={goBackDemand}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                >
                  Back
                  <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                </button>
              )}
            </div>
          </div>

          {/* Sankey Diagram */}
          <div className="relative overflow-x-auto">
            <svg
              ref={svgRef}
              width={width}
              height={height}
              style={{ overflow: 'visible' }}
            >
              {/* Draw flows first (so they're behind nodes) */}
              {visibleSupplyNodes.map(sourceNode => {
                const sourceConnections = visibleConnections.filter(c => c.source === sourceNode.id);

                return sourceConnections.map((conn, connIdx) => {
                  const targetNode = visibleDemandNodes.find(n => n.id === conn.target);
                  if (!targetNode) return null;

                  const sourceName = sourceNode.name;
                  const targetName = targetNode.name;

                  return (
                    <path
                      key={`${sourceNode.id} -${conn.target} `}
                      d={createFlowPath(sourceNode, targetNode, sourceConnections, connIdx)}
                      fill={getOTIFColor(conn.otif)}
                      opacity={0.5}
                      style={{
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                        handleMouseMove(e, conn, sourceName, targetName);
                      }}
                      onMouseMove={(e) => handleMouseMove(e, conn, sourceName, targetName)}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.5';
                        handleMouseLeave();
                      }}
                    />
                  );
                });
              })}

              {/* Supply nodes */}
              {visibleSupplyNodes.map((node) => {
                const stock = node.stock || getStockValue(node.id);
                const forecastQty = node.forecastQty || 0;
                const canDrillDown = (supplyLevel === 1 && hospitalSupply.level2[node.id]) ||
                  (supplyLevel === 2 && hospitalSupply.level3[node.id]);

                return (
                  <g key={node.id}>
                    {/* Node bar */}
                    <rect
                      x={node.x}
                      y={node.y - node.height / 2}
                      width={nodeWidth}
                      height={node.height}
                      fill="#3b82f6"
                      rx={2}
                      style={{
                        cursor: canDrillDown ? 'pointer' : 'default',
                        filter: canDrillDown ? 'brightness(1.1) drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                      }}
                      onClick={() => canDrillDown && handleSupplyClick(node)}
                    />

                    {/* Label - fully visible to the LEFT */}
                    <text
                      x={node.x - 16}
                      y={node.y - 8}
                      textAnchor="end"
                      dominantBaseline="middle"
                      style={{
                        fontSize: '0.875rem',
                        fill: '#1e293b',
                        fontWeight: 500,
                        cursor: canDrillDown ? 'pointer' : 'default',
                        pointerEvents: 'none'
                      }}
                    >
                      {node.name}
                    </text>

                    {/* Stock count */}
                    <text
                      x={node.x - 16}
                      y={node.y + 8}
                      textAnchor="end"
                      style={{
                        fontSize: '0.7rem',
                        fill: '#64748b',
                        pointerEvents: 'none'
                      }}
                    >
                      Stock: {stock}
                    </text>

                    {/* Forecast Quantity - Prominent */}
                    {forecastQty > 0 && (
                      <text
                        x={node.x - 16}
                        y={node.y + 22}
                        textAnchor="end"
                        style={{
                          fontSize: '0.875rem',
                          fill: '#2563eb',
                          fontWeight: 700,
                          pointerEvents: 'none'
                        }}
                      >
                        Forecast: {forecastQty.toLocaleString()}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Demand nodes */}
              {visibleDemandNodes.map((node) => {
                const otif = node.otif || getOTIFValue(node.id);
                const forecastOtif = node.otifForecastPct || null;
                const tat = node.tat || getTATValue(node.id);
                const canDrillDown = (demandLevel === 1 && hospitalDemand.level2[node.id]) ||
                  (demandLevel === 2 && hospitalDemand.level3[node.id]);

                return (
                  <g key={node.id}>
                    {/* Node bar */}
                    <rect
                      x={node.x}
                      y={node.y - node.height / 2}
                      width={nodeWidth}
                      height={node.height}
                      fill="#3b82f6"
                      rx={2}
                      style={{
                        cursor: canDrillDown ? 'pointer' : 'default',
                        filter: canDrillDown ? 'brightness(1.1) drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                      }}
                      onClick={() => canDrillDown && handleDemandClick(node)}
                    />

                    {/* Label - fully visible to the RIGHT */}
                    <text
                      x={node.x + nodeWidth + 16}
                      y={node.y - 12}
                      textAnchor="start"
                      dominantBaseline="middle"
                      style={{
                        fontSize: '0.875rem',
                        fill: '#1e293b',
                        fontWeight: 500,
                        cursor: canDrillDown ? 'pointer' : 'default',
                        pointerEvents: 'none'
                      }}
                    >
                      {node.name}
                    </text>

                    {/* Current OTIF - Color-coded */}
                    <text
                      x={node.x + nodeWidth + 16}
                      y={node.y + 4}
                      textAnchor="start"
                      style={{
                        fontSize: '0.7rem',
                        fill: getOTIFColor(otif),
                        fontWeight: 600,
                        pointerEvents: 'none'
                      }}
                    >
                      OTIF: {typeof otif === 'number' ? otif.toFixed(1) : otif}%
                    </text>

                    {/* Forecast OTIF - Prominent, Color-coded */}
                    {forecastOtif !== null && (
                      <text
                        x={node.x + nodeWidth + 16}
                        y={node.y + 18}
                        textAnchor="start"
                        style={{
                          fontSize: '0.875rem',
                          fill: getOTIFColor(forecastOtif),
                          fontWeight: 700,
                          pointerEvents: 'none'
                        }}
                      >
                        Forecast: {forecastOtif.toFixed(1)}%
                      </text>
                    )}

                    {/* TAT */}
                    <text
                      x={node.x + nodeWidth + 16}
                      y={node.y + (forecastOtif !== null ? 32 : 18)}
                      textAnchor="start"
                      style={{
                        fontSize: '0.7rem',
                        fill: '#64748b',
                        pointerEvents: 'none'
                      }}
                    >
                      TAT: {typeof tat === 'number' ? tat.toFixed(1) : tat}h
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip */}
            {tooltip.visible && tooltip.content && (
              <div style={{
                position: 'absolute',
                left: tooltip.x + 15,
                top: tooltip.y - 10,
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                pointerEvents: 'none',
                zIndex: 1000,
                minWidth: '240px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                  Flow Details
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.25rem' }}>
                  {tooltip.content.source}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                  → {tooltip.content.target}
                </div>

                {/* Forecast Data - Prominent */}
                {tooltip.content.forecastQty > 0 && (
                  <div style={{
                    background: 'rgba(37, 99, 235, 0.15)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    marginBottom: '0.75rem',
                    border: '1px solid rgba(37, 99, 235, 0.3)'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                      FORECAST
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.25rem' }}>
                      {tooltip.content.forecastQty.toLocaleString()} units
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {tooltip.content.forecastSharePct}% share • {tooltip.content.forecastCount} items
                    </div>
                  </div>
                )}

                {/* Current Data */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  borderTop: '1px solid rgba(148, 163, 184, 0.3)',
                  paddingTop: '0.5rem'
                }}>
                  <div>
                    <div style={{ color: '#94a3b8' }}>Speed</div>
                    <div style={{
                      color: speedColors[tooltip.content.speed],
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {tooltip.content.speed}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8' }}>Current</div>
                    <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{tooltip.content.value}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8' }}>OTIF</div>
                    <div style={{ color: getOTIFColor(tooltip.content.otif), fontWeight: 600 }}>{tooltip.content.otif}%</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8' }}>TAT</div>
                    <div style={{ color: '#60a5fa', fontWeight: 600 }}>{tooltip.content.tat}h</div>
                  </div>
                </div>
              </div>
            )}
          </div >

          {/* Bottom Stats Cards */}
          < div className="grid grid-cols-3 gap-4 mt-6" >
            {
              [
                {
                  label: 'Current Pending Supply',
                  value: apiData?.metrics?.currentPendingSupply?.toLocaleString() || '0',
                  color: '#f59e0b'
                },
                {
                  label: 'Forecast Next Hour',
                  value: apiData?.metrics?.forecastNextHour?.toLocaleString() || '0',
                  color: '#10b981'
                },
                {
                  label: 'Today Demand',
                  value: apiData?.metrics?.todayDemand?.toLocaleString() || '0',
                  color: '#3b82f6'
                }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-4 border-l-4" style={{ borderLeftColor: stat.color }}>
                  <div className="text-sm text-gray-600 mb-1 font-medium">
                    {stat.label}
                  </div>
                  <div className="text-3xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))
            }
          </div >
        </div >
      )}
    </>
  );
};

export default HospitalSankeyDiagram;
