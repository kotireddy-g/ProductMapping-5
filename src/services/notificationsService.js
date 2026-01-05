import apiClient from './api';

/**
 * Notifications Service
 * Handles all notifications-related API calls
 */

const notificationsService = {
    /**
     * Get all notifications for the current user
     * @param {string} module - Optional module name (e.g., 'staff-allocation')
     * @returns {Promise} API response with notifications list and unread count
     */
    getNotifications: async (module = null) => {
        try {
            const params = {};
            if (module) {
                params.module = module;
            }
            const response = await apiClient.get('/api/notifications', { params });
            // API returns { success: true, data: [...notifications] }
            // Return in expected format: { data: { notifications: [...] } }
            return {
                data: {
                    notifications: response.data.data || response.data.notifications || []
                }
            };
        } catch (error) {
            console.error('Get notifications error:', error);
            throw error;
        }
    },

    /**
     * Mark a notification as read
     * @param {string} notificationId - ID of the notification to mark as read
     * @returns {Promise} API response
     */
    markAsRead: async (notificationId) => {
        try {
            const response = await apiClient.patch(`/api/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            console.error('Mark notification as read error:', error);
            throw error;
        }
    },

    /**
     * Mark all notifications as read
     * @returns {Promise} API response
     */
    markAllAsRead: async () => {
        try {
            const response = await apiClient.patch('/api/notifications/read-all');
            return response.data;
        } catch (error) {
            console.error('Mark all notifications as read error:', error);
            throw error;
        }
    },
};

export default notificationsService;
