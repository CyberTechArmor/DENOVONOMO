'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { requireAuth, loadUser } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

router.use(requireAuth, loadUser);

/**
 * GET /location/:locationId - Get all cost entries for a location
 */
router.get('/location/:locationId', async (req, res) => {
  try {
    const { locationId } = req.params;

    const result = await query(
      `SELECT * FROM cost_entries
       WHERE location_id = $1
       ORDER BY category, created_at DESC`,
      [locationId]
    );

    res.json({ costs: result.rows });
  } catch (err) {
    console.error('Error listing cost entries:', err.message);
    res.status(500).json({ error: 'Failed to list cost entries' });
  }
});

/**
 * GET /location/:locationId/summary - Aggregated costs by category and type
 */
router.get('/location/:locationId/summary', async (req, res) => {
  try {
    const { locationId } = req.params;

    // By category
    const byCategory = await query(
      `SELECT category,
              SUM(CASE WHEN cost_type = 'one_time' THEN amount ELSE 0 END) AS one_time_total,
              SUM(CASE WHEN cost_type = 'monthly' THEN amount ELSE 0 END) AS monthly_total,
              SUM(CASE WHEN cost_type = 'annual' THEN amount ELSE 0 END) AS annual_total,
              SUM(amount) AS total,
              COUNT(*) AS entry_count
       FROM cost_entries
       WHERE location_id = $1
       GROUP BY category
       ORDER BY total DESC`,
      [locationId]
    );

    // By type
    const byType = await query(
      `SELECT cost_type,
              SUM(amount) AS total,
              COUNT(*) AS entry_count,
              SUM(CASE WHEN is_estimated THEN amount ELSE 0 END) AS estimated_total,
              SUM(CASE WHEN NOT is_estimated THEN amount ELSE 0 END) AS actual_total
       FROM cost_entries
       WHERE location_id = $1
       GROUP BY cost_type`,
      [locationId]
    );

    // Grand totals
    const totals = await query(
      `SELECT
         SUM(amount) AS grand_total,
         SUM(CASE WHEN cost_type = 'one_time' THEN amount ELSE 0 END) AS one_time_total,
         SUM(CASE WHEN cost_type = 'monthly' THEN amount ELSE 0 END) AS monthly_total,
         SUM(CASE WHEN cost_type = 'annual' THEN amount ELSE 0 END) AS annual_total,
         COUNT(*) AS entry_count
       FROM cost_entries
       WHERE location_id = $1`,
      [locationId]
    );

    res.json({
      by_category: byCategory.rows,
      by_type: byType.rows,
      totals: totals.rows[0],
    });
  } catch (err) {
    console.error('Error fetching cost summary:', err.message);
    res.status(500).json({ error: 'Failed to fetch cost summary' });
  }
});

/**
 * POST /location/:locationId - Create a cost entry
 */
router.post('/location/:locationId', requireRole('editor'), async (req, res) => {
  try {
    const { locationId } = req.params;
    const { category, vendor_name, description, cost_type, amount, start_date, end_date, is_estimated } = req.body;

    if (!cost_type || amount === undefined || amount === null) {
      return res.status(400).json({ error: 'cost_type and amount are required' });
    }

    const validTypes = ['one_time', 'monthly', 'annual'];
    if (!validTypes.includes(cost_type)) {
      return res.status(400).json({ error: `Invalid cost_type. Must be one of: ${validTypes.join(', ')}` });
    }

    const id = uuidv4();
    const result = await query(
      `INSERT INTO cost_entries (id, location_id, category, vendor_name, description, cost_type, amount, start_date, end_date, is_estimated)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        id, locationId, category || null, vendor_name || null,
        description || null, cost_type, amount,
        start_date || null, end_date || null,
        is_estimated !== undefined ? is_estimated : true,
      ]
    );

    await logAudit(req.user.id, 'create', 'cost_entry', id, { location_id: locationId, cost_type, amount }, req.ip);

    res.status(201).json({ cost: result.rows[0] });
  } catch (err) {
    console.error('Error creating cost entry:', err.message);
    res.status(500).json({ error: 'Failed to create cost entry' });
  }
});

/**
 * PUT /:id - Update a cost entry
 */
router.put('/:id', requireRole('editor'), async (req, res) => {
  try {
    const { id } = req.params;
    const { category, vendor_name, description, cost_type, amount, start_date, end_date, is_estimated } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    const fields = { category, vendor_name, description, cost_type, amount, start_date, end_date, is_estimated };

    for (const [field, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates.push(`${field} = $${paramIndex++}`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const result = await query(
      `UPDATE cost_entries SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cost entry not found' });
    }

    await logAudit(req.user.id, 'update', 'cost_entry', id, { cost_type, amount }, req.ip);

    res.json({ cost: result.rows[0] });
  } catch (err) {
    console.error('Error updating cost entry:', err.message);
    res.status(500).json({ error: 'Failed to update cost entry' });
  }
});

/**
 * DELETE /:id - Delete a cost entry
 */
router.delete('/:id', requireRole('editor'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM cost_entries WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cost entry not found' });
    }

    await logAudit(req.user.id, 'delete', 'cost_entry', id, null, req.ip);

    res.json({ message: 'Cost entry deleted' });
  } catch (err) {
    console.error('Error deleting cost entry:', err.message);
    res.status(500).json({ error: 'Failed to delete cost entry' });
  }
});

module.exports = router;
