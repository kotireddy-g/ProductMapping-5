import axios from 'axios';

// Base API URL - can be configured via environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.1.111:8055';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response && error.response.status === 401) {
            // Clear auth data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');

            // Redirect to login if not already there
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
export { API_BASE_URL };
