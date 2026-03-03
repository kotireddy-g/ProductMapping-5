import itsmApiClient from './itsmApiClient';

/**
 * ITSM HPI Simulation Service
 * Mirrors hpiSimulationService.js — same endpoint, ITSM base URL, module=itsm in body.
 */
const itsmHpiSimulationService = {
    runSimulation: async (params) => {
        try {
            const response = await itsmApiClient.post('/hpi/simulation', {
                baseline: {
                    otif_pct: params.baseline.otifPct,
                    revenue_norm: params.baseline.revenueNorm,
                    cost_efficiency_norm: params.baseline.costEfficiencyNorm,
                    patient_satisfaction: params.baseline.patientSatisfaction
                },
                scenarios: params.scenarios.map(scenario => ({
                    label: scenario.label,
                    otif_pct: scenario.otifPct,
                    revenue_norm: scenario.revenueNorm,
                    cost_efficiency_norm: scenario.costEfficiencyNorm,
                    patient_satisfaction: scenario.patientSatisfaction,
                    automation_investment_rm: scenario.automationInvestmentRm || null
                })),
                beds: params.beds || 500,
                occupancy_rate: params.occupancyRate || 0.85,
                revenue_per_bed_day: params.revenuePerBedDay || 4000,
                cost_per_bed_day: params.costPerBedDay || 3200,
                module: 'itsm'
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    meta: response.data.meta
                };
            } else {
                return { success: false, error: 'Invalid response from server' };
            }
        } catch (error) {
            console.error('ITSM HPI Simulation API error:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to run simulation'
            };
        }
    }
};

export default itsmHpiSimulationService;
