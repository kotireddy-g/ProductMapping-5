// Command Center Data for OTIF Department Drill-Down
// Comprehensive synthetic data for all departments

// Helper function to generate random data within a range
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate OTIF value with variation
const generateOTIF = (baseOTIF, variation = 5) => {
    const value = baseOTIF + randomInRange(-variation, variation);
    return Math.max(70, Math.min(100, value)); // Clamp between 70-100
};

// Generate heatmap data for medicine categories based on time period
const generateHeatmapData = (categories, period) => {
    const heatmapData = [];

    categories.forEach(category => {
        const baseOTIF = category.otif;
        let timeSeries = [];

        switch (period) {
            case 'today':
                timeSeries = [{ period: 'Current', otif: baseOTIF }];
                break;

            case 'next_7_days':
                timeSeries = Array.from({ length: 7 }, (_, i) => ({
                    period: `Day ${i + 1}`,
                    otif: generateOTIF(baseOTIF, 5)
                }));
                break;

            case 'next_14_days':
                timeSeries = Array.from({ length: 14 }, (_, i) => ({
                    period: `Day ${i + 1}`,
                    otif: generateOTIF(baseOTIF, 6)
                }));
                break;

            case 'next_21_days':
                timeSeries = Array.from({ length: 3 }, (_, i) => ({
                    period: `Week ${i + 1}`,
                    otif: generateOTIF(baseOTIF, 4)
                }));
                break;

            case 'next_30_days':
                timeSeries = Array.from({ length: 4 }, (_, i) => ({
                    period: `Week ${i + 1}`,
                    otif: generateOTIF(baseOTIF, 4)
                }));
                break;

            default:
                timeSeries = [{ period: 'Current', otif: baseOTIF }];
        }

        heatmapData.push({
            category: category.name,
            color: category.color,
            timeSeries
        });
    });

    return heatmapData;
};

