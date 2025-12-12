// Interactive Hospital Supply & Demand Flow Data
// 3-level hierarchical structure for drill-down visualization

export const hospitalSupply = {
    level1: [
        { id: 'emergency_critical', name: 'Emergency & Critical Care', color: '#ef4444', inStock: 2450 },
        { id: 'operating_theatres', name: 'Operating Theatres & Procedure Suites', color: '#8b5cf6', inStock: 1850 },
        { id: 'inpatient_wards', name: 'Inpatient Wards & Units', color: '#3b82f6', inStock: 3200 },
        { id: 'outpatient_ambulatory', name: 'Outpatient & Ambulatory', color: '#10b981', inStock: 2100 },
        { id: 'diagnostic_interventional', name: 'Diagnostic & Interventional', color: '#f59e0b', inStock: 1450 },
        { id: 'special_therapies', name: 'Special Therapies & Programs', color: '#ec4899', inStock: 980 },
        { id: 'pharmacy_network', name: 'Pharmacy Network', color: '#06b6d4', inStock: 4500 },
        { id: 'support_areas', name: 'Support Areas', color: '#84cc16', inStock: 650 }
    ],
    level2: {
        emergency_critical: [
            { id: 'emergency_casualty', name: 'Emergency / Casualty', inStock: 850 },
            { id: 'icu_units', name: 'Intensive Care Units (ICUs)', inStock: 1200 },
            { id: 'paediatric_neonatal', name: 'Paediatric & Neonatal Critical', inStock: 400 }
        ],
        operating_theatres: [
            { id: 'main_ots', name: 'Main OTs', inStock: 950 },
            { id: 'day_surgery', name: 'Day Surgery / Minor OT', inStock: 550 },
            { id: 'cath_lab', name: 'Cath Lab / Interventional', inStock: 350 }
        ],
        inpatient_wards: [
            { id: 'general_medical_surgical', name: 'General Medical & Surgical', inStock: 1200 },
            { id: 'specialty_wards', name: 'Specialty Wards', inStock: 950 },
            { id: 'maternity_obstetrics', name: 'Maternity & Obstetrics', inStock: 600 },
            { id: 'paediatric_wards', name: 'Paediatric Wards', inStock: 450 }
        ],
        outpatient_ambulatory: [
            { id: 'opd', name: 'OPD', inStock: 850 },
            { id: 'retail_pharmacy', name: 'Retail Pharmacy', inStock: 750 },
            { id: 'specialty_clinics', name: 'Specialty Clinics', inStock: 350 },
            { id: 'daycare_infusion', name: 'Day-care / Infusion', inStock: 150 }
        ],
        diagnostic_interventional: [
            { id: 'radiology', name: 'Radiology', inStock: 550 },
            { id: 'endoscopy_gi', name: 'Endoscopy / GI Labs', inStock: 450 },
            { id: 'dialysis', name: 'Dialysis', inStock: 450 }
        ],
        special_therapies: [
            { id: 'oncology', name: 'Oncology', inStock: 450 },
            { id: 'transplant_programs', name: 'Transplant Programs', inStock: 330 },
            { id: 'infectious_disease', name: 'Infectious Disease Programs', inStock: 200 }
        ],
        pharmacy_network: [
            { id: 'ward_pharmacies', name: 'Ward Pharmacies', inStock: 1800 },
            { id: 'central_pharmacy', name: 'Central Pharmacy', inStock: 2200 },
            { id: 'opd_pharmacy', name: 'OPD Pharmacy', inStock: 500 }
        ],
        support_areas: [
            { id: 'employee_clinic', name: 'Employee Clinic', inStock: 250 },
            { id: 'ambulance', name: 'Ambulance', inStock: 200 },
            { id: 'training_research', name: 'Training / Research', inStock: 200 }
        ]
    },
    level3: {
        emergency_casualty: [{ id: 'ae_casualty_trauma', name: 'A&E / Casualty / Trauma', inStock: 850 }],
        icu_units: [
            { id: 'medical_icu', name: 'Medical ICU', inStock: 300 },
            { id: 'surgical_icu', name: 'Surgical ICU', inStock: 280 },
            { id: 'neuro_icu', name: 'Neuro ICU', inStock: 220 },
            { id: 'cardiac_icu', name: 'Cardiac ICU', inStock: 250 },
            { id: 'hdu', name: 'HDU', inStock: 150 }
        ],
        paediatric_neonatal: [
            { id: 'picu', name: 'PICU', inStock: 200 },
            { id: 'nicu', name: 'NICU', inStock: 200 }
        ],
        main_ots: [
            { id: 'general_ot', name: 'General OT', inStock: 300 },
            { id: 'ortho_ot', name: 'Ortho OT', inStock: 250 },
            { id: 'neuro_ot', name: 'Neuro OT', inStock: 200 },
            { id: 'cardiac_ot', name: 'Cardiac OT', inStock: 200 }
        ],
        day_surgery: [
            { id: 'daycare_ot', name: 'Day-care OT', inStock: 350 },
            { id: 'endoscopy_suite', name: 'Endoscopy Suite', inStock: 200 }
        ],
        cath_lab: [{ id: 'cath_lab_unit', name: 'Cath Lab', inStock: 350 }],
        general_medical_surgical: [
            { id: 'adult_medical_ward', name: 'Adult Medical Ward', inStock: 650 },
            { id: 'surgical_ward', name: 'Surgical Ward', inStock: 550 }
        ],
        specialty_wards: [
            { id: 'cardiology_ward', name: 'Cardiology Ward', inStock: 350 },
            { id: 'neurology_ward', name: 'Neurology Ward', inStock: 300 },
            { id: 'trauma_ward', name: 'Trauma Ward', inStock: 300 }
        ],
        maternity_obstetrics: [
            { id: 'labour_ward', name: 'Labour Ward', inStock: 350 },
            { id: 'postnatal_ward', name: 'Post-natal Ward', inStock: 250 }
        ],
        paediatric_wards: [{ id: 'paediatric_ward', name: 'Paediatric Ward', inStock: 450 }],
        opd: [
            { id: 'general_opd', name: 'General OPD', inStock: 450 },
            { id: 'specialty_opd', name: 'Specialty OPD', inStock: 400 }
        ],
        retail_pharmacy: [{ id: 'opd_pharmacy_retail', name: 'OPD Pharmacy', inStock: 750 }],
        specialty_clinics: [
            { id: 'hiv_clinic', name: 'HIV Clinic', inStock: 180 },
            { id: 'tb_clinic', name: 'TB Clinic', inStock: 170 }
        ],
        daycare_infusion: [
            { id: 'chemo_daycare', name: 'Chemo Day-care', inStock: 80 },
            { id: 'dialysis_daycare', name: 'Dialysis Day-care', inStock: 70 }
        ],
        radiology: [{ id: 'ct_mri_usg', name: 'CT/MRI/USG Units', inStock: 550 }],
        endoscopy_gi: [{ id: 'endoscopy_unit', name: 'Endoscopy Unit', inStock: 450 }],
        dialysis: [{ id: 'hemodialysis_unit', name: 'Hemodialysis Unit', inStock: 450 }],
        oncology: [
            { id: 'oncology_ward', name: 'Oncology Ward', inStock: 250 },
            { id: 'chemo_daycare_oncology', name: 'Chemo Day-care', inStock: 200 }
        ],
        transplant_programs: [{ id: 'transplant_unit', name: 'Transplant Unit', inStock: 330 }],
        infectious_disease: [{ id: 'dots_centre', name: 'DOTS Centre', inStock: 200 }],
        ward_pharmacies: [{ id: 'satellite_pharmacy', name: 'Satellite Pharmacy', inStock: 1800 }],
        central_pharmacy: [{ id: 'main_store', name: 'Main Store', inStock: 2200 }],
        opd_pharmacy: [{ id: 'retail_pharmacy_opd', name: 'Retail Pharmacy', inStock: 500 }],
        employee_clinic: [{ id: 'staff_clinic', name: 'Staff Clinic', inStock: 250 }],
        ambulance: [{ id: 'ambulance_fleet', name: 'Ambulance Fleet', inStock: 200 }],
        training_research: [{ id: 'simulation_lab', name: 'Simulation Lab', inStock: 200 }]
    }
};

