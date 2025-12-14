import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.111:8055/api';

/**
 * Fetch RCA (Root Cause Analysis) list
 * @returns {Promise} RCA data
 */
export const getRCAList = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rca/list`);
        return response.data;
    } catch (error) {
        console.error('Error fetching RCA data:', error);
        throw error;
    }
};

export default {
    getRCAList
};
