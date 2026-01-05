import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.111:8055';

/**
 * Forecast Service
 * Handles API calls for forecast details data
 */

/**
 * Get forecast details for a specific area and time period
 * @param {string} areaId - Area identifier (e.g., 'icu', 'opd', 'emergency')
 * @param {string} timePeriod - Time period (today, next_7_days, next_14_days, next_21_days, next_30_days)
 * @param {string} module - Optional module name (e.g., 'staff-allocation')
 * @returns {Promise} API response with forecast details data
 */
export const getForecastDetails = async (areaId, timePeriod = 'today', module = null) => {
    try {
        const params = { time_period: timePeriod };
        if (module) {
            params.module = module;
        }
        const response = await axios.get(
            `${API_BASE_URL}/api/forecast/details/${areaId}`,
            { params }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching forecast details:', error);
        throw error;
    }
};

/**
 * Get forecast medicine details for a specific department
 * @param {string} departmentId - Department ID in uppercase (e.g., 'ICU_MED')
 * @param {string} timePeriod - Time period (today, next_7_days, etc.)
 * @param {string} module - Optional module name (e.g., 'staff-allocation')
 * @returns {Promise} API response with medicine details
 */
export const getForecastMedicineDetails = async (departmentId, timePeriod = 'today', module = null) => {
    try {
        const params = { time_period: timePeriod };
        if (module) {
            params.module = module;
        }
        const response = await axios.get(
            `${API_BASE_URL}/api/forecast/${departmentId}/`,
            { params }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching forecast medicine details:', error);
        throw error;
    }
};

export default {
    getForecastDetails,
    getForecastMedicineDetails
};
