// Dashboard Template Configurations
export const DASHBOARD_TEMPLATES = {
    executive: {
        id: 'executive',
        name: 'Executive Dashboard',
        icon: '📊',
        description: 'High-level overview with emphasis on KPIs',
        widgetOrder: ['search', 'otif', 'decisions', 'forecast', 'supplyDemand', 'departments'],
        layout: {
            row1: ['otif', 'decisions', 'forecast'],
            row2: ['supplyDemand'],
            row3: ['departments']
        }
    },
    operations: {
        id: 'operations',
        name: 'Operations Focus',
        icon: '🔧',
        description: 'Operational metrics and supply chain visibility',
        widgetOrder: ['search', 'supplyDemand', 'otif', 'forecast', 'departments', 'decisions'],
        layout: {
            row1: ['supplyDemand'],
            row2: ['otif', 'forecast'],
            row3: ['departments', 'decisions']
        }
    },
    actionOriented: {
        id: 'actionOriented',
        name: 'Action-Oriented',
        icon: '⚡',
        description: 'Immediate actions and critical decisions',
        widgetOrder: ['search', 'decisions', 'otif', 'forecast', 'departments', 'supplyDemand'],
        layout: {
            row1: ['decisions'],
            row2: ['otif', 'forecast'],
            row3: ['departments'],
            row4: ['supplyDemand']
        }
    },
    balanced: {
        id: 'balanced',
        name: 'Balanced View',
        icon: '⚖️',
        description: 'Equal emphasis on all components',
        widgetOrder: ['search', 'otif', 'decisions', 'forecast', 'departments', 'supplyDemand'],
        layout: {
            row1: ['otif', 'decisions', 'forecast'],
            row2: ['departments'],
            row3: ['supplyDemand']
        }
    }
};

// Widget labels for preview
export const WIDGET_LABELS = {
    search: 'Search',
    otif: 'OTIF',
    decisions: 'Actions',
    forecast: 'Forecast',
    supplyDemand: 'Supply & Demand',
    departments: 'Departments'
};

export const getWidgetLabel = (widgetId) => {
    return WIDGET_LABELS[widgetId] || widgetId;
};
