'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { requireAuth, loadUser } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

// All routes require super_admin
router.use(requireAuth, loadUser, requireRole('super_admin'));

/**
 * GET / - List all users
 */
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, display_name, role, is_active, last_login_at, totp_enabled
       FROM users
       ORDER BY created_at DESC`
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error('Error listing users:', err.message);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

/**
 * POST / - Create a new user
 */
router.post('/', async (req, res) => {
  try {
    const { email, display_name, role, password } = req.body;

    if (!email || !display_name || !password) {
      return res.status(400).json({ error: 'email, display_name, and password are required' });
    }

    const validRoles = ['super_admin', 'editor', 'viewer'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    // Check for existing email
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      `INSERT INTO users (id, email, display_name, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, display_name, role, is_active, totp_enabled, created_at`,
      [id, email, display_name, passwordHash, role || 'viewer']
    );

    await logAudit(
      req.user.id, 'create', 'user', id,
      { email, display_name, role: role || 'viewer' },
      req.ip
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * PUT /:id - Update a user
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { display_name, role, is_active } = req.body;

    const validRoles = ['super_admin', 'editor', 'viewer'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    // Build dynamic update
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (display_name !== undefined) {
      updates.push(`display_name = $${paramIndex++}`);
      values.push(display_name);
    }
    if (role !== undefined) {
      updates.push(`role = $${paramIndex++}`);
      values.push(role);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, email, display_name, role, is_active, totp_enabled`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await logAudit(
      req.user.id, 'update', 'user', id,
      { display_name, role, is_active },
      req.ip
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * DELETE /:id - Deactivate a user (soft delete)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE users SET is_active = FALSE WHERE id = $1
       RETURNING id, email, display_name, role, is_active`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await logAudit(req.user.id, 'deactivate', 'user', id, null, req.ip);

    res.json({ message: 'User deactivated', user: result.rows[0] });
  } catch (err) {
    console.error('Error deactivating user:', err.message);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

module.exports = router;
