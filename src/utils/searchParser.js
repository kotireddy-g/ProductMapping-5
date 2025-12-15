/**
 * Search Parser Utility
 * Intelligently parses search queries and matches them to departments, forecasts, or decision actions
 */

/**
 * Normalize search query for matching
 * @param {string} query - Raw search query
 * @returns {string} Normalized query
 */
const normalizeQuery = (query) => {
    return query.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
};

/**
 * Check if query contains forecast keywords
 * @param {string} query - Normalized query
 * @returns {boolean}
 */
const hasForecastKeywords = (query) => {
    const forecastKeywords = ['forecast', 'prediction', 'predict', 'future', 'projected', 'estimate'];
    return forecastKeywords.some(keyword => query.includes(keyword));
};

/**
 * Check if query contains OTIF keywords
 * @param {string} query - Normalized query
 * @returns {boolean}
 */
const hasOTIFKeywords = (query) => {
    const otifKeywords = ['otif', 'performance', 'on time', 'in full', 'delivery'];
    return otifKeywords.some(keyword => query.includes(keyword));
};

/**
 * Match department from query
 * @param {string} query - Normalized query
 * @param {Array} departments - List of departments from API
 * @returns {Object|null} Matched department or null
 */
const matchDepartment = (query, departments) => {
    if (!departments || !Array.isArray(departments) || departments.length === 0) return null;

    // Try exact match first
    let match = departments.find(dept => {
        if (!dept || !dept.name || !dept.id) return false;
        return query.includes(dept.name.toLowerCase()) ||
            query.includes(dept.id.toLowerCase());
    });

    // Try fuzzy match
    if (!match) {
        match = departments.find(dept => {
            if (!dept || !dept.name) return false;
            const deptName = dept.name.toLowerCase();
            const deptWords = deptName.split(' ');
            return deptWords.some(word => query.includes(word) && word.length > 2);
        });
    }

    return match;
};

/**
 * Match forecast area from query
 * @param {string} query - Normalized query
 * @param {Array} forecastAreas - List of forecast areas from API
 * @returns {Object|null} Matched forecast area or null
 */
const matchForecastArea = (query, forecastAreas) => {
    if (!forecastAreas || !Array.isArray(forecastAreas) || forecastAreas.length === 0) return null;

    // Try exact match first
    let match = forecastAreas.find(area => {
        if (!area || !area.name || !area.id) return false;
        return query.includes(area.name.toLowerCase()) ||
            query.includes(area.id.toLowerCase());
    });

    // Try fuzzy match
    if (!match) {
        match = forecastAreas.find(area => {
            if (!area || !area.name) return false;
            const areaName = area.name.toLowerCase();
            const areaWords = areaName.split(' ');
            return areaWords.some(word => query.includes(word) && word.length > 2);
        });
    }

    return match;
};

/**
 * Match decision action (main or sub) from query
 * @param {string} query - Normalized query
 * @param {Array} decisionActions - List of decision actions from API
 * @returns {Object|null} Matched action with type (main/sub) or null
 */
const matchDecisionAction = (query, decisionActions) => {
    if (!decisionActions || !Array.isArray(decisionActions) || decisionActions.length === 0) return null;

    // Check for subcategory match first (more specific)
    for (const action of decisionActions) {
        if (action.subcategories && action.subcategories.length > 0) {
            const subMatch = action.subcategories.find(sub => {
                if (!sub || !sub.name) return false;
                const subName = sub.name.toLowerCase().replace(/[^a-z0-9\s]/g, '');
                const subWords = subName.split(' ');

                // Check if query matches full name or any significant word
                return query.includes(subName) ||
                    subName.includes(query) ||
                    subWords.some(word =>
                        word.length >= 3 &&
                        (query.includes(word) || word.includes(query))
                    );
            });

            if (subMatch) {
                return {
                    type: 'sub',
                    mainAction: action,
                    subAction: subMatch
                };
            }
        }
    }

    // Check for main action match
    const mainMatch = decisionActions.find(action => {
        if (!action || !action.name) return false;
        const actionName = action.name.toLowerCase().replace(/[^a-z0-9\s]/g, '');
        const actionWords = actionName.split(' ');

        // Check if query matches full name or any significant word
        return query.includes(actionName) ||
            actionName.includes(query) ||
            actionWords.some(word =>
                word.length >= 3 &&
                (query.includes(word) || word.includes(query))
            );
    });

    if (mainMatch) {
        return {
            type: 'main',
            mainAction: mainMatch
        };
    }

    return null;
};

/**
 * Main search parser function
 * @param {string} query - User's search query
 * @param {Object} dashboardData - Dashboard data from APIs
 * @param {Array} dashboardData.departments - Departments from overview API
 * @param {Array} dashboardData.forecastAreas - Forecast areas from forecast API
 * @param {Array} dashboardData.decisionActions - Decision actions from decision actions API
 * @returns {Object} Search result with type and data
 */
export const parseSearchQuery = (query, dashboardData) => {
    if (!query || query.trim().length === 0) {
        return { type: 'empty', data: null };
    }

    const normalizedQuery = normalizeQuery(query);
    const { departments = [], forecastAreas = [], decisionActions = [] } = dashboardData;

    // Check for forecast intent
    if (hasForecastKeywords(normalizedQuery)) {
        const forecastMatch = matchForecastArea(normalizedQuery, forecastAreas);
        if (forecastMatch) {
            return {
                type: 'forecast',
                data: forecastMatch,
                query: query
            };
        }
    }

    // Check for OTIF/department intent
    if (hasOTIFKeywords(normalizedQuery)) {
        const deptMatch = matchDepartment(normalizedQuery, departments);
        if (deptMatch) {
            return {
                type: 'department',
                data: deptMatch,
                query: query
            };
        }
    }

    // Check for decision action intent
    const actionMatch = matchDecisionAction(normalizedQuery, decisionActions);
    if (actionMatch) {
        return {
            type: 'decision_action',
            data: actionMatch,
            query: query
        };
    }

    // Try department match without OTIF keyword
    const deptMatch = matchDepartment(normalizedQuery, departments);
    if (deptMatch) {
        return {
            type: 'department',
            data: deptMatch,
            query: query
        };
    }

    // Try forecast match without forecast keyword
    const forecastMatch = matchForecastArea(normalizedQuery, forecastAreas);
    if (forecastMatch) {
        return {
            type: 'forecast',
            data: forecastMatch,
            query: query
        };
    }

    // No match found
    return {
        type: 'no_match',
        data: null,
        query: query
    };
};

export default {
    parseSearchQuery,
    normalizeQuery,
    hasForecastKeywords,
    hasOTIFKeywords,
    matchDepartment,
    matchForecastArea,
    matchDecisionAction
};
