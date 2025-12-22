/**
 * User Role Utilities
 * Handles user role detection and permissions
 */

export const USER_ROLES = {
    ADMIN: 'admin',
    MANAGEMENT: 'management'
};

/**
 * Get user role based on email
 * @param {string} email - User email address
 * @returns {string} User role (admin or management)
 */
export const getUserRole = (email) => {
    if (!email) return USER_ROLES.ADMIN;

    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === 'management@experienceflow.ai') {
        return USER_ROLES.MANAGEMENT;
    }

    // Default to admin for all other users
    return USER_ROLES.ADMIN;
};

/**
 * Check if user is a management user
 * @param {string} email - User email address
 * @returns {boolean} True if management user
 */
export const isManagementUser = (email) => {
    return getUserRole(email) === USER_ROLES.MANAGEMENT;
};

/**
 * Check if user is an admin user
 * @param {string} email - User email address
 * @returns {boolean} True if admin user
 */
export const isAdminUser = (email) => {
    return getUserRole(email) === USER_ROLES.ADMIN;
};
