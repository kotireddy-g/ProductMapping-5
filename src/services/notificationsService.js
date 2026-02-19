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
    getNotifications: async (module) => {
        try {
            // Always forward the module param so the API knows the active context
            const params = module ? { module } : {};
            const response = await apiClient.get('/api/notifications', { params });

            // API returns: { success: true, data: { unreadCount: N, notifications: [...] } }
            // response.data.data  => { unreadCount, notifications: [...] }  (object, NOT array)
            // response.data.data.notifications => the actual array we need
            const payload = response.data?.data;
            let notifications;
            if (payload && Array.isArray(payload.notifications)) {
                // Standard shape: { data: { notifications: [...] } }
                notifications = payload.notifications;
            } else if (Array.isArray(payload)) {
                // Alternate shape: { data: [...] }
                notifications = payload;
            } else if (Array.isArray(response.data?.notifications)) {
                // Flat shape: { notifications: [...] }
                notifications = response.data.notifications;
            } else {
                notifications = [];
            }

            return {
                success: true,
                data: {
                    notifications
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
