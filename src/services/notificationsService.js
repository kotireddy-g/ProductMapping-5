import apiClient from './api';
import itsmApiClient from './itsmApiClient';

/**
 * Notifications Service
 * Handles all notifications-related API calls
 */

const notificationsService = {
    /**
     * Get all notifications for the current user
     * @param {string} module - Optional module name (e.g., 'staff-allocation')
     * @param {boolean} isITSM - If true, use ITSM base URL and module=itsm
     * @returns {Promise} API response with notifications list and unread count
     */
    getNotifications: async (module, isITSM = false) => {
        try {
            let response;
            if (isITSM) {
                // ITSM: use itsmApiClient (port 8011, base already = /dtif/api)
                // Full URL = http://192.168.1.111:8011/dtif/api/notifications?module=itsm
                response = await itsmApiClient.get('/notifications', { params: { module: 'itsm' } });
            } else {
                // Pharma: always forward the module param so the API knows the active context
                const params = module ? { module } : {};
                response = await apiClient.get('/notifications', { params });
            }

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
     * @param {boolean} isITSM - If true, use ITSM base URL
     * @returns {Promise} API response
     */
    markAsRead: async (notificationId, isITSM = false) => {
        try {
            const client = isITSM ? itsmApiClient : apiClient;
            const path = isITSM
                ? `/dtif/api/notifications/${notificationId}/read`
                : `/api/notifications/${notificationId}/read`;
            const response = await client.patch(path);
            return response.data;
        } catch (error) {
            console.error('Mark notification as read error:', error);
            throw error;
        }
    },

    /**
     * Mark all notifications as read
     * @param {boolean} isITSM - If true, use ITSM base URL
     * @returns {Promise} API response
     */
    markAllAsRead: async (isITSM = false) => {
        try {
            const client = isITSM ? itsmApiClient : apiClient;
            const path = isITSM ? '/dtif/api/notifications/read-all' : '/api/notifications/read-all';
            const response = await client.patch(path);
            return response.data;
        } catch (error) {
            console.error('Mark all notifications as read error:', error);
            throw error;
        }
    },
};

export default notificationsService;
