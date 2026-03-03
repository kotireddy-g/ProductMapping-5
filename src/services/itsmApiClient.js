import axios from 'axios';

// ITSM DTIF API base URL
const ITSM_API_BASE_URL = 'http://192.168.1.111:8011/dtif/api';

// Create axios instance for ITSM DTIF APIs
const itsmApiClient = axios.create({
    baseURL: ITSM_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 seconds timeout
});

// Request interceptor
itsmApiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
itsmApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('ITSM API error:', error.message);
        return Promise.reject(error);
    }
);

export default itsmApiClient;
export { ITSM_API_BASE_URL };
