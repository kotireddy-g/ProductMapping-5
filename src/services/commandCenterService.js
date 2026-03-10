import axios from 'axios';

/**
 * Fetch Command Center data for a specific department
 * @param {string} departmentId - Department ID (e.g., 'icu', 'ot', 'ward')
 * @param {string} timePeriod - Time period filter (today | next_7_days | next_14_days | next_21_days | next_30_days)
 * @param {string} module - Optional module name (e.g., 'staff-allocation')
 * @returns {Promise} Command Center data
 */
export const getCommandCenterData = async (departmentId, timePeriod = 'next_7_days', module = null) => {
    try {
        const params = { time_period: timePeriod };
        if (module) {
            params.module = module;
        }
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/command-center/${departmentId}/`, {
            params
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching command center data:', error);
        throw error;
    }
};

export default {
    getCommandCenterData
};
