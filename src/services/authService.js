import apiClient from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */

const authService = {
    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} API response with user data and token
     */
    login: async (email, password) => {
        try {
            const response = await apiClient.post('/api/auth/login', {
                email,
                password,
            });

            if (response.data.success && response.data.data) {
                const { user, token } = response.data.data;

                // Store token and user data
                authService.setToken(token);
                authService.setUser(user);

                return response.data;
            }

            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Signup new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} name - User full name
     * @param {string} department - User department
     * @returns {Promise} API response with user data
     */
    signup: async (email, password, name, department) => {
        try {
            const response = await apiClient.post('/api/auth/signup', {
                email,
                password,
                name,
                department,
            });

            return response.data;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    },

    /**
     * Logout user
     * Clears all authentication data from localStorage
     */
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    },

    /**
     * Get stored authentication token
     * @returns {string|null} Auth token or null if not found
     */
    getToken: () => {
        return localStorage.getItem('authToken');
    },

    /**
     * Store authentication token
     * @param {string} token - JWT token
     */
    setToken: (token) => {
        localStorage.setItem('authToken', token);
    },

    /**
     * Get stored user data
     * @returns {Object|null} User object or null if not found
     */
    getUser: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },

    /**
     * Store user data
     * @param {Object} user - User object
     */
    setUser: (user) => {
        localStorage.setItem('userData', JSON.stringify(user));
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} True if user has valid token
     */
    isAuthenticated: () => {
        const token = authService.getToken();
        return !!token;
    },
};

export default authService;
