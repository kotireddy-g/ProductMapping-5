// Dashboard Template Configurations
export const DASHBOARD_TEMPLATES = {
    executive: {
        id: 'executive',
        name: 'Executive Dashboard',
        icon: '📊',
        description: 'High-level overview with emphasis on KPIs',
        componentOrder: ['performanceOtif', 'supplyDemand', 'departments', 'decisions', 'forecast', 'kpis'],
        layout: {
            row1: ['performanceOtif'],
            row2: ['supplyDemand'],
            row3: ['departments'],
            row4: ['decisions'],
            row5: ['forecast'],
            row6: ['kpis']
        }
    },
    kpiFirst: {
        id: 'kpiFirst',
        name: 'KPI-First View',
        icon: '📈',
        description: 'KPI cards at the top for quick insights',
        componentOrder: ['kpis', 'performanceOtif', 'supplyDemand', 'departments', 'decisions', 'forecast'],
        layout: {
            row1: ['kpis'],
            row2: ['performanceOtif'],
            row3: ['supplyDemand'],
            row4: ['departments'],
            row5: ['decisions'],
            row6: ['forecast']
        }
    },
    operations: {
        id: 'operations',
        name: 'Operations Focus',
        icon: '🔧',
        description: 'Operational metrics and supply chain visibility',
        componentOrder: ['supplyDemand', 'performanceOtif', 'departments', 'forecast', 'decisions', 'kpis'],
        layout: {
            row1: ['supplyDemand'],
            row2: ['performanceOtif'],
            row3: ['departments'],
            row4: ['forecast'],
            row5: ['decisions'],
            row6: ['kpis']
        }
    },
    actionOriented: {
        id: 'actionOriented',
        name: 'Action-Oriented',
        icon: '⚡',
        description: 'Immediate actions and critical decisions',
        componentOrder: ['decisions', 'performanceOtif', 'forecast', 'departments', 'supplyDemand', 'kpis'],
        layout: {
            row1: ['decisions'],
            row2: ['performanceOtif'],
            row3: ['forecast'],
            row4: ['departments'],
            row5: ['supplyDemand'],
            row6: ['kpis']
        }
    },
    balanced: {
        id: 'balanced',
        name: 'Balanced View',
        icon: '⚖️',
        description: 'Equal emphasis on all components',
        componentOrder: ['performanceOtif', 'supplyDemand', 'departments', 'decisions', 'forecast', 'kpis'],
        layout: {
            row1: ['performanceOtif'],
            row2: ['supplyDemand'],
            row3: ['departments'],
            row4: ['decisions'],
            row5: ['forecast'],
            row6: ['kpis']
        }
    }
};

// Widget labels for preview - matching actual dashboard components
export const WIDGET_LABELS = {
    performanceOtif: 'Performance Score + OTIF',
    supplyDemand: 'Supply & Demand Flow',
    departments: 'Department Cards',
    decisions: 'Decision Actions',
    forecast: 'Forecast',
    kpis: 'KPI Cards'
};

export const getWidgetLabel = (widgetId) => {
    return WIDGET_LABELS[widgetId] || widgetId;
};
