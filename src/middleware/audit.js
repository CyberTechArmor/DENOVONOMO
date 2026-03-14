'use strict';

const { query } = require('../config/database');

/**
 * Directly log an audit event to the audit_log table.
 *
 * @param {number|null} userId - The user who performed the action
 * @param {string} action - Action name (e.g., 'create', 'update', 'delete')
 * @param {string} entityType - Entity type (e.g., 'document', 'user')
 * @param {number|string|null} entityId - ID of the affected entity
 * @param {object|null} details - Additional details object (stored as JSONB)
 * @param {string|null} ipAddress - IP address of the request
 */
async function logAudit(userId, action, entityType, entityId, details, ipAddress) {
  try {
    await query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, details, ip_address, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [userId, action, entityType, entityId, details ? JSON.stringify(details) : null, ipAddress]
    );
  } catch (err) {
    // Audit logging should never crash the request
    console.error('Audit log error:', err.message);
  }
}

/**
 * Returns Express middleware that logs an audit event after the response is sent.
 *
 * @param {string} action - Action name
 * @param {string} entityType - Entity type
 * @returns {Function} Express middleware
 */
function auditLog(action, entityType) {
  return (req, res, next) => {
    // Log after the response finishes so we don't block the request
    res.on('finish', () => {
      const userId = req.user ? req.user.id : (req.session ? req.session.userId : null);
      const entityId = req.params.id || null;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const details = {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
      };

      logAudit(userId, action, entityType, entityId, details, ipAddress);
    });

    next();
  };
}

module.exports = { auditLog, logAudit };
