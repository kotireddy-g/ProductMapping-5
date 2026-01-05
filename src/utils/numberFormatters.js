/**
 * Number Formatting Utilities for KPI Display
 * Handles currency, percentages, and large number abbreviations
 */

/**
 * Format large numbers with K/M suffixes
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted number string
 */
export const formatLargeNumber = (value, decimals = 1) => {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(decimals) + 'M';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(decimals) + 'K';
    } else if (value < 10) {
        return value.toFixed(decimals);
    } else {
        return Math.round(value).toString();
    }
};

/**
 * Format value based on unit type
 * @param {number} value - The value to format
 * @param {string} unit - The unit type (%, RM, hours, Days, etc.)
 * @returns {string} Formatted value with unit
 */
export const formatValueWithUnit = (value, unit) => {
    if (!value && value !== 0) return 'N/A';

    switch (unit) {
        case 'RM':
            return `RM ${formatLargeNumber(value)}`;
        case '%':
            return `${value < 10 ? value.toFixed(1) : Math.round(value)}%`;
        case 'hours':
            return `${value.toFixed(1)} Hours`;
        case 'Days':
            return `${Math.round(value)} Days`;
        default:
            return formatLargeNumber(value);
    }
};

/**
 * Format date for chart display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (MM/DD)
 */
export const formatChartDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
};

/**
 * Calculate smart Y-axis domain with padding
 * @param {number[]} values - Array of values
 * @param {number} paddingPercent - Padding percentage (default: 5)
 * @returns {[number, number]} [min, max] domain
 */
export const calculateYAxisDomain = (values, paddingPercent = 5) => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;

    const padding = range * (paddingPercent / 100);

    return [
        Math.max(0, min - padding), // Don't go below 0
        max + padding
    ];
};

/**
 * Get status color configuration
 * @param {string} status - Status type (healthy, warning, risk)
 * @returns {object} Color configuration object
 */
export const getStatusColors = (status) => {
    switch (status) {
        case 'healthy':
            return {
                indicator: '#10b981',
                text: 'Met',
                bgClass: 'bg-green-50',
                textClass: 'text-green-700',
                borderClass: 'border-green-300'
            };
        case 'warning':
            return {
                indicator: '#f59e0b',
                text: 'Warning',
                bgClass: 'bg-amber-50',
                textClass: 'text-amber-700',
                borderClass: 'border-amber-300'
            };
        case 'risk':
            return {
                indicator: '#ef4444',
                text: 'Not Met',
                bgClass: 'bg-red-50',
                textClass: 'text-red-700',
                borderClass: 'border-red-300'
            };
        default:
            return {
                indicator: '#6b7280',
                text: 'Unknown',
                bgClass: 'bg-gray-50',
                textClass: 'text-gray-700',
                borderClass: 'border-gray-300'
            };
    }
};