export const hospitalDemand = {
    level1: [
        { id: 'class_1_critical_controlled', name: 'Class 1 – Critical Controlled Medicines', otif: 92.5, tat: 3.2 },
        { id: 'class_2_standard_prescription', name: 'Class 2 – Standard Prescription Medicines', otif: 88.3, tat: 4.5 },
        { id: 'class_3_restricted_complementary', name: 'Class 3 – Restricted / Complementary', otif: 85.7, tat: 5.1 },
        { id: 'class_4_pharmacy_otc', name: 'Class 4 – Pharmacy-only / OTC Medicines', otif: 94.2, tat: 2.8 },
        { id: 'class_5_lab_technical', name: 'Class 5 – Lab / Technical', otif: 90.1, tat: 3.9 }
    ],

    level2: {
        class_1_critical_controlled: [
            { id: 'analgesics_anaesthetics_c1', name: 'Analgesics & Anaesthetics', otif: 93.5, tat: 2.8 },
            { id: 'anti_infectives_c1', name: 'Anti-infectives', otif: 91.2, tat: 3.5 },
            { id: 'blood_products', name: 'Blood & Blood Products', otif: 95.0, tat: 2.0 },
            { id: 'cns_psychiatric_c1', name: 'CNS & Psychiatric', otif: 90.8, tat: 3.8 },
            { id: 'cardiovascular_c1', name: 'Cardiovascular', otif: 92.0, tat: 3.2 },
            { id: 'emergency_resuscitation_c1', name: 'Emergency & Resuscitation', otif: 94.5, tat: 2.5 },
            { id: 'endocrine_metabolic_c1', name: 'Endocrine & Metabolic', otif: 91.5, tat: 3.4 },
            { id: 'obstetrics_gynaecology_c1', name: 'Obstetrics & Gynaecology', otif: 93.0, tat: 3.0 },
            { id: 'oncology_immunology', name: 'Oncology & Immunology', otif: 89.5, tat: 4.2 },
            { id: 'renal_electrolytes_iv_fluids_c1', name: 'Renal, Electrolytes & IV Fluids', otif: 92.8, tat: 3.1 }
        ],

        class_2_standard_prescription: [
            { id: 'analgesics_anaesthetics_c2', name: 'Analgesics & Anaesthetics', otif: 88.5, tat: 4.5 },
            { id: 'anti_infectives_c2', name: 'Anti-infectives', otif: 87.2, tat: 4.8 },
            { id: 'cns_psychiatric_c2', name: 'CNS & Psychiatric', otif: 86.8, tat: 5.0 },
            { id: 'cardiovascular_c2', name: 'Cardiovascular', otif: 89.0, tat: 4.2 },
            { id: 'dermatologicals', name: 'Dermatologicals', otif: 90.5, tat: 3.8 },
            { id: 'emergency_resuscitation_c2', name: 'Emergency & Resuscitation', otif: 91.0, tat: 3.5 },
            { id: 'endocrine_metabolic_c2', name: 'Endocrine & Metabolic', otif: 88.0, tat: 4.6 },
            { id: 'gastrointestinal_c2', name: 'Gastrointestinal', otif: 89.5, tat: 4.0 },
            { id: 'nutrition_c2', name: 'Nutrition', otif: 87.5, tat: 4.9 },
            { id: 'obstetrics_gynaecology_c2', name: 'Obstetrics & Gynaecology', otif: 88.8, tat: 4.4 },
            { id: 'ophthalmic_otic', name: 'Ophthalmic & Otic', otif: 90.0, tat: 3.9 },
            { id: 'renal_electrolytes_iv_fluids_c2', name: 'Renal, Electrolytes & IV Fluids', otif: 89.2, tat: 4.3 },
            { id: 'respiratory', name: 'Respiratory', otif: 88.0, tat: 4.7 },
            { id: 'vaccines_immunologicals', name: 'Vaccines & Immunologicals', otif: 91.5, tat: 3.6 }
        ],

        class_3_restricted_complementary: [
            { id: 'complementary_medicines', name: 'Complementary Medicines', otif: 85.0, tat: 5.5 },
            { id: 'restricted_use', name: 'Restricted Use Medicines', otif: 86.5, tat: 4.8 }
        ],

        class_4_pharmacy_otc: [
            { id: 'nutrition_c4', name: 'Nutrition', otif: 94.5, tat: 2.7 },
            { id: 'otc_medicines', name: 'OTC Medicines', otif: 93.8, tat: 2.9 }
        ],

        class_5_lab_technical: [
            { id: 'lab_reagents', name: 'Lab Reagents', otif: 90.5, tat: 3.8 },
            { id: 'diagnostic_kits', name: 'Diagnostic Kits', otif: 89.8, tat: 4.0 }
        ]
    },

    level3: {
        analgesics_anaesthetics_c1: [
            { id: 'general_anaesthetics', name: 'General anaesthetics', otif: 94.0, tat: 2.5 },
            { id: 'neuromuscular_blockers', name: 'Neuromuscular blockers', otif: 93.5, tat: 2.8 },
            { id: 'opioid_analgesics', name: 'Opioid analgesics', otif: 93.0, tat: 3.0 }
        ],

        anti_infectives_c1: [
            { id: 'antifungals', name: 'Antifungals', otif: 91.5, tat: 3.4 },
            { id: 'carbapenems', name: 'Carbapenems', otif: 91.0, tat: 3.6 },
            { id: 'glycopeptides', name: 'Glycopeptides', otif: 91.2, tat: 3.5 },
            { id: 'oxazolidinones', name: 'Oxazolidinones', otif: 91.0, tat: 3.6 }
        ],

        blood_products: [
            { id: 'blood_components', name: 'Blood components', otif: 95.5, tat: 1.8 },
            { id: 'coagulation_factors', name: 'Coagulation factors / haemostatics', otif: 94.5, tat: 2.2 }
        ],

        cns_psychiatric_c1: [
            { id: 'anxiolytics', name: 'Anxiolytics', otif: 91.0, tat: 3.7 },
            { id: 'mood_stabilisers', name: 'Mood Stabilisers', otif: 90.5, tat: 3.9 },
            { id: 'antidepressants', name: 'Antidepressants', otif: 90.8, tat: 3.8 },
            { id: 'antiepileptics', name: 'Antiepileptics', otif: 91.0, tat: 3.7 },
            { id: 'antiparkinsonian', name: 'Antiparkinsonian', otif: 90.5, tat: 3.9 },
            { id: 'antipsychotics', name: 'Antipsychotics', otif: 90.8, tat: 3.8 }
        ]
    }
};

