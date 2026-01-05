// Synthetic data for KPI Detail Screen
// This will be replaced with API calls later

export const kpiDetailData = {
    otif: {
        id: 'otif',
        name: 'Internal OTIF',
        title: 'Internal OTIF',
        subtitle: 'On-Time, In-Full Delivery',
        description: 'On-Time, In-Full Delivery',
        current: 92.5,
        currentValue: 92.5,
        unit: '%',
        trend: '+2.3%',
        trendValue: 2.3,
        change: 2.3,
        status: 'warning',
        target: 95,
        gap: 2.5,
        formula: '((Orders Delivered On Time AND In Full) ÷ Total Internal Orders) × 100',
        trendData: {
            history: [
                { date: '2025-12-29', value: 89 },
                { date: '2025-12-30', value: 90 },
                { date: '2025-12-31', value: 91 },
                { date: '2026-01-01', value: 89 },
                { date: '2026-01-02', value: 92 },
                { date: '2026-01-03', value: 93 },
                { date: '2026-01-04', value: 92 },
                { date: '2026-01-05', value: 92.5 }
            ],
            forecast: {
                model: 'holt',
                dates: [
                    '2026-01-03',
                    '2026-01-04',
                    '2026-01-05',
                    '2026-01-06',
                    '2026-01-07',
                    '2026-01-08',
                    '2026-01-09',
                    '2026-01-10',
                    '2026-01-11',
                    '2026-01-12'
                ],
                values: [93, 92, 92.5, 92.8, 93.2, 93.5, 93.8, 94.1, 94.4, 94.7],
                overlapPoints: 3,
                futurePoints: 7,
                confidencePct: 85
            }
        },
        rootCauses: [
            {
                category: 'Demand',
                causes: [
                    {
                        id: 1,
                        name: 'Forecast Inaccuracy',
                        severity: 'high',
                        impact: 35,
                        description: 'WAPE >15% for critical SKUs causing demand misalignment'
                    },
                    {
                        id: 2,
                        name: 'Sudden Demand Spikes',
                        severity: 'medium',
                        impact: 20,
                        description: 'Unexpected increases in specific departments'
                    }
                ]
            },
            {
                category: 'Supply',
                causes: [
                    {
                        id: 3,
                        name: 'Supplier Delays',
                        severity: 'high',
                        impact: 30,
                        description: 'Inbound OTIF at 89% vs target 98%'
                    },
                    {
                        id: 4,
                        name: 'Lead Time Variability',
                        severity: 'medium',
                        impact: 15,
                        description: 'High variance in supplier delivery times'
                    }
                ]
            },
            {
                category: 'Products',
                causes: [
                    {
                        id: 5,
                        name: 'SKU Complexity',
                        severity: 'low',
                        impact: 10,
                        description: 'High number of low-volume SKUs'
                    }
                ]
            }
        ],
        recommendations: [
            {
                id: 1,
                priority: 'CRITICAL',
                impact: 'high',
                title: 'Increase Safety Stock for Life-saving Medicines',
                description: 'Prioritize safety stock buffers for ICU/critical-use items in OT to reduce stockout-driven delays.',
                tags: ['Life-saving', 'Critical'],
                improvement: '+5.2% OTIF',
                timeline: '2-3 days',
                cost: 'Medium',
                implemented: false
            },
            {
                id: 2,
                priority: 'HIGH',
                impact: 'medium',
                title: 'Optimize Reorder Points for Fast-moving Items',
                description: 'Recalibrate reorder points using recent consumption and lead times to prevent frequent replenishment gaps.',
                tags: ['Fast-moving'],
                improvement: '+3.1% OTIF',
                timeline: '1-2 days',
                cost: 'Low',
                implemented: false
            },
            {
                id: 3,
                priority: 'MEDIUM',
                impact: 'medium',
                title: 'Review Restricted Medicine Access Controls',
                description: 'Reduce approval bottlenecks by streamlining access control workflows for restricted items while maintaining compliance.',
                tags: ['Restricted'],
                improvement: '+2.8% OTIF',
                timeline: '1 week',
                cost: 'Low',
                implemented: false
            },
            {
                id: 4,
                priority: 'HIGH',
                impact: 'high',
                title: 'Implement FEFO for Expiry Management',
                description: 'Apply First-Expired-First-Out (FEFO) picking and redistribution to minimize expiry-related waste and fulfillment disruptions.',
                tags: ['General', 'Surgical'],
                improvement: '+4.5% OTIF',
                timeline: '3-5 days',
                cost: 'Medium',
                implemented: false
            }
        ]
    },
    stockHealth: {
        id: 'stockHealth',
        name: 'Stock Position Health',
        title: 'Stock Position Health',
        subtitle: 'Inventory Balance Score',
        description: 'Inventory Balance Score',
        current: 87.5,
        currentValue: 87.5,
        unit: '%',
        trend: '-1.2%',
        trendValue: -1.2,
        change: -1.2,
        status: 'warning',
        target: 90,
        gap: 2.5,
        overstock: 4.0,
        formula: '1 - ((Understock SKUs + Overstock SKUs) ÷ Total Active SKUs)',
        trendData: {
            history: [
                { date: '2025-12-29', value: 88 },
                { date: '2025-12-30', value: 89 },
                { date: '2025-12-31', value: 87 },
                { date: '2026-01-01', value: 88 },
                { date: '2026-01-02', value: 87 },
                { date: '2026-01-03', value: 88 },
                { date: '2026-01-04', value: 87 },
                { date: '2026-01-05', value: 87.5 }
            ],
            forecast: {
                model: 'holt',
                dates: [
                    '2026-01-03',
                    '2026-01-04',
                    '2026-01-05',
                    '2026-01-06',
                    '2026-01-07',
                    '2026-01-08',
                    '2026-01-09',
                    '2026-01-10'
                ],
                values: [88, 87, 87.5, 87.8, 88.2, 88.5, 88.8, 89.1],
                overlapPoints: 3,
                futurePoints: 5,
                confidencePct: 82
            }
        },
        rootCauses: [
            {
                category: 'Demand',
                causes: [
                    {
                        id: 1,
                        name: 'Seasonal Variations',
                        severity: 'medium',
                        impact: 25,
                        description: 'Seasonal demand patterns not fully captured in forecasts'
                    }
                ]
            },
            {
                category: 'Supply',
                causes: [
                    {
                        id: 2,
                        name: 'Overstocking',
                        severity: 'high',
                        impact: 40,
                        description: '4.2% overstock causing capital tie-up'
                    },
                    {
                        id: 3,
                        name: 'Slow-moving Items',
                        severity: 'medium',
                        impact: 20,
                        description: 'Accumulation of slow-moving inventory'
                    }
                ]
            },
            {
                category: 'Products',
                causes: [
                    {
                        id: 4,
                        name: 'Product Mix Changes',
                        severity: 'low',
                        impact: 15,
                        description: 'Changes in treatment protocols affecting demand mix'
                    }
                ]
            }
        ],
        recommendations: [
            {
                id: 1,
                priority: 'CRITICAL',
                impact: 'high',
                title: 'Reduce Overstock Through Redistribution',
                description: 'Identify and redistribute excess stock to departments with higher demand to optimize inventory levels.',
                tags: ['Overstock', 'Redistribution'],
                improvement: '+6.5% Health',
                timeline: '1 week',
                cost: 'Low',
                implemented: false
            },
            {
                id: 2,
                priority: 'HIGH',
                impact: 'medium',
                title: 'Implement ABC Analysis',
                description: 'Categorize inventory using ABC analysis to focus on high-value items and optimize stock policies.',
                tags: ['Analytics', 'Optimization'],
                improvement: '+4.2% Health',
                timeline: '2 weeks',
                cost: 'Medium',
                implemented: false
            },
            {
                id: 3,
                priority: 'MEDIUM',
                impact: 'medium',
                title: 'Review Slow-moving Items',
                description: 'Analyze and reduce slow-moving inventory through targeted promotions or returns.',
                tags: ['Slow-moving'],
                improvement: '+3.5% Health',
                timeline: '2-3 weeks',
                cost: 'Low',
                implemented: false
            },
            {
                id: 4,
                priority: 'HIGH',
                impact: 'high',
                title: 'Dynamic Reorder Point Adjustment',
                description: 'Implement dynamic reorder points based on real-time demand patterns and lead times.',
                tags: ['Automation', 'Optimization'],
                improvement: '+5.8% Health',
                timeline: '1-2 weeks',
                cost: 'High',
                implemented: false
            }
        ]
    },
    expiryRisk: {
        id: 'expiryRisk',
        name: 'Expiry Risk Value',
        title: 'Expiry Risk Value',
        subtitle: 'Near-Expiry Inventory',
        description: 'Near-Expiry Inventory',
        current: 2.45,
        currentValue: 2.45,
        unit: 'RM',
        trend: '-0.35RM',
        trendValue: -0.35,
        change: -0.35,
        status: 'warning',
        target: 1.5,
        gap: 0.95,
        formula: 'Σ (Stock Quantity × Unit Cost) for all batches expiring within X days',
        trendData: {
            history: [
                { date: '2025-12-29', value: 2.8 },
                { date: '2025-12-30', value: 2.7 },
                { date: '2025-12-31', value: 2.9 },
                { date: '2026-01-01', value: 2.6 },
                { date: '2026-01-02', value: 2.5 },
                { date: '2026-01-03', value: 2.6 },
                { date: '2026-01-04', value: 2.5 },
                { date: '2026-01-05', value: 2.45 }
            ],
            forecast: {
                model: 'holt',
                dates: [
                    '2026-01-03',
                    '2026-01-04',
                    '2026-01-05',
                    '2026-01-06',
                    '2026-01-07',
                    '2026-01-08',
                    '2026-01-09',
                    '2026-01-10'
                ],
                values: [2.6, 2.5, 2.45, 2.3, 2.2, 2.1, 1.95, 1.8],
                overlapPoints: 3,
                futurePoints: 5,
                confidencePct: 78
            }
        },
        rootCauses: [
            {
                category: 'Demand',
                causes: [
                    {
                        id: 1,
                        name: 'Low Utilization',
                        severity: 'high',
                        impact: 45,
                        description: 'Certain medicines not being consumed as forecasted'
                    }
                ]
            },
            {
                category: 'Supply',
                causes: [
                    {
                        id: 2,
                        name: 'Bulk Ordering',
                        severity: 'medium',
                        impact: 30,
                        description: 'Large batch sizes leading to expiry before consumption'
                    },
                    {
                        id: 3,
                        name: 'Poor FEFO Implementation',
                        severity: 'high',
                        impact: 25,
                        description: 'First-Expired-First-Out not consistently followed'
                    }
                ]
            }
        ],
        recommendations: [
            {
                id: 1,
                priority: 'CRITICAL',
                impact: 'high',
                title: 'Implement Automated FEFO System',
                description: 'Deploy automated First-Expired-First-Out picking system to ensure oldest stock is used first.',
                tags: ['Automation', 'FEFO'],
                improvement: '-RM 0.8M Risk',
                timeline: '1 week',
                cost: 'High',
                implemented: false
            },
            {
                id: 2,
                priority: 'HIGH',
                impact: 'high',
                title: 'Near-Expiry Redistribution Program',
                description: 'Create inter-department redistribution program for near-expiry items to maximize utilization.',
                tags: ['Redistribution'],
                improvement: '-RM 0.5M Risk',
                timeline: '3-5 days',
                cost: 'Low',
                implemented: false
            },
            {
                id: 3,
                priority: 'MEDIUM',
                impact: 'medium',
                title: 'Optimize Order Quantities',
                description: 'Reduce order quantities for slow-moving items to minimize expiry risk.',
                tags: ['Optimization'],
                improvement: '-RM 0.3M Risk',
                timeline: '2 weeks',
                cost: 'Low',
                implemented: false
            },
            {
                id: 4,
                priority: 'HIGH',
                impact: 'medium',
                title: 'Expiry Alert Dashboard',
                description: 'Implement real-time expiry monitoring dashboard with automated alerts for proactive management.',
                tags: ['Monitoring', 'Alerts'],
                improvement: '-RM 0.4M Risk',
                timeline: '1-2 weeks',
                cost: 'Medium',
                implemented: false
            }
        ]
    }
};

