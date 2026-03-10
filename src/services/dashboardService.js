import apiClient from './api';

/**
 * Dashboard Service
 * Handles all landing page dashboard API calls
 */

const dashboardService = {
    /**
     * Get dashboard overview data (OTIF metrics and departments)
     * @param {string} module - Optional module name (e.g., 'staff-allocation')
     * @returns {Promise} API response with overview data
     */
    getOverview: async (module = null) => {
        try {
            const params = module ? { module } : {};
            const response = await apiClient.get('/dashboard/overview', { params });
            return response.data;
        } catch (error) {
            console.error('Get dashboard overview error:', error);
            throw error;
        }
    },

    /**
     * Get decision actions data with subcategories
     * @param {string} module - Optional module name (e.g., 'staff-allocation')
     * @returns {Promise} API response with decision actions
     */
    getDecisionActions: async (module = null) => {
        try {
            const params = module ? { module } : {};
            const response = await apiClient.get('/dashboard/decision-actions', { params });
            return response.data;
        } catch (error) {
            console.error('Get decision actions error:', error);
            throw error;
        }
    },

    /**
     * Get forecast data for all areas
     * @param {string} module - Optional module name (e.g., 'staff-allocation')
     * @returns {Promise} API response with forecast data
     */
    getForecast: async (module = null) => {
        try {
            const params = module ? { module } : {};
            const response = await apiClient.get('/dashboard/forecast', { params });
            return response.data;
        } catch (error) {
            console.error('Get forecast error:', error);
            throw error;
        }
    },
};

export default dashboardService;
