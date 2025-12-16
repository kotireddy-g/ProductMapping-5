/**
 * Translation Helper for API Data
 * Maps API data IDs to translation keys
 */

/**
 * Get translated department name
 * @param {string} deptId - Department ID from API (e.g., 'icu', 'ward')
 * @param {function} t - Translation function from useTranslation
 * @returns {string} Translated department name
 */
export const getTranslatedDepartmentName = (deptId, t) => {
    const deptKey = deptId?.toLowerCase();

    const departmentMap = {
        'icu': 'departments.icu',
        'ward': 'departments.ward',
        'opd': 'departments.opd',
        'emergency': 'departments.emergency',
        'emergency & critical care': 'departments.emergency',
        'operating': 'departments.operating',
        'operating theatres & procedure suites': 'departments.operating',
        'lab': 'departments.lab',
        'laboratory': 'departments.lab',
        'radiology': 'departments.radiology',
        'pharmacy': 'departments.pharmacy',
        'dialysis': 'departments.dialysis',
        'nicu': 'departments.nicu',
        'oncology': 'departments.oncology',
        'daycare': 'departments.daycare',
        'er': 'departments.er'
    };

    return departmentMap[deptKey] ? t(departmentMap[deptKey]) : deptId;
};

/**
 * Get translated decision action name
 * @param {string} actionId - Action ID from API
 * @param {function} t - Translation function
 * @returns {string} Translated action name
 */
export const getTranslatedActionName = (actionId, t) => {
    const actionKey = actionId?.toLowerCase().replace(/\s+/g, '_');

    const actionMap = {
        'usage_/_velocity': 'decisionActions.usageVelocity',
        'usage/velocity': 'decisionActions.usageVelocity',
        'stock_position': 'decisionActions.stockPosition',
        'supplier_performance': 'decisionActions.supplierPerformance',
        'cost_optimization': 'decisionActions.costOptimization',
        'value_/_cost_impact': 'decisionActions.costOptimization',
        'expiry_/_shelf-life': 'decisionActions.expiryShelfLife',
        'criticality_&_service_level': 'decisionActions.criticalityService',
        'demand_pattern_&_predictability': 'decisionActions.demandPattern',
        'policy_/_handling': 'decisionActions.policyHandling'
    };

    return actionMap[actionKey] ? t(actionMap[actionKey]) : actionId;
};

export default {
    getTranslatedDepartmentName,
    getTranslatedActionName
};