// SCOR-based Related KPIs
export const relatedKPIs = [
    {
        id: 'wape',
        stage: 'Plan',
        name: 'Forecast Quality (WAPE)',
        description: 'Weighted Absolute Percentage Error',
        value: 12.5,
        unit: '%',
        target: 10,
        status: 'warning',
        formula: 'WAPE = Σ|Actual - Forecast| / ΣActual × 100',
        icon: 'Target',
        color: '#f59e0b'
    },
    {
        id: 'inbound_otif',
        stage: 'Source',
        name: 'Inbound Supplier OTIF',
        description: 'Supplier Delivery Performance',
        value: 96.8,
        unit: '%',
        target: 98,
        status: 'warning',
        formula: 'Inbound OTIF = (POs On-Time AND In-Full) / Total POs × 100',
        icon: 'Truck',
        color: '#f59e0b'
    },
    {
        id: 'fpy',
        stage: 'Make',
        name: 'First Pass Yield (FPY)',
        description: 'First-Time-Right Rate',
        value: 94.2,
        unit: '%',
        target: 96,
        status: 'warning',
        formula: 'FPY = (Units accepted with no rework) / Units started × 100',
        icon: 'CheckCircle',
        color: '#f59e0b'
    },
    {
        id: 'customer_otif',
        stage: 'Deliver',
        name: 'Customer OTIF',
        description: 'Perfect Delivery Rate',
        value: 97.5,
        unit: '%',
        target: 99,
        status: 'warning',
        formula: 'Customer OTIF = (Orders On-Time AND In-Full) / Total Orders × 100',
        icon: 'Package',
        color: '#f59e0b'
    },
    {
        id: 'return_resolution',
        stage: 'Return',
        name: 'Return Resolution Lead Time',
        description: 'Median Return Processing Time',
        value: 3.5,
        unit: 'days',
        target: 2,
        status: 'critical',
        formula: 'RLT = Median(Return Closed Date - Return Initiated Date)',
        icon: 'RotateCcw',
        color: '#ef4444'
    },
    {
        id: 'e2r',
        stage: 'Enable',
        name: 'Exception-to-Recovery Time',
        description: 'System Recovery Speed',
        value: 4.2,
        unit: 'hours',
        target: 2,
        status: 'critical',
        formula: 'E2R = Median(Recovery Time - Exception Detected Time)',
        icon: 'Zap',
        color: '#ef4444'
    }
];

export default kpiDetailData;
