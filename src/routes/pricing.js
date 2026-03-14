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
 * GET / - List pricing entries with filters
 */
router.get('/', async (req, res) => {
  try {
    const { category, vendor, stale_only } = req.query;
    const conditions = ['rp.is_active = TRUE'];
    const values = [];
    let paramIndex = 1;

    if (category) {
      conditions.push(`rp.category = $${paramIndex++}`);
      values.push(category);
    }
    if (vendor) {
      conditions.push(`rp.vendor_name ILIKE $${paramIndex++}`);
      values.push(`%${vendor}%`);
    }
    if (stale_only === 'true') {
      conditions.push(`(rp.verified_at IS NULL OR rp.verified_at < NOW() - INTERVAL '6 months')`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT rp.*, u.display_name AS verified_by_name
       FROM reference_pricing rp
       LEFT JOIN users u ON u.id = rp.verified_by
       ${whereClause}
       ORDER BY rp.category, rp.subcategory, rp.item_key`,
      values
    );

    res.json({ pricing: result.rows });
  } catch (err) {
    console.error('Error listing pricing:', err.message);
    res.status(500).json({ error: 'Failed to list pricing entries' });
  }
});

/**
 * GET /export - CSV export of pricing data
 */
router.get('/export', async (req, res) => {
  try {
    const result = await query(
      `SELECT category, subcategory, item_key, vendor_name, product_name, product_url,
              cost_onetime_low, cost_onetime_high, cost_monthly_low, cost_monthly_high,
              cost_annual_low, cost_annual_high, notes, source, verified_at
       FROM reference_pricing
       WHERE is_active = TRUE
       ORDER BY category, subcategory, item_key`
    );

    const headers = [
      'category', 'subcategory', 'item_key', 'vendor_name', 'product_name', 'product_url',
      'cost_onetime_low', 'cost_onetime_high', 'cost_monthly_low', 'cost_monthly_high',
      'cost_annual_low', 'cost_annual_high', 'notes', 'source', 'verified_at',
    ];

    let csv = headers.join(',') + '\n';
    for (const row of result.rows) {
      const line = headers.map((h) => {
        const val = row[h];
        if (val == null) return '';
        const str = String(val);
        // Escape CSV values that contain commas, quotes, or newlines
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      });
      csv += line.join(',') + '\n';
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="reference_pricing.csv"');
    res.send(csv);
  } catch (err) {
    console.error('Error exporting pricing:', err.message);
    res.status(500).json({ error: 'Failed to export pricing data' });
  }
});

/**
 * GET /:id - Get single pricing entry
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT rp.*, u.display_name AS verified_by_name
       FROM reference_pricing rp
       LEFT JOIN users u ON u.id = rp.verified_by
       WHERE rp.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pricing entry not found' });
    }

    res.json({ pricing: result.rows[0] });
  } catch (err) {
    console.error('Error fetching pricing:', err.message);
    res.status(500).json({ error: 'Failed to fetch pricing entry' });
  }
});

/**
 * POST / - Create a pricing entry (super_admin/editor)
 */
router.post('/', requireRole('editor'), async (req, res) => {
  try {
    const {
      category, subcategory, item_key, vendor_name, product_name, product_url,
      cost_onetime_low, cost_onetime_high, cost_monthly_low, cost_monthly_high,
      cost_annual_low, cost_annual_high, notes, source,
    } = req.body;

    if (!item_key) {
      return res.status(400).json({ error: 'item_key is required' });
    }

    // Check for duplicate item_key
    const existing = await query('SELECT id FROM reference_pricing WHERE item_key = $1', [item_key]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'A pricing entry with this item_key already exists' });
    }

    const id = uuidv4();
    const result = await query(
      `INSERT INTO reference_pricing (id, category, subcategory, item_key, vendor_name, product_name, product_url,
         cost_onetime_low, cost_onetime_high, cost_monthly_low, cost_monthly_high,
         cost_annual_low, cost_annual_high, notes, source, verified_at, verified_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), $16)
       RETURNING *`,
      [
        id, category || null, subcategory || null, item_key,
        vendor_name || null, product_name || null, product_url || null,
        cost_onetime_low != null ? cost_onetime_low : null,
        cost_onetime_high != null ? cost_onetime_high : null,
        cost_monthly_low != null ? cost_monthly_low : null,
        cost_monthly_high != null ? cost_monthly_high : null,
        cost_annual_low != null ? cost_annual_low : null,
        cost_annual_high != null ? cost_annual_high : null,
        notes || null, source || null, req.user.id,
      ]
    );

    await logAudit(req.user.id, 'create', 'reference_pricing', id, { item_key }, req.ip);

    res.status(201).json({ pricing: result.rows[0] });
  } catch (err) {
    console.error('Error creating pricing:', err.message);
    res.status(500).json({ error: 'Failed to create pricing entry' });
  }
});

/**
 * PUT /:id - Update a pricing entry
 */
router.put('/:id', requireRole('editor'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category, subcategory, vendor_name, product_name, product_url,
      cost_onetime_low, cost_onetime_high, cost_monthly_low, cost_monthly_high,
      cost_annual_low, cost_annual_high, notes, source,
    } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    const fields = {
      category, subcategory, vendor_name, product_name, product_url,
      cost_onetime_low, cost_onetime_high, cost_monthly_low, cost_monthly_high,
      cost_annual_low, cost_annual_high, notes, source,
    };

    for (const [field, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates.push(`${field} = $${paramIndex++}`);
        values.push(value);
      }
    }

    // Mark as verified on update
    updates.push(`verified_at = NOW()`);
    updates.push(`verified_by = $${paramIndex++}`);
    values.push(req.user.id);

    if (updates.length === 2) {
      // Only verified_at and verified_by, no actual data changes
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const result = await query(
      `UPDATE reference_pricing SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pricing entry not found' });
    }

    await logAudit(req.user.id, 'update', 'reference_pricing', id, null, req.ip);

    res.json({ pricing: result.rows[0] });
  } catch (err) {
    console.error('Error updating pricing:', err.message);
    res.status(500).json({ error: 'Failed to update pricing entry' });
  }
});