// Base template for creating department data
const createDepartmentData = (config) => {
    const {
        id,
        name,
        displayName,
        otif,
        onTime,
        inFull
    } = config;

    return {
        id,
        name,
        displayName,

        overview: {
            otif,
            onTime,
            inFull
        },

        demandSupply: {
            otif: otif,
            onTime: onTime,
            inFull: inFull,
            demand: [120, 145, 130, 125, 135, 140],
            supply: [115, 140, 128, 130, 132, 138],
            labels: ['D', 'S', 'D', 'S', 'D', 'S']
        },

        medicineCategories: [
            { name: 'Life-saving', percentage: 40, color: '#ef4444', days: 12, otif: otif - 7, range: '80-90%' },
            { name: 'Fast-moving', percentage: 33, color: '#f59e0b', days: 8, otif: otif - 3, range: '85-95%' },
            { name: 'Critical', percentage: 12, color: '#8b5cf6', days: 5, otif: otif - 10, range: '75-85%' },
            { name: 'Surgical', percentage: 51, color: '#3b82f6', days: 15, otif: otif + 3, range: '88-98%' },
            { name: 'General', percentage: 18, color: '#10b981', days: 20, otif: otif + 5, range: '90-100%' },
            { name: 'Restricted', percentage: 24, color: '#ec4899', days: 6, otif: otif - 12, range: '73-83%' },
            { name: 'New Stock', percentage: 30, color: '#06b6d4', days: 10, otif: otif, range: '80-90%' }
        ],

        rootCauses: [
            {
                id: 1,
                reason: 'STOCKOUTS',
                medicineType: 'Life-saving',
                demand: 150,
                supplied: 120,
                stockStatus: 'Out of Stock',
                time: '2 days delay',
                action: 'Emergency Order',
                tag: 'OLDER Note',
                severity: 'high'
            },
            {
                id: 2,
                reason: 'PROCESS DELAY',
                medicineType: 'Fast-moving',
                demand: 200,
                supplied: 180,
                stockStatus: 'Low Stock',
                time: '1 day delay',
                action: 'Expedite',
                severity: 'medium'
            },
            {
                id: 3,
                reason: 'Restricted',
                medicineType: 'Critical',
                demand: 80,
                supplied: 75,
                stockStatus: 'Restricted',
                time: '3 hours',
                action: 'Approval Required',
                severity: 'medium'
            },
            {
                id: 4,
                reason: 'Expired',
                medicineType: 'General',
                demand: 100,
                supplied: 0,
                stockStatus: 'Expired',
                time: 'N/A',
                action: 'Replace Stock',
                severity: 'high'
            },
            {
                id: 5,
                reason: 'Under stock',
                medicineType: 'Surgical',
                demand: 120,
                supplied: 95,
                stockStatus: 'Below Min',
                time: '12 hours',
                action: 'Reorder',
                severity: 'medium'
            },
            {
                id: 6,
                reason: 'Black sheet',
                medicineType: 'Restricted',
                demand: 50,
                supplied: 40,
                stockStatus: 'Controlled',
                time: '6 hours',
                action: 'Review',
                severity: 'low'
            }
        ],

        medicineTypeImpact: [
            {
                type: 'Life-saving',
                count: 45,
                location: name,
                otif: otif - 7,
                action: 'Increase Safety Stock',
                classification: 'life_saving'
            },
            {
                type: 'Critical',
                count: 32,
                location: name === 'ICU' ? 'NICU' : name,
                otif: otif - 10,
                action: 'Increase Safety Stock',
                classification: 'critical'
            },
            {
                type: 'Fast-moving',
                count: 67,
                location: name,
                otif: otif - 3,
                action: 'Assign',
                classification: 'fast_moving'
            },
            {
                type: 'New Exp',
                count: 12,
                location: name,
                otif: otif,
                action: 'Monitor',
                classification: 'new_expiry'
            },
            {
                type: 'Under stock',
                count: 28,
                location: name,
                otif: otif - 5,
                action: 'Reorder',
                classification: 'under_stock'
            }
        ],

        demandForecast: {
            weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
            medicineTypes: [
                {
                    name: 'Surgical',
                    values: [20, 25, 22, 28, 30, 26],
                    color: '#3b82f6'
                },
                {
                    name: 'Circular',
                    values: [35, 40, 38, 42, 45, 41],
                    color: '#8b5cf6'
                },
                {
                    name: 'Asthma',
                    values: [55, 58, 60, 62, 65, 63],
                    color: '#10b981'
                },
                {
                    name: 'Life Sav',
                    values: [45, 48, 50, 52, 54, 51],
                    color: '#ef4444'
                },
                {
                    name: 'Compound',
                    values: [25, 28, 30, 32, 34, 31],
                    color: '#f59e0b'
                },
                {
                    name: 'Pile',
                    values: [15, 18, 20, 22, 24, 21],
                    color: '#ec4899'
                }
            ]
        },

        riskAnalysis: {
            surgicalRisk: [
                { medicine: 'NORBOROHYLIN', riskLevel: 'High', color: '#ef4444' },
                { medicine: 'Dopamin', riskLevel: 'Medium', color: '#f59e0b' },
                { medicine: 'Panadithru', riskLevel: 'Low', color: '#10b981' },
                { medicine: 'Co-S', riskLevel: 'Medium', color: '#f59e0b' }
            ]
        },

        impactAnalysis: {
            castImpact: {
                revenueImpact: [10, 15, 20],
                costs: {
                    rm: 200000,
                    km: 2077970,
                    negative: true
                }
            },
            medicineDetails: {
                name: 'Paracetamol 500mg',
                form: 'TABLET',
                purpose: 'FOR MBT',
                otif: 79,
                breakdown: {
                    icu: {
                        demand: 450,
                        supply: 420,
                        stocks: 1200,
                        forecast: 480,
                        stockorder: 500
                    },
                    nicu: {
                        cost: 15000,
                        revenue: 18500
                    },
                    iccu: {
                        demand: 200,
                        supply: 195,
                        stocks: 600,
                        forecast: 210,
                        stockorder: 220
                    }
                }
            }
        },

        agentRecommendations: [
            {
                id: 1,
                medicine: 'MEDLIR',
                status: 'Expected',
                stockAvailable: false,
                actionAvailable: true,
                action: 'Emergency Order',
                priority: 'High'
            },
            {
                id: 2,
                medicine: 'NGWL',
                status: 'De-stocked',
                stockAvailable: true,
                actionAvailable: true,
                action: 'Redistribute',
                priority: 'Medium'
            },
            {
                id: 3,
                medicine: 'Paracetamol',
                status: 'Low Stock',
                stockAvailable: true,
                actionAvailable: true,
                action: 'Reorder',
                priority: 'High'
            },
            {
                id: 4,
                medicine: 'Insulin',
                status: 'Critical',
                stockAvailable: false,
                actionAvailable: true,
                action: 'Urgent Order',
                priority: 'High'
            },
            {
                id: 5,
                medicine: 'Morphine',
                status: 'Restricted',
                stockAvailable: true,
                actionAvailable: false,
                action: 'Approval Needed',
                priority: 'Medium'
            },
            {
                id: 6,
                medicine: 'Heparin',
                status: 'Expected',
                stockAvailable: true,
                actionAvailable: true,
                action: 'Monitor',
                priority: 'Low'
            },
            {
                id: 7,
                medicine: 'Warfarin',
                status: 'Low Stock',
                stockAvailable: true,
                actionAvailable: true,
                action: 'Reorder',
                priority: 'Medium'
            },
            {
                id: 8,
                medicine: 'Propofol',
                status: 'Critical',
                stockAvailable: false,
                actionAvailable: true,
                action: 'Emergency Order',
                priority: 'High'
            },
            {
                id: 9,
                medicine: 'Midazolam',
                status: 'Expected',
                stockAvailable: true,
                actionAvailable: true,
                action: 'Monitor',
                priority: 'Low'
            },
            {
                id: 10,
                medicine: 'Fentanyl',
                status: 'Restricted',
                stockAvailable: true,
                actionAvailable: false,
                action: 'Approval Needed',
                priority: 'Medium'
            }
        ]
    };
};

