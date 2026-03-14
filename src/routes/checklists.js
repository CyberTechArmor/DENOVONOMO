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
 * GET /location/:locationId - Get all checklist items for a location
 */
router.get('/location/:locationId', async (req, res) => {
  try {
    const { locationId } = req.params;

    const result = await query(
      `SELECT ci.*,
              u.display_name AS assigned_to_name,
              cu.display_name AS completed_by_name,
              (SELECT COUNT(*) FROM checklist_comments cc WHERE cc.checklist_item_id = ci.id) AS comment_count
       FROM checklist_items ci
       LEFT JOIN users u ON u.id = ci.assigned_to
       LEFT JOIN users cu ON cu.id = ci.completed_by
       WHERE ci.location_id = $1
       ORDER BY ci.sort_order ASC, ci.created_at ASC`,
      [locationId]
    );

    res.json({ items: result.rows });
  } catch (err) {
    console.error('Error listing checklist items:', err.message);
    res.status(500).json({ error: 'Failed to list checklist items' });
  }
});

/**
 * POST /location/:locationId - Create a checklist item
 */
router.post('/location/:locationId', requireRole('editor'), async (req, res) => {
  try {
    const { locationId } = req.params;
    const { title, description, category, status, assigned_to, priority, due_date, sort_order, decision_id } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const id = uuidv4();

    // Get next sort_order if not provided
    let order = sort_order;
    if (order === undefined || order === null) {
      const maxOrder = await query(
        'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM checklist_items WHERE location_id = $1',
        [locationId]
      );
      order = maxOrder.rows[0].next_order;
    }

    const result = await query(
      `INSERT INTO checklist_items (id, location_id, decision_id, category, title, description, status, assigned_to, priority, due_date, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        id, locationId, decision_id || null, category || null,
        title, description || null, status || 'backlog',
        assigned_to || null, priority || 'medium',
        due_date || null, order,
      ]
    );

    await logAudit(req.user.id, 'create', 'checklist_item', id, { title, location_id: locationId }, req.ip);

    res.status(201).json({ item: result.rows[0] });
  } catch (err) {
    console.error('Error creating checklist item:', err.message);
    res.status(500).json({ error: 'Failed to create checklist item' });
  }
});

/**
 * POST /location/:locationId/generate - Auto-generate checklist items from decided decisions
 */
router.post('/location/:locationId/generate', requireRole('editor'), async (req, res) => {
  try {
    const { locationId } = req.params;

    // Get all decided decisions that don't already have checklist items
    const decisions = await query(
      `SELECT d.*
       FROM decisions d
       WHERE d.location_id = $1
         AND d.status = 'decided'
         AND NOT EXISTS (
           SELECT 1 FROM checklist_items ci WHERE ci.decision_id = d.id
         )
       ORDER BY d.category, d.subcategory, d.item_key`,
      [locationId]
    );

    if (decisions.rows.length === 0) {
      return res.json({ message: 'No new items to generate', items: [] });
    }

    // Get current max sort_order
    const maxOrder = await query(
      'SELECT COALESCE(MAX(sort_order), -1) AS max_order FROM checklist_items WHERE location_id = $1',
      [locationId]
    );
    let nextOrder = maxOrder.rows[0].max_order + 1;

    const generatedItems = [];
    for (const decision of decisions.rows) {
      const id = uuidv4();
      const title = `${decision.item_key}: ${decision.selected_option || decision.decision_summary || 'Implement decision'}`;

      const result = await query(
        `INSERT INTO checklist_items (id, location_id, decision_id, category, title, description, status, priority, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, 'todo', 'medium', $7)
         RETURNING *`,
        [
          id, locationId, decision.id,
          decision.category || null,
          title.substring(0, 255),
          `Auto-generated from decision: ${decision.decision_summary || decision.item_key}. ${decision.reasoning || ''}`.trim(),
          nextOrder++,
        ]
      );

      generatedItems.push(result.rows[0]);
    }

    await logAudit(req.user.id, 'generate', 'checklist_item', null, { location_id: locationId, count: generatedItems.length }, req.ip);

    res.status(201).json({ message: `Generated ${generatedItems.length} checklist items`, items: generatedItems });
  } catch (err) {
    console.error('Error generating checklist items:', err.message);
    res.status(500).json({ error: 'Failed to generate checklist items' });
  }
});

/**
 * PUT /:id - Update checklist item
 */
router.put('/:id', requireRole('editor'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assigned_to, priority, due_date, sort_order, category } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    const fields = { title, description, status, assigned_to, priority, due_date, sort_order, category };

    for (const [field, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates.push(`${field} = $${paramIndex++}`);
        values.push(value);
      }
    }

    // Handle completion tracking
    if (status === 'done') {
      updates.push(`completed_at = NOW()`);
      updates.push(`completed_by = $${paramIndex++}`);
      values.push(req.user.id);
    } else if (status && status !== 'done') {
      updates.push(`completed_at = NULL`);
      updates.push(`completed_by = NULL`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const result = await query(
      `UPDATE checklist_items SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    await logAudit(req.user.id, 'update', 'checklist_item', id, { status }, req.ip);

    res.json({ item: result.rows[0] });
  } catch (err) {
    console.error('Error updating checklist item:', err.message);
    res.status(500).json({ error: 'Failed to update checklist item' });
  }
});

/**
 * PATCH /:id/status - Quick status update (for drag-and-drop)
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, sort_order } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const validStatuses = ['backlog', 'todo', 'in_progress', 'blocked', 'review', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const setClauses = ['status = $1'];
    const values = [status];
    let paramIndex = 2;

    if (sort_order !== undefined && sort_order !== null) {
      setClauses.push(`sort_order = $${paramIndex++}`);
      values.push(sort_order);
    }

    if (status === 'done') {
      setClauses.push(`completed_at = NOW()`);
      setClauses.push(`completed_by = $${paramIndex++}`);
      values.push(req.user.id);
    } else {
      setClauses.push(`completed_at = NULL`);
      setClauses.push(`completed_by = NULL`);
    }

    values.push(id);
    const result = await query(
      `UPDATE checklist_items SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    await logAudit(req.user.id, 'status_change', 'checklist_item', id, { status, sort_order }, req.ip);

    res.json({ item: result.rows[0] });
  } catch (err) {
    console.error('Error updating status:', err.message);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

/**
 * DELETE /:id - Delete checklist item
 */
router.delete('/:id', requireRole('editor'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM checklist_items WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    await logAudit(req.user.id, 'delete', 'checklist_item', id, null, req.ip);

    res.json({ message: 'Checklist item deleted' });
  } catch (err) {
    console.error('Error deleting checklist item:', err.message);
    res.status(500).json({ error: 'Failed to delete checklist item' });
  }
});