/**
 * DELETE /:id - Deactivate a pricing entry
 */
router.delete('/:id', requireRole('editor'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE reference_pricing SET is_active = FALSE WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pricing entry not found' });
    }

    await logAudit(req.user.id, 'deactivate', 'reference_pricing', id, null, req.ip);

    res.json({ message: 'Pricing entry deactivated', pricing: result.rows[0] });
  } catch (err) {
    console.error('Error deactivating pricing:', err.message);
    res.status(500).json({ error: 'Failed to deactivate pricing entry' });
  }
});

/**
 * POST /import - CSV import (parse CSV body, upsert entries)
 */
router.post('/import', requireRole('editor'), async (req, res) => {
  try {
    const { csv } = req.body;

    if (!csv || typeof csv !== 'string') {
      return res.status(400).json({ error: 'csv string is required in request body' });
    }

    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV must have a header row and at least one data row' });
    }

    // Parse header
    const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
    const keyIndex = headers.indexOf('item_key');
    if (keyIndex === -1) {
      return res.status(400).json({ error: 'CSV must contain an item_key column' });
    }

    const results = { created: 0, updated: 0, errors: [] };

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      try {
        const values = parseCsvLine(lines[i]);
        const row = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx] !== undefined ? values[idx].trim() : null;
        });

        if (!row.item_key) {
          results.errors.push({ line: i + 1, error: 'Missing item_key' });
          continue;
        }

        // Check if entry exists
        const existing = await query(
          'SELECT id FROM reference_pricing WHERE item_key = $1',
          [row.item_key]
        );

        const numericFields = [
          'cost_onetime_low', 'cost_onetime_high', 'cost_monthly_low', 'cost_monthly_high',
          'cost_annual_low', 'cost_annual_high',
        ];

        for (const f of numericFields) {
          row[f] = row[f] && row[f] !== '' ? parseFloat(row[f]) : null;
        }

        if (existing.rows.length > 0) {
          // Update
          await query(
            `UPDATE reference_pricing SET
               category = COALESCE($1, category),
               subcategory = COALESCE($2, subcategory),
               vendor_name = COALESCE($3, vendor_name),
               product_name = COALESCE($4, product_name),
               product_url = COALESCE($5, product_url),
               cost_onetime_low = COALESCE($6, cost_onetime_low),
               cost_onetime_high = COALESCE($7, cost_onetime_high),
               cost_monthly_low = COALESCE($8, cost_monthly_low),
               cost_monthly_high = COALESCE($9, cost_monthly_high),
               cost_annual_low = COALESCE($10, cost_annual_low),
               cost_annual_high = COALESCE($11, cost_annual_high),
               notes = COALESCE($12, notes),
               source = COALESCE($13, source),
               verified_at = NOW(),
               verified_by = $14
             WHERE id = $15`,
            [
              row.category || null, row.subcategory || null,
              row.vendor_name || null, row.product_name || null, row.product_url || null,
              row.cost_onetime_low, row.cost_onetime_high,
              row.cost_monthly_low, row.cost_monthly_high,
              row.cost_annual_low, row.cost_annual_high,
              row.notes || null, row.source || null,
              req.user.id, existing.rows[0].id,
            ]
          );
          results.updated++;
        } else {
          // Insert
          const id = uuidv4();
          await query(
            `INSERT INTO reference_pricing (id, category, subcategory, item_key, vendor_name, product_name, product_url,
               cost_onetime_low, cost_onetime_high, cost_monthly_low, cost_monthly_high,
               cost_annual_low, cost_annual_high, notes, source, verified_at, verified_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), $16)`,
            [
              id, row.category || null, row.subcategory || null, row.item_key,
              row.vendor_name || null, row.product_name || null, row.product_url || null,
              row.cost_onetime_low, row.cost_onetime_high,
              row.cost_monthly_low, row.cost_monthly_high,
              row.cost_annual_low, row.cost_annual_high,
              row.notes || null, row.source || null, req.user.id,
            ]
          );
          results.created++;
        }
      } catch (lineErr) {
        results.errors.push({ line: i + 1, error: lineErr.message });
      }
    }

    await logAudit(req.user.id, 'import', 'reference_pricing', null, results, req.ip);

    res.json({
      message: `Import complete: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors`,
      results,
    });
  } catch (err) {
    console.error('Error importing pricing:', err.message);
    res.status(500).json({ error: 'Failed to import pricing data' });
  }
});

/**
 * Simple CSV line parser that handles quoted fields.
 */
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }

  result.push(current);
  return result;
}

module.exports = router;
