import itsmApiClient from './itsmApiClient';

/**
 * ITSM KPI Service
 * Mirrors kpiService.js — same endpoint paths, ITSM base URL, module=itsm always.
 */
const itsmKpiService = {
    getAllKPIs: async () => {
        try {
            const response = await itsmApiClient.get('/kpi/all', {
                params: { module: 'itsm' },
            });
            return response.data;
        } catch (error) {
            console.error('ITSM get all KPIs error:', error);
            throw error;
        }
    },

    getKPI: async (kpiName) => {
        try {
            const response = await itsmApiClient.get(`/kpi/${kpiName}`, {
                params: { module: 'itsm' },
            });
            return response.data;
        } catch (error) {
            console.error(`ITSM get ${kpiName} KPI error:`, error);
            throw error;
        }
    },

    getKPIDetail: async (kpiId, timePeriod = 'daily') => {
        try {
            const response = await itsmApiClient.get('/kpi/detail', {
                params: { kpiId, module: 'itsm', timePeriod },
            });
            return response.data;
        } catch (error) {
            console.error(`ITSM get KPI detail error for ${kpiId}:`, error);
            throw error;
        }
    },
};

export default itsmKpiService;
