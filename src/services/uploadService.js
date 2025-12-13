import apiClient from './api';

/**
 * Upload Service
 * Handles file upload and processing operations
 */

const uploadService = {
    /**
     * Upload workbook file (Step 1)
     * @param {File} file - Excel file to upload
     * @param {number} facilityId - Facility ID (optional, default 1)
     * @returns {Promise} API response with upload_id
     */
    uploadWorkbook: async (file, facilityId = 1) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('facility_id', facilityId);

            const response = await apiClient.post('/api/demo/uploads/orders/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Return the response data directly (API returns 201 for success)
            return response.data;
        } catch (error) {
            console.error('Upload workbook error:', error);
            throw error;
        }
    },

    /**
     * Process upload and recompute KPIs (Step 2)
     * @param {string} uploadId - Upload ID from step 1
     * @param {number} facilityId - Facility ID
     * @param {string} timeframe - Timeframe for processing (default: last_30_days)
     * @returns {Promise} API response with refreshed data
     */
    processUpload: async (uploadId, facilityId = 1, timeframe = 'last_30_days') => {
        try {
            const response = await apiClient.post('/api/demo/uploads/run/', {
                upload_id: uploadId,
                facility_id: facilityId,
                timeframe: timeframe,
            });

            // Return the response data directly
            return response.data;
        } catch (error) {
            console.error('Process upload error:', error);
            throw error;
        }
    },
};

export default uploadService;
