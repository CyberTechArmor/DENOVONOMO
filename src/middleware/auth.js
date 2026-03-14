'use strict';

const { query } = require('../config/database');

/**
 * Requires an authenticated session. Returns 401 if no session userId is set.
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

/**
 * Loads the full user object from the database onto req.user.
 * Must be used after requireAuth so that req.session.userId is guaranteed.
 */
async function loadUser(req, res, next) {
  if (!req.session || !req.session.userId) {
    return next();
  }

  try {
    const result = await query(
      'SELECT id, email, display_name, role, avatar_url, totp_enabled, is_active, created_at, updated_at FROM users WHERE id = $1 AND is_active = TRUE',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error('Error loading user:', err.message);
    next(err);
  }
}

module.exports = { requireAuth, loadUser };
