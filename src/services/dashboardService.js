import apiClient from './api';

/**
 * Dashboard Service
 * Handles all landing page dashboard API calls
 */

const dashboardService = {
    /**
     * Get dashboard overview data (OTIF metrics and departments)
     * @returns {Promise} API response with overview data
     */
    getOverview: async () => {
        try {
            const response = await apiClient.get('/api/dashboard/overview');
            return response.data;
        } catch (error) {
            console.error('Get dashboard overview error:', error);
            throw error;
        }
    },

    /**
     * Get decision actions data with subcategories
     * @returns {Promise} API response with decision actions
     */
    getDecisionActions: async () => {
        try {
            const response = await apiClient.get('/api/dashboard/decision-actions');
            return response.data;
        } catch (error) {
            console.error('Get decision actions error:', error);
            throw error;
        }
    },

    /**
     * Get forecast data for all areas
     * @returns {Promise} API response with forecast data
     */
    getForecast: async () => {
        try {
            const response = await apiClient.get('/api/dashboard/forecast');
            return response.data;
        } catch (error) {
            console.error('Get forecast error:', error);
            throw error;
        }
    },
};

export default dashboardService;