// Velocity color mapping
export const velocityColors = {
    fast: '#10b981',      // Green
    medium: '#f59e0b',    // Orange
    slow: '#eab308',      // Yellow
    occasional: '#9ca3af' // Grey
};

// Bottom metrics data
export const chordMetrics = {
    currentPendingSupply: 1850,
    forecastNextHour: 420,
    todayDemand: 3250
};

// Generate synthetic flow data between supply and demand
export const generateFlowData = (supplyLevel, demandLevel, supplyIds, demandIds) => {
    const flows = [];
    const velocityOptions = ['fast', 'medium', 'slow', 'occasional'];

    supplyIds.forEach(supplyId => {
        // Each supply connects to 1-3 random demand nodes
        const numConnections = Math.floor(Math.random() * 3) + 1;
        const shuffledDemand = [...demandIds].sort(() => 0.5 - Math.random());

        for (let i = 0; i < Math.min(numConnections, shuffledDemand.length); i++) {
            const quantity = Math.floor(Math.random() * 500) + 100;
            const velocity = velocityOptions[Math.floor(Math.random() * velocityOptions.length)];
            const deliveryRate = velocity === 'fast' ? 0.95 : velocity === 'medium' ? 0.85 : velocity === 'slow' ? 0.75 : 0.65;

            flows.push({
                source: supplyId,
                target: shuffledDemand[i],
                quantity,
                velocity,
                ordered: quantity,
                delivered: Math.floor(quantity * deliveryRate),
                timeHours: velocity === 'fast' ? 2.5 : velocity === 'medium' ? 4.5 : velocity === 'slow' ? 6.5 : 8.5
            });
        }
    });

    return flows;
};
