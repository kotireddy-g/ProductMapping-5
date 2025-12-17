const API_BASE_URL = 'http://192.168.1.111:8055';

export default {
    /**
     * Get supplier forecast report
     * @param {string} filter - Filter type: 'all', 'critical', 'surging', 'expiry_risk'
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Promise} API response
     */
    getSupplierForecastReport(filter = 'all', page = 1, limit = 50) {
        return fetch(`${API_BASE_URL}/api/supplier-forecast-report/?filter=${filter}&page=${page}&limit=${limit}`)
            .then(response => response.json());
    }
};
