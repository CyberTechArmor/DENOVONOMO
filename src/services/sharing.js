'use strict';

const crypto = require('crypto');
const { query } = require('../config/database');

const SHORT_CODE_LENGTH = 8;
const SHORT_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a cryptographically random alphanumeric short code.
 *
 * @returns {string} An 8-character alphanumeric code
 */
function generateShortCode() {
  const bytes = crypto.randomBytes(SHORT_CODE_LENGTH);
  let code = '';
  for (let i = 0; i < SHORT_CODE_LENGTH; i++) {
    code += SHORT_CODE_CHARS[bytes[i] % SHORT_CODE_CHARS.length];
  }
  return code;
}

/**
 * Create a share record for a document.
 *
 * @param {string} documentId - UUID of the document
 * @param {string} createdBy - UUID of the user creating the share
 * @param {string} accessLevel - 'view' or 'edit'
 * @param {string|null} expiresAt - ISO date string for expiry, or null for no expiry
 * @returns {Promise<object>} The created share record
 */
async function createShare(documentId, createdBy, accessLevel, expiresAt) {
  let shortCode;
  let attempts = 0;

  // Retry in the unlikely event of a collision
  while (attempts < 10) {
    shortCode = generateShortCode();
    const existing = await query(
      'SELECT id FROM document_shares WHERE short_code = $1',
      [shortCode]
    );
    if (existing.rows.length === 0) break;
    attempts++;
  }

  if (attempts >= 10) {
    throw new Error('Failed to generate unique short code');
  }

  const result = await query(
    `INSERT INTO document_shares (document_id, short_code, created_by, access_level, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [documentId, shortCode, createdBy, accessLevel || 'view', expiresAt || null]
  );

  return result.rows[0];
}

/**
 * Validate whether a share short code is active and not expired.
 *
 * @param {string} shortCode - The 8-character short code
 * @returns {Promise<object|null>} The share record if valid, null otherwise
 */
async function validateShare(shortCode) {
  const result = await query(
    `SELECT ds.*, d.title AS document_title, d.id AS document_id
     FROM document_shares ds
     JOIN documents d ON d.id = ds.document_id
     WHERE ds.short_code = $1
       AND ds.is_active = TRUE
       AND (ds.expires_at IS NULL OR ds.expires_at > NOW())`,
    [shortCode]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Deactivate a share record.
 *
 * @param {string} shareId - UUID of the share
 * @returns {Promise<object|null>} The updated share record, or null if not found
 */
async function revokeShare(shareId) {
  const result = await query(
    `UPDATE document_shares SET is_active = FALSE WHERE id = $1 RETURNING *`,
    [shareId]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}

module.exports = { generateShortCode, createShare, validateShare, revokeShare };
