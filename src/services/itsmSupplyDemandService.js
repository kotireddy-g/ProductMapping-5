import itsmApiClient from './itsmApiClient';

/**
 * ITSM Supply-Demand Flow Service
 * Mirrors supplyDemandService.js — same endpoint paths, ITSM base URL, module=itsm always.
 */
const itsmSupplyDemandService = {
    getFlowData: async (params = {}) => {
        try {
            const response = await itsmApiClient.get('/dashboard/supply-demand-flow', {
                params: { ...params, module: 'itsm' },
            });
            return response.data;
        } catch (error) {
            console.error('ITSM get supply-demand flow error:', error);
            throw error;
        }
    },
};

export default itsmSupplyDemandService;
