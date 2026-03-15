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
 * GET / - List locations with org info and status counts
 */
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT l.*,
              o.name AS organization_name,
              o.slug AS organization_slug,
              (SELECT COUNT(*) FROM decisions d WHERE d.location_id = l.id AND d.status = 'decided') AS decisions_decided,
              (SELECT COUNT(*) FROM decisions d WHERE d.location_id = l.id) AS decisions_total,
              (SELECT COUNT(*) FROM checklist_items ci WHERE ci.location_id = l.id AND ci.status = 'done') AS checklist_done,
              (SELECT COUNT(*) FROM checklist_items ci WHERE ci.location_id = l.id) AS checklist_total
       FROM locations l
       LEFT JOIN organizations o ON o.id = l.organization_id
       ORDER BY l.created_at DESC`
    );

    res.json({ locations: result.rows });
  } catch (err) {
    console.error('Error listing locations:', err.message);
    res.status(500).json({ error: 'Failed to list locations' });
  }
});

/**
 * GET /:id - Get location detail with decision/checklist stats
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT l.*,
              o.name AS organization_name,
              o.slug AS organization_slug,
              (SELECT COUNT(*) FROM decisions d WHERE d.location_id = l.id AND d.status = 'decided') AS decisions_decided,
              (SELECT COUNT(*) FROM decisions d WHERE d.location_id = l.id) AS decisions_total,
              (SELECT COUNT(*) FROM checklist_items ci WHERE ci.location_id = l.id AND ci.status = 'done') AS checklist_done,
              (SELECT COUNT(*) FROM checklist_items ci WHERE ci.location_id = l.id) AS checklist_total
       FROM locations l
       LEFT JOIN organizations o ON o.id = l.organization_id
       WHERE l.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({ location: result.rows[0] });
  } catch (err) {
    console.error('Error fetching location:', err.message);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

/**
 * POST / - Create a location (editors+)
 */
router.post('/', requireRole('editor'), async (req, res) => {
  try {
    const { name, organization_id, address, location_type, target_go_live_date } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const validTypes = ['de_novo', 'expansion'];
    if (location_type && !validTypes.includes(location_type)) {
      return res.status(400).json({ error: `Invalid location_type. Must be one of: ${validTypes.join(', ')}` });
    }

    // Use provided org or fall back to first available org
    let orgId = organization_id || null;
    if (!orgId) {
      const defaultOrg = await query('SELECT id FROM organizations ORDER BY created_at ASC LIMIT 1');
      if (defaultOrg.rows.length > 0) {
        orgId = defaultOrg.rows[0].id;
      }
    }

    if (orgId) {
      const org = await query('SELECT id FROM organizations WHERE id = $1', [orgId]);
      if (org.rows.length === 0) {
        return res.status(404).json({ error: 'Organization not found' });
      }
    }

    const id = uuidv4();
    const result = await query(
      `INSERT INTO locations (id, name, organization_id, address, location_type, target_go_live_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, name, orgId, address || null, location_type || 'de_novo', target_go_live_date || null]
    );

    await logAudit(req.user.id, 'create', 'location', id, { name, organization_id: orgId }, req.ip);

    res.status(201).json({ location: result.rows[0] });
  } catch (err) {
    console.error('Error creating location:', err.message);
    res.status(500).json({ error: 'Failed to create location' });
  }
});

/**
 * PUT /:id - Update a location
 */
router.put('/:id', requireRole('editor'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, status, location_type, target_go_live_date,
            estimated_total_cost, actual_total_cost, estimated_revenue_monthly,
            submitted_billing_monthly, transition_start_date, transition_end_date } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    const fields = {
      name, address, status, location_type, target_go_live_date,
      estimated_total_cost, actual_total_cost, estimated_revenue_monthly,
      submitted_billing_monthly, transition_start_date, transition_end_date,
    };

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
      `UPDATE locations SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    await logAudit(req.user.id, 'update', 'location', id, fields, req.ip);

    res.json({ location: result.rows[0] });
  } catch (err) {
    console.error('Error updating location:', err.message);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

/**
 * DELETE /:id - Archive location (set status=archived)
 */
router.delete('/:id', requireRole('editor'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE locations SET status = 'archived' WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    await logAudit(req.user.id, 'archive', 'location', id, null, req.ip);

    res.json({ message: 'Location archived', location: result.rows[0] });
  } catch (err) {
    console.error('Error archiving location:', err.message);
    res.status(500).json({ error: 'Failed to archive location' });
  }
});

/**
 * GET /:id/summary - Comprehensive summary with costs, decision progress, checklist progress
 */
router.get('/:id/summary', async (req, res) => {
  try {
    const { id } = req.params;

    // Location info
    const locResult = await query(
      `SELECT l.*, o.name AS organization_name
       FROM locations l
       LEFT JOIN organizations o ON o.id = l.organization_id
       WHERE l.id = $1`,
      [id]
    );

    if (locResult.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Decision progress by category
    const decisionProgress = await query(
      `SELECT category,
              COUNT(*) AS total,
              COUNT(*) FILTER (WHERE status = 'decided') AS decided,
              COUNT(*) FILTER (WHERE status = 'pending') AS pending,
              COUNT(*) FILTER (WHERE status = 'skipped') AS skipped,
              COUNT(*) FILTER (WHERE status = 'not_applicable') AS not_applicable,
              COUNT(*) FILTER (WHERE status = 'revisit') AS revisit
       FROM decisions
       WHERE location_id = $1
       GROUP BY category
       ORDER BY category`,
      [id]
    );

    // Checklist progress by status
    const checklistProgress = await query(
      `SELECT status, COUNT(*) AS count
       FROM checklist_items
       WHERE location_id = $1
       GROUP BY status`,
      [id]
    );

    // Cost summary
    const costSummary = await query(
      `SELECT
         SUM(CASE WHEN cost_type = 'one_time' THEN amount ELSE 0 END) AS total_one_time,
         SUM(CASE WHEN cost_type = 'monthly' THEN amount ELSE 0 END) AS total_monthly,
         SUM(CASE WHEN cost_type = 'annual' THEN amount ELSE 0 END) AS total_annual,
         COUNT(*) AS entry_count
       FROM cost_entries
       WHERE location_id = $1`,
      [id]
    );

    // Decision cost totals
    const decisionCosts = await query(
      `SELECT
         COALESCE(SUM(estimated_cost_onetime), 0) AS total_onetime,
         COALESCE(SUM(estimated_cost_monthly), 0) AS total_monthly,
         COALESCE(SUM(estimated_cost_annual), 0) AS total_annual
       FROM decisions
       WHERE location_id = $1 AND status = 'decided'`,
      [id]
    );

    res.json({
      location: locResult.rows[0],
      decision_progress: decisionProgress.rows,
      checklist_progress: checklistProgress.rows,
      cost_summary: costSummary.rows[0],
      decision_costs: decisionCosts.rows[0],
    });
  } catch (err) {
    console.error('Error fetching location summary:', err.message);
    res.status(500).json({ error: 'Failed to fetch location summary' });
  }
});

module.exports = router;
