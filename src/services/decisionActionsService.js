import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.111:8055';

/**
 * Decision Actions Service
 * Handles API calls for decision actions data
 */

/**
 * Get decision actions data for a specific category and sub-category
 * @param {string} mainAction - Main decision action (e.g., 'usage-velocity', 'expiry-risk')
 * @param {string} subAction - Sub decision action (e.g., 'fast_moving', 'slow_moving')
 * @param {string} module - Optional module name (e.g., 'staff-allocation')
 * @returns {Promise} API response with decision actions data
 */
export const getDecisionActionsData = async (mainAction, subAction, module = null) => {
    try {
        const params = {};
        if (module) {
            params.module = module;
        }
        const response = await axios.get(
            `${API_BASE_URL}/api/decision-actions/${mainAction}/${subAction}`,
            { params }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching decision actions data:', error);
        throw error;
    }
};

export default {
    getDecisionActionsData
};