/**
 * GET /:id/comments - Get comments for a checklist item
 */
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT cc.*, u.display_name AS author_name
       FROM checklist_comments cc
       LEFT JOIN users u ON u.id = cc.author_id
       WHERE cc.checklist_item_id = $1
       ORDER BY cc.created_at ASC`,
      [id]
    );

    res.json({ comments: result.rows });
  } catch (err) {
    console.error('Error listing comments:', err.message);
    res.status(500).json({ error: 'Failed to list comments' });
  }
});

/**
 * POST /:id/comments - Add a comment to a checklist item
 */
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'content is required' });
    }

    // Verify checklist item exists
    const item = await query('SELECT id FROM checklist_items WHERE id = $1', [id]);
    if (item.rows.length === 0) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    const commentId = uuidv4();
    const result = await query(
      `INSERT INTO checklist_comments (id, checklist_item_id, author_id, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [commentId, id, req.user.id, content.trim()]
    );

    await logAudit(req.user.id, 'create', 'checklist_comment', commentId, { checklist_item_id: id }, req.ip);

    res.status(201).json({ comment: result.rows[0] });
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

/**
 * POST /location/:locationId/reorder - Batch update sort_order for items
 */
router.post('/location/:locationId/reorder', requireRole('editor'), async (req, res) => {
  try {
    const { locationId } = req.params;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items array is required with {id, sort_order} entries' });
    }

    // Validate all items have id and sort_order
    for (const item of items) {
      if (!item.id || item.sort_order === undefined) {
        return res.status(400).json({ error: 'Each item must have id and sort_order' });
      }
    }

    // Update each item's sort_order
    for (const item of items) {
      await query(
        'UPDATE checklist_items SET sort_order = $1 WHERE id = $2 AND location_id = $3',
        [item.sort_order, item.id, locationId]
      );
    }

    await logAudit(req.user.id, 'reorder', 'checklist_item', null, { location_id: locationId, count: items.length }, req.ip);

    res.json({ message: `Reordered ${items.length} items` });
  } catch (err) {
    console.error('Error reordering items:', err.message);
    res.status(500).json({ error: 'Failed to reorder items' });
  }
});

module.exports = router;
