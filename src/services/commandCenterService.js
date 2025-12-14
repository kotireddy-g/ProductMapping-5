import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.111:8055/api';

/**
 * Fetch Command Center data for a specific department
 * @param {string} departmentId - Department ID (e.g., 'icu', 'ot', 'ward')
 * @param {string} timePeriod - Time period filter (today | next_7_days | next_14_days | next_21_days | next_30_days)
 * @returns {Promise} Command Center data
 */
export const getCommandCenterData = async (departmentId, timePeriod = 'next_7_days') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/command-center/${departmentId}/`, {
            params: { time_period: timePeriod }
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
