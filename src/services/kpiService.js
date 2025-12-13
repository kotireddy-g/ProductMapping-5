import apiClient from './api';

/**
 * KPI Service
 * Handles all KPI-related API calls
 */

const kpiService = {
    /**
     * Get all KPI data for the dashboard
     * @returns {Promise} API response with all KPI metrics
     */
    getAllKPIs: async () => {
        try {
            const response = await apiClient.get('/api/kpi/all');
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
            const response = await apiClient.get(`/api/kpi/${kpiName}`);
            return response.data;
        } catch (error) {
            console.error(`Get ${kpiName} KPI error:`, error);
            throw error;
        }
    },
};

export default kpiService;
