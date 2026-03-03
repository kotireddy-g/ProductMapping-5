import itsmApiClient from './itsmApiClient';

/**
 * ITSM Decision Actions Service
 * Mirrors decisionActionsService.js — same endpoint paths, ITSM base URL, module=itsm always.
 */
export const getDecisionActionsData = async (mainAction, subAction) => {
    try {
        const response = await itsmApiClient.get(
            `/decision-actions/${mainAction}/${subAction}`,
            { params: { module: 'itsm' } }
        );
        return response.data;
    } catch (error) {
        console.error('ITSM get decision actions error:', error);
        throw error;
    }
};

export default { getDecisionActionsData };
