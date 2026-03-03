import itsmApiClient from './itsmApiClient';

/**
 * ITSM Command Center Service
 * Mirrors commandCenterService.js — same endpoint paths, ITSM base URL, module=itsm always.
 */
export const getCommandCenterData = async (departmentId, timePeriod = 'next_7_days') => {
    try {
        const response = await itsmApiClient.get(`/command-center/${departmentId}/`, {
            params: { time_period: timePeriod, module: 'itsm' },
        });
        return response.data;
    } catch (error) {
        console.error('ITSM get command center error:', error);
        throw error;
    }
};

export default { getCommandCenterData };
