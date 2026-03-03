import itsmApiClient from './itsmApiClient';

/**
 * ITSM Sankey & What-If Service
 * Wraps /sankey/ and /whatif/ endpoints.
 */

const itsmSankeyService = {
    /**
     * GET /sankey/lifecycle/?period=
     * 12-stage lifecycle Sankey: Deal Stages → Departments with DTIF health coloring
     */
    getLifecycleSankey: async (period = '14d') => {
        try {
            const response = await itsmApiClient.get('/sankey/lifecycle/', {
                params: { period },
            });
            return response.data;
        } catch (error) {
            console.error('ITSM getLifecycleSankey error:', error);
            throw error;
        }
    },

    /**
     * GET /sankey/work-org/?left_level=&right_level=&left_parent=&right_parent=
     * 6-level Work↔Org drill-down Sankey
     */
    getWorkOrgSankey: async (params = {}) => {
        try {
            const response = await itsmApiClient.get('/sankey/work-org/', { params });
            return response.data;
        } catch (error) {
            console.error('ITSM getWorkOrgSankey error:', error);
            throw error;
        }
    },

    /**
     * GET /sankey/sprint-burndown/?project_id=
     * Sprint burndown Sankey: To-Do / In-Progress / Blocked → Done per sprint
     */
    getSprintBurndown: async (projectId = null) => {
        try {
            const params = projectId ? { project_id: projectId } : {};
            const response = await itsmApiClient.get('/sankey/sprint-burndown/', { params });
            return response.data;
        } catch (error) {
            console.error('ITSM getSprintBurndown error:', error);
            throw error;
        }
    },

    /**
     * POST /whatif/simulate/
     * OPI & DTIF scenario simulation
     * @param {Array} scenarios - Array of scenario objects
     */
    simulate: async (scenarios) => {
        try {
            const response = await itsmApiClient.post('/whatif/simulate/', { scenarios });
            return response.data;
        } catch (error) {
            console.error('ITSM simulate error:', error);
            throw error;
        }
    },
};

export default itsmSankeyService;
