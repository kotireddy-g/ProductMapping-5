import itsmApiClient from './itsmApiClient';

/**
 * CEO ITSM Service
 * Wraps the two CEO-facing ITSM APIs:
 *   GET /itsm/ceo/home
 *   GET /itsm/ceo/kpi-detail?action_id=...&time_period=...
 */
const ceoItsmService = {
    /**
     * Fetch connected sources and action pills for the search/home page.
     * @returns {{ connected_sources: string[], actions: Array }}
     */
    getHome: async () => {
        try {
            const response = await itsmApiClient.get('/itsm/ceo/home');
            return response.data;
        } catch (error) {
            console.error('CEO ITSM home API error:', error);
            throw error;
        }
    },

    /**
     * Fetch KPI cards for a specific action and time period.
     * @param {string} actionId   e.g. "sla_breach_imminent"
     * @param {string} timePeriod one of: "today" | "next_7_days" | "next_14_days" | "next_28_days"
     */
    getKpiDetail: async (actionId, timePeriod = 'next_7_days') => {
        try {
            const response = await itsmApiClient.get('/itsm/ceo/kpi-detail', {
                params: { action_id: actionId, time_period: timePeriod },
            });
            return response.data;
        } catch (error) {
            console.error('CEO ITSM KPI detail API error:', error);
            throw error;
        }
    },
};

export default ceoItsmService;
