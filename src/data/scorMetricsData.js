// SCOR Framework Metrics Data
// Six key metrics that drive Performance Index and OTIF

export const scorMetricsData = {
    plan: {
        stage: 'Plan',
        name: 'Forecast Quality (WAPE)',
        description: 'How accurate were we about demand so we planned capacity/inventory correctly?',
        currentValue: 12.5,
        unit: '%',
        target: 10,
        status: 'warning', // 'good', 'warning', 'critical'
        formula: 'WAPE = (Σ |Aₜ − Fₜ| / Σ Aₜ) × 100',
        formulaExplanation: 'Where A = actual demand, F = forecast',
        impact: 'high',
        connections: [
            'Stockouts / lost sales (under-forecasting)',
            'Overstock / working capital (over-forecasting)',
            'Schedule instability and expediting cost',
            'Capacity utilization and backlog'
        ],
        goalSetting: 'Reduce WAPE by 10–25% within 1–2 quarters',
        typicalTargets: {
            stable: '8-10%',
            volatile: '15-20%'
        }
    },

    source: {
        stage: 'Source',
        name: 'Inbound Supplier OTIF',
        description: 'Input reliability - Poor inbound reliability causes downstream firefighting',
        currentValue: 96.8,
        unit: '%',
        target: 98,
        status: 'warning',
        formula: 'Inbound OTIF = (# POs received On-Time AND In-Full / Total POs) × 100',
        formulaExplanation: 'Measures supplier delivery performance',
        impact: 'high',
        connections: [
            'Production or service interruptions',
            'Expedite freight and premium procurement cost',
            'Input quality issues (often paired with defect rate)',
            'Downstream delivery OTIF'
        ],
        goalSetting: 'Tier suppliers by criticality',
        typicalTargets: {
            critical: '98-99%',
            nonCritical: '95-98%'
        }
    },

    make: {
        stage: 'Make',
        name: 'First Pass Yield (FPY)',
        description: 'Usable output without rework - One of the biggest efficiency multipliers',
        currentValue: 94.2,
        unit: '%',
        target: 96,
        status: 'warning',
        formula: 'FPY = (Units/jobs accepted with no rework / Units/jobs started) × 100',
        formulaExplanation: 'First-Time-Right rate',
        impact: 'high',
        connections: [
            'Cost of poor quality (scrap, rework hours)',
            'Cycle time and throughput',
            'Warranty claims and returns',
            'Employee productivity and SLA stability'
        ],
        goalSetting: 'Track overall and by line/team/product',
        typicalTargets: {
            improvement: '+2 to +10 points per quarter'
        }
    },

    deliver: {
        stage: 'Deliver',
        name: 'Customer OTIF',
        description: 'Customer truth - Did they get what was promised, when promised?',
        currentValue: 97.5,
        unit: '%',
        target: 99,
        status: 'warning',
        formula: 'Customer OTIF = (Orders delivered On-Time AND In-Full / Total customer orders) × 100',
        formulaExplanation: 'Perfect delivery rate',
        impact: 'critical',
        connections: [
            'Revenue realization (billing, renewals)',
            'Penalties, make-goods, SLA credits',
            'NPS and customer satisfaction',
            'Repeat purchase and churn'
        ],
        goalSetting: 'Segment by SLA tier',
        typicalTargets: {
            premium: '≥99%',
            standard: '95-98%'
        }
    },

    return: {
        stage: 'Return',
        name: 'Return Resolution Lead Time',
        description: 'How fast the loop is closed (refund, replace, resell, dispose)',
        currentValue: 3.5,
        unit: 'days',
        target: 2,
        status: 'critical',
        formula: 'RLT = Median(Return Closed Date − Return Initiated Date)',
        formulaExplanation: 'Median resolution time in days',
        impact: 'medium',
        connections: [
            'Customer trust and repurchase likelihood',
            'Cash cycle speed and recovered value',
            'Reverse logistics cost',
            'Root-cause feedback into Source and Make'
        ],
        goalSetting: 'Set SLAs by return type',
        typicalTargets: {
            reduction: 'Reduce median RLT by 20–40%',
            tracking: 'Track P90 to identify stuck returns'
        }
    },

    enable: {
        stage: 'Enable',
        name: 'Exception-to-Recovery Time',
        description: "Organization's nervous system - How fast exceptions are detected and resolved",
        currentValue: 4.2,
        unit: 'hours',
        target: 2,
        status: 'critical',
        formula: 'E2R = Median(Recovery Time − Exception Detected Time)',
        formulaExplanation: 'Recovery = process restored to "in control"',
        impact: 'high',
        connections: [
            'OTIF protection',
            'Downtime and productivity loss',
            'Operational cost (manual chasing, escalations)',
            'Reporting and governance reliability'
        ],
        goalSetting: 'Define severity tiers (P1 / P2 / P3)',
        typicalTargets: {
            improvement: 'Reduce E2R by 30–50% in 90–120 days with automation'
        }
    }
};

// Helper function to get status color
export const getMetricStatusColor = (status) => {
    switch (status) {
        case 'good':
            return {
                bg: 'bg-green-50',
                border: 'border-green-300',
                text: 'text-green-700',
                badge: 'bg-green-100 text-green-700'
            };
        case 'warning':
            return {
                bg: 'bg-yellow-50',
                border: 'border-yellow-300',
                text: 'text-yellow-700',
                badge: 'bg-yellow-100 text-yellow-700'
            };
        case 'critical':
            return {
                bg: 'bg-red-50',
                border: 'border-red-300',
                text: 'text-red-700',
                badge: 'bg-red-100 text-red-700'
            };
        default:
            return {
                bg: 'bg-gray-50',
                border: 'border-gray-300',
                text: 'text-gray-700',
                badge: 'bg-gray-100 text-gray-700'
            };
    }
};

// Helper function to get impact color
export const getImpactColor = (impact) => {
    switch (impact) {
        case 'critical':
            return 'text-red-600';
        case 'high':
            return 'text-orange-600';
        case 'medium':
            return 'text-yellow-600';
        case 'low':
            return 'text-blue-600';
        default:
            return 'text-gray-600';
    }
};

export default scorMetricsData;
