import apiClient from './api';

/**
 * Supply-Demand Flow Service
 * Handles all supply-demand flow API calls
 */

const supplyDemandService = {
    /**
     * Get supply-demand flow data
     * @param {Object} params - Query parameters for drill-down
     * @param {number} params.supplyLevel - Supply hierarchy level (1, 2, or 3)
     * @param {string} params.supplyParent - Parent supply node ID for drill-down
     * @param {number} params.demandLevel - Demand hierarchy level (1, 2, or 3)
     * @returns {Promise} API response with flow data
     */
    getFlowData: async (params = {}) => {
        try {
            const response = await apiClient.get('/api/dashboard/supply-demand-flow', {
                params
            });
            return response.data;
        } catch (error) {
            console.error('Get supply-demand flow error:', error);
            throw error;
        }
    },
};

export default supplyDemandService;
