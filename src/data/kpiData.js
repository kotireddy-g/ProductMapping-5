// KPI Dashboard Data for Hospital Pharmacy
// 6 Critical Performance Indicators with detailed formulas and logic

export const kpiData = {
    otif: {
        title: 'Internal OTIF',
        subtitle: 'On-Time, In-Full Delivery',
        current: 92.5,
        target: 95,
        unit: '%',
        change: +2.3,
        status: 'warning', // 'healthy' (≥95%), 'warning' (90-95%), 'risk' (<90%)
        trend: [89, 90, 91, 89, 92, 93, 92, 92.5],
        formula: '((Orders Delivered On Time AND In Full) ÷ Total Internal Orders) × 100',
        whyItMatters: 'Delayed surgeries, missed ICU doses, and patient safety depend on this metric',
        impactAreas: ['Delayed surgeries', 'Missed ICU doses', 'Slow medication rounds', 'Nurse frustration', 'Patient safety risk'],
        trendData: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            values: [89, 90, 91, 89, 92, 93, 92, 92.5],
            zones: {
                healthy: 95,  // Green band ≥95%
                warning: 90,  // Yellow band 90-95%
                risk: 0       // Red band <90%
            },
            biggestImpact: 'ICU demand spike in Week 4'
        }
    },

    stockHealth: {
        title: 'Stock Position Health',
        subtitle: 'Inventory Balance Score',
        current: 87.5,
        target: 90,
        unit: '%',
        change: -1.2,
        status: 'warning',
        trend: [88, 89, 87, 88, 87, 88, 87, 87.5],
        understock: 8.5,
        overstock: 4.0,
        formula: '1 - ((Understock SKUs + Overstock SKUs) ÷ Total Active SKUs)',
        whyItMatters: 'Balance between clinical risk (understock) and financial loss (overstock)',
        logic: 'Too little stock → OTIF fails, clinical risk. Too much stock → waste and financial loss.',
        trendData: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            understock: [9.2, 8.8, 9.5, 8.9, 9.1, 8.7, 8.6, 8.5],
            overstock: [4.5, 4.3, 4.8, 4.2, 4.1, 4.0, 4.1, 4.0],
            healthScore: [88, 89, 87, 88, 87, 88, 87, 87.5]
        }
    },

    expiryRisk: {
        title: 'Expiry Risk Value',
        subtitle: 'Near-Expiry Inventory',
        current: 2.45,
        target: 1.5,
        unit: 'RM',
        change: -0.35,
        status: 'warning',
        trend: [2.8, 2.7, 2.9, 2.6, 2.5, 2.6, 2.5, 2.45],
        breakdown: {
            '30days': 0.85,
            '60days': 0.95,
            '90days': 0.65
        },
        formula: 'Σ (Stock Quantity × Unit Cost) for all batches expiring within X days',
        whyItMatters: 'Direct impact on hospital profit margin and audit compliance',
        impactAreas: ['Hospital cost', 'Net profit margin', 'Audit & compliance', 'Pharmacy reputation'],
        preventionActions: ['Redistribute stock', 'Reduce orders', 'Promote FEFO issuance', 'Reallocate to high-consumption depts'],
        trendData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            '30days': [1.0, 0.95, 1.1, 0.9, 0.88, 0.92, 0.87, 0.85],
            '60days': [1.1, 1.05, 1.15, 1.0, 0.98, 1.02, 0.97, 0.95],
            '90days': [0.8, 0.75, 0.85, 0.7, 0.68, 0.72, 0.67, 0.65]
        }
    },

    forecastAccuracy: {
        title: 'Forecast Accuracy',
        subtitle: 'Demand Prediction',
        current: 89.2,
        target: 92,
        unit: '%',
        change: +3.5,
        status: 'healthy',
        trend: [85, 86, 87, 88, 87, 88, 89, 89.2],
        mape: 10.8,
        formula: 'Forecast Accuracy (%) = 100 - MAPE, where MAPE = (Σ |Forecast - Actual| ÷ Actual) ÷ n × 100',
        whyItMatters: 'Determines optimal ordering, replenishment timing, and inventory levels',
        impactAreas: ['How much to order', 'When to replenish', 'Stock buffer to maintain'],
        lowAccuracyRisk: ['Overstock (cash loss)', 'Understock (OTIF failure)'],
        highAccuracyBenefit: ['Efficient supply', 'Lower inventory', 'Higher OTIF'],
        trendData: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            forecast: [1200, 1250, 1180, 1300, 1220, 1280, 1240, 1260],
            actual: [1150, 1280, 1200, 1280, 1200, 1260, 1220, 1250],
            accuracy: [85, 86, 87, 88, 87, 88, 89, 89.2]
        }
    },

    fulfillmentTime: {
        title: 'Fulfillment Lead Time',
        subtitle: 'Internal Medicine Delivery',
        current: 2.3,
        target: 2.0,
        unit: 'hours',
        change: -0.4,
        status: 'warning',
        trend: [2.7, 2.6, 2.5, 2.4, 2.5, 2.4, 2.3, 2.3],
        byDepartment: {
            ICU: 1.8,
            ER: 1.5,
            OT: 2.1,
            Wards: 3.2,
            Oncology: 2.5
        },
        formula: 'Avg Fulfillment Time = Σ (Delivery Time - Request Time) ÷ Total Internal Orders',
        whyItMatters: 'Impacts medication rounds, OT schedules, ER treatment speed, and patient safety',
        impactAreas: ['Delayed medication rounds', 'OT delays', 'ER treatment delays', 'ICU critical lapses', 'Nurse workload increase'],
        bottlenecks: ['Central pharmacy', 'Satellite pharmacy', 'Porters', 'Stock availability'],
        trendData: {
            labels: ['ICU', 'ER', 'OT', 'Wards', 'Oncology'],
            values: [1.8, 1.5, 2.1, 3.2, 2.5],
            sla: 2.0
        }
    },

    revenueProtection: {
        title: 'Revenue Protection',
        subtitle: 'Prevented Revenue Loss',
        current: 3.2,
        ytd: 28.5,
        unit: 'RM',
        change: +0.8,
        status: 'healthy',
        trend: [2.5, 2.7, 2.9, 3.0, 2.8, 3.1, 3.0, 3.2],
        casesSaved: 145,
        breakdown: {
            OT: 1.2,
            Chemo: 1.5,
            OPD: 0.3,
            ER: 0.2
        },
        formula: 'Revenue Protection = Σ (Cases Avoided Cancellation × Avg Revenue per Case)',
        whyItMatters: 'Direct financial impact—prevents revenue loss from stockouts and service disruptions',
        stockoutCauses: ['OT case cancellations', 'Chemo session delays', 'OPD prescriptions lost', 'ER diversions', 'Unbillable care delays'],
        achievements: {
            yearlyProtection: 'RM 28.5M protected this year through improved supply availability',
            otCancellationReduction: '62%',
            chemoSessionsSaved: 145
        },
        trendData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            monthly: [2.5, 2.7, 2.9, 3.0, 2.8, 3.1, 3.0, 3.2],
            cumulative: [2.5, 5.2, 8.1, 11.1, 13.9, 17.0, 20.0, 23.2]
        }
    }
};

// Helper function to get status color
export const getStatusColor = (status) => {
    switch (status) {
        case 'healthy':
            return {
                bg: 'bg-green-50',
                border: 'border-green-200',
                text: 'text-green-700',
                badge: 'bg-green-100 text-green-700'
            };
        case 'warning':
            return {
                bg: 'bg-yellow-50',
                border: 'border-yellow-200',
                text: 'text-yellow-700',
                badge: 'bg-yellow-100 text-yellow-700'
            };
        case 'risk':
            return {
                bg: 'bg-red-50',
                border: 'border-red-200',
                text: 'text-red-700',
                badge: 'bg-red-100 text-red-700'
            };
        default:
            return {
                bg: 'bg-gray-50',
                border: 'border-gray-200',
                text: 'text-gray-700',
                badge: 'bg-gray-100 text-gray-700'
            };
    }
};
