import axios from 'axios';

const hpiSimulationService = {
    /**
     * Run HPI simulation with adjusted metrics
     * @param {Object} params - Simulation parameters
     * @param {Object} params.baseline - Baseline metrics
     * @param {Array} params.scenarios - Array of scenario objects
     * @param {number} params.beds - Number of hospital beds
     * @param {number} params.occupancyRate - Bed occupancy rate
     * @param {number} params.revenuePerBedDay - Revenue per bed per day
     * @param {number} params.costPerBedDay - Cost per bed per day
     * @returns {Promise<Object>} Simulation results
     */
    runSimulation: async (params, selectedModule = 'otif') => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/hpi/simulation`, {
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
                module: selectedModule
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    meta: response.data.meta
                };
            } else {
                return {
                    success: false,
                    error: 'Invalid response from server'
                };
            }
        } catch (error) {
            console.error('HPI Simulation API error:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to run simulation'
            };
        }
    }
};

export default hpiSimulationService;
