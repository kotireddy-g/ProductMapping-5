import axios from 'axios';

/**
 * Fetch RCA (Root Cause Analysis) list
 * @param {string} module - Optional module name (e.g., 'staff-allocation')
 * @returns {Promise} RCA data
 */
export const getRCAList = async (module = null) => {
    try {
        const params = {};
        if (module) {
            params.module = module;
        }
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/rca/list`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching RCA data:', error);
        throw error;
    }
};

export default {
    getRCAList
};
