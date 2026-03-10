import apiClient from './api';

/**
 * KPI Service
 * Handles all KPI-related API calls
 */

const kpiService = {
    /**
     * Get all KPI data for the dashboard
     * @param {string} module - Optional module name (e.g., 'staff-allocation')
     * @returns {Promise} API response with all KPI metrics
     */
    getAllKPIs: async (module = null) => {
        try {
            const params = module ? { module } : {};
            const response = await apiClient.get('/kpi/all', { params });
            return response.data;
        } catch (error) {
            console.error('Get KPIs error:', error);
            throw error;
        }
    },

    /**
     * Get specific KPI data
     * @param {string} kpiName - Name of the KPI (otif, stockHealth, etc.)
     * @returns {Promise} API response with specific KPI data
     */
    getKPI: async (kpiName) => {
        try {
            const response = await apiClient.get(`/kpi/${kpiName}`);
            return response.data;
        } catch (error) {
            console.error(`Get ${kpiName} KPI error:`, error);
            throw error;
        }
    },

    /**
     * Get KPI detail page data
     * @param {string} kpiId - KPI identifier (e.g., 'otif', 'stockHealth')
     * @param {string} module - Module context (e.g., 'otif')
     * @param {string} timePeriod - Time period (e.g., 'daily', 'monthly', 'yearly')
     * @returns {Promise} API response with full KPI detail data
     */
    getKPIDetail: async (kpiId, module = 'otif', timePeriod = 'daily') => {
        try {
            const response = await apiClient.get('/kpi/detail', {
                params: { kpiId, module, timePeriod },
            });
            return response.data;
        } catch (error) {
            console.error(`Get KPI detail error for ${kpiId}:`, error);
            throw error;
        }
    },
};

export default kpiService;
