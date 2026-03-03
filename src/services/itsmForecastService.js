import itsmApiClient from './itsmApiClient';

/**
 * ITSM Forecast Service
 * Mirrors forecastService.js — same endpoint paths, ITSM base URL, module=itsm always.
 */
export const getForecastDetails = async (areaId, timePeriod = 'today') => {
    try {
        const response = await itsmApiClient.get(
            `/forecast/details/${areaId}`,
            { params: { time_period: timePeriod, module: 'itsm' } }
        );
        return response.data;
    } catch (error) {
        console.error('ITSM get forecast details error:', error);
        throw error;
    }
};

export const getForecastMedicineDetails = async (departmentId, timePeriod = 'today') => {
    try {
        const response = await itsmApiClient.get(
            `/forecast/${departmentId}/`,
            { params: { time_period: timePeriod, module: 'itsm' } }
        );
        return response.data;
    } catch (error) {
        console.error('ITSM get forecast medicine details error:', error);
        throw error;
    }
};

export default { getForecastDetails, getForecastMedicineDetails };
