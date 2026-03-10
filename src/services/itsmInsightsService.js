import itsmApiClient from './itsmApiClient';

/**
 * ITSM Insights Service
 * Calls /dashboard/insights/ with supplyParent, demandParent, source, time_period, module=itsm
 */
const itsmInsightsService = {
    /**
     * Get insights for the current Sankey selection.
     * @param {Object} params
     *   - supplyParent {string|null}  e.g. "proj::d3e88631..."
     *   - demandParent {string|null}  e.g. "dept::ENG"
     *   - source       {string|null}  e.g. "jira"
     *   - time_period  {string}       e.g. "next_7_days"
     */
    getInsights: async ({ supplyParent = null, demandParent = null, source = null, time_period = 'next_7_days' } = {}) => {
        try {
            const params = { time_period, module: 'itsm' };
            if (supplyParent) params.supplyParent = supplyParent;
            if (demandParent) params.demandParent = demandParent;
            if (source) params.source = source;

            const response = await itsmApiClient.get('/dashboard/insights/', { params });
            return response.data;
        } catch (error) {
            console.error('ITSM insights API error:', error);
            throw error;
        }
    },
};

export default itsmInsightsService;
