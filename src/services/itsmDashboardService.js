import itsmApiClient from './itsmApiClient';

/**
 * ITSM Dashboard Service
 * Mirrors dashboardService.js — same endpoint paths, ITSM base URL, module=itsm always.
 */
const itsmDashboardService = {
    getOverview: async () => {
        try {
            const response = await itsmApiClient.get('/dashboard/overview', {
                params: { module: 'itsm' },
            });
            return response.data;
        } catch (error) {
            console.error('ITSM get overview error:', error);
            throw error;
        }
    },

    getDecisionActions: async () => {
        try {
            const response = await itsmApiClient.get('/dashboard/decision-actions', {
                params: { module: 'itsm' },
            });
            return response.data;
        } catch (error) {
            console.error('ITSM get decision actions error:', error);
            throw error;
        }
    },

    getForecast: async () => {
        try {
            const response = await itsmApiClient.get('/dashboard/forecast', {
                params: { module: 'itsm' },
            });
            return response.data;
        } catch (error) {
            console.error('ITSM get forecast error:', error);
            throw error;
        }
    },
};

export default itsmDashboardService;