// Export department command center data
export const departmentCommandCenterData = {
    icu: createDepartmentData({
        id: 'icu',
        name: 'ICU',
        displayName: 'Intensive Care Unit',
        otif: 95.2,
        onTime: 92,
        inFull: 89
    }),

    nicu: createDepartmentData({
        id: 'nicu',
        name: 'NICU',
        displayName: 'Neonatal Intensive Care Unit',
        otif: 97.4,
        onTime: 95,
        inFull: 93
    }),

    ot: createDepartmentData({
        id: 'ot',
        name: 'OT',
        displayName: 'Operation Theatre',
        otif: 88.5,
        onTime: 85,
        inFull: 87
    }),

    ward: createDepartmentData({
        id: 'ward',
        name: 'Ward',
        displayName: 'General Ward',
        otif: 82.3,
        onTime: 80,
        inFull: 84
    }),

    daycare: createDepartmentData({
        id: 'daycare',
        name: 'Daycare',
        displayName: 'Daycare Center',
        otif: 91.7,
        onTime: 89,
        inFull: 91
    }),

    er: createDepartmentData({
        id: 'er',
        name: 'ER',
        displayName: 'Emergency Room',
        otif: 78.9,
        onTime: 75,
        inFull: 80
    }),

    opd: createDepartmentData({
        id: 'opd',
        name: 'OPD',
        displayName: 'Out Patient Department',
        otif: 96.8,
        onTime: 94,
        inFull: 95
    }),

    pharmacy: createDepartmentData({
        id: 'pharmacy',
        name: 'Pharmacy',
        displayName: 'Central Pharmacy',
        otif: 94.5,
        onTime: 92,
        inFull: 93
    }),

    lab: createDepartmentData({
        id: 'lab',
        name: 'Lab',
        displayName: 'Laboratory',
        otif: 87.2,
        onTime: 84,
        inFull: 88
    }),

    dialysis: createDepartmentData({
        id: 'dialysis',
        name: 'Dialysis',
        displayName: 'Dialysis Unit',
        otif: 93.1,
        onTime: 91,
        inFull: 92
    }),

    oncology: createDepartmentData({
        id: 'oncology',
        name: 'Oncology',
        displayName: 'Oncology Department',
        otif: 89.6,
        onTime: 87,
        inFull: 90
    }),

    radiology: createDepartmentData({
        id: 'radiology',
        name: 'Radiology',
        displayName: 'Radiology Department',
        otif: 81.4,
        onTime: 78,
        inFull: 83
    })
};

// Helper function to get department data by ID
export const getDepartmentData = (departmentId) => {
    return departmentCommandCenterData[departmentId] || null;
};

// Helper function to get OTIF color class
export const getOTIFColorClass = (otif) => {
    if (otif >= 95) {
        return {
            bg: 'bg-green-50',
            text: 'text-green-700',
            border: 'border-green-300',
            badge: 'bg-green-600 text-white'
        };
    } else if (otif >= 85) {
        return {
            bg: 'bg-yellow-50',
            text: 'text-yellow-700',
            border: 'border-yellow-300',
            badge: 'bg-yellow-600 text-white'
        };
    } else {
        return {
            bg: 'bg-red-50',
            text: 'text-red-700',
            border: 'border-red-300',
            badge: 'bg-red-600 text-white'
        };
    }
};

// Time period options
export const timePeriods = [
    { id: 'today', label: 'Today', value: 'today' },
    { id: 'next_7_days', label: 'Next 7 Days', value: 'next_7_days' },
    { id: 'next_14_days', label: 'Next 14 Days', value: 'next_14_days' },
    { id: 'next_21_days', label: 'Next 21 Days', value: 'next_21_days' },
    { id: 'next_30_days', label: 'Next 30 Days', value: 'next_30_days' }
];

// Export heatmap data generator
export { generateHeatmapData };
