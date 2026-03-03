import itsmApiClient from './itsmApiClient';

/**
 * ITSM RCA Service
 * Mirrors rcaService.js — same endpoint paths, ITSM base URL, module=itsm always.
 */
export const getRCAList = async () => {
    try {
        const response = await itsmApiClient.get('/rca/list', {
            params: { module: 'itsm' },
        });
        return response.data;
    } catch (error) {
        console.error('ITSM get RCA list error:', error);
        throw error;
    }
};

export default { getRCAList };
