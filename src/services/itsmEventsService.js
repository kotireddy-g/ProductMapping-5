import itsmApiClient from './itsmApiClient';

/**
 * ITSM Events Service
 * Wraps /events/ endpoints for live activity feed.
 */

const itsmEventsService = {
    /**
     * GET /events/feed/?limit=&source=&employee_id=&project_id=
     * Historical event feed from DB — Jira, GitHub, ITSM, HR events
     */
    getEventsFeed: async (filters = {}) => {
        try {
            const response = await itsmApiClient.get('/events/feed/', { params: filters });
            return response.data;
        } catch (error) {
            console.error('ITSM getEventsFeed error:', error);
            throw error;
        }
    },

    /**
     * GET /events/live/?n=
     * Latest N events from in-memory live pool — no DB hit, real-time
     */
    getLiveEvents: async (n = 20) => {
        try {
            const response = await itsmApiClient.get('/events/live/', { params: { n } });
            return response.data;
        } catch (error) {
            console.error('ITSM getLiveEvents error:', error);
            throw error;
        }
    },

    /**
     * GET /events/stats/
     * Event count by source (Jira, GitHub, ITSM, HR, CRM)
     */
    getEventsStats: async () => {
        try {
            const response = await itsmApiClient.get('/events/stats/');
            return response.data;
        } catch (error) {
            console.error('ITSM getEventsStats error:', error);
            throw error;
        }
    },

    /**
     * POST /events/trigger/?n=
     * Manually trigger N live events into in-memory pool (demo/testing)
     */
    triggerEvents: async (n = 5) => {
        try {
            const response = await itsmApiClient.post('/events/trigger/', null, {
                params: { n },
            });
            return response.data;
        } catch (error) {
            console.error('ITSM triggerEvents error:', error);
            throw error;
        }
    },
};

export default itsmEventsService;
