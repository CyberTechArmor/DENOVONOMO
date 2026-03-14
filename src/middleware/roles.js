'use strict';

/**
 * Role hierarchy: super_admin > editor > viewer
 * A higher role implicitly includes all lower role permissions.
 */
const ROLE_HIERARCHY = {
  super_admin: 3,
  editor: 2,
  viewer: 1,
};

/**
 * Returns middleware that checks whether req.user.role is among the allowed roles.
 * Uses hierarchy: if a user has a higher role than required, access is granted.
 *
 * @param  {...string} roles - One or more role names that are allowed
 * @returns {Function} Express middleware
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userLevel = ROLE_HIERARCHY[req.user.role];
    if (userLevel === undefined) {
      return res.status(403).json({ error: 'Unknown user role' });
    }

    // Find the minimum level required among the specified roles
    const minRequiredLevel = Math.min(
      ...roles.map((role) => ROLE_HIERARCHY[role] || Infinity)
    );

    if (userLevel >= minRequiredLevel) {
      return next();
    }

    return res.status(403).json({ error: 'Insufficient permissions' });
  };
}

module.exports = { requireRole, ROLE_HIERARCHY };
