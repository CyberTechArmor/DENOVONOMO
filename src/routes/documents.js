'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { requireAuth, loadUser } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { logAudit } = require('../middleware/audit');
const { createShare, validateShare, revokeShare } = require('../services/sharing');
const { generateDiff } = require('../services/diff');

const router = express.Router();

// --------------------------------------------------------------------------
// Public endpoint (no auth) - must be defined before the auth middleware
// --------------------------------------------------------------------------

/**
 * GET /shared/:shortCode - View a shared document via short code
 */
router.get('/shared/:shortCode', async (req, res) => {
  try {
    const share = await validateShare(req.params.shortCode);
    if (!share) {
      return res.status(404).json({ error: 'Share link not found or expired' });
    }

    const docResult = await query(
      `SELECT d.*, dv.content_md, dv.version_number, dv.created_at AS version_created_at
       FROM documents d
       LEFT JOIN document_versions dv ON dv.id = d.current_version_id
       WHERE d.id = $1`,
      [share.document_id]
    );

    if (docResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const doc = docResult.rows[0];

    // Resolve pricing tags
    doc.content_md = await resolvePricingTags(doc.content_md);

    res.json({ document: doc, share: { access_level: share.access_level } });
  } catch (err) {
    console.error('Error viewing shared document:', err.message);
    res.status(500).json({ error: 'Failed to load shared document' });
  }
});

// --------------------------------------------------------------------------
// Authenticated routes
// --------------------------------------------------------------------------
router.use(requireAuth, loadUser);

/**
 * GET / - List documents with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, search, published } = req.query;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (published === 'true') {
      conditions.push(`d.is_published = TRUE`);
    }
    if (category) {
      conditions.push(`d.category = $${paramIndex++}`);
      values.push(category);
    }
    if (subcategory) {
      conditions.push(`d.subcategory = $${paramIndex++}`);
      values.push(subcategory);
    }
    if (search) {
      conditions.push(`(d.title ILIKE $${paramIndex} OR dv.content_md ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT d.id, d.slug, d.title, d.category, d.subcategory, d.sort_order,
              d.is_published, d.current_version_id, d.created_at, d.updated_at,
              dv.version_number, dv.status AS version_status,
              dv.created_at AS version_created_at,
              u.display_name AS author_name
       FROM documents d
       LEFT JOIN document_versions dv ON dv.id = d.current_version_id
       LEFT JOIN users u ON u.id = dv.author_id
       ${whereClause}
       ORDER BY d.sort_order ASC, d.created_at DESC`,
      values
    );

    res.json({ documents: result.rows });
  } catch (err) {
    console.error('Error listing documents:', err.message);
    res.status(500).json({ error: 'Failed to list documents' });
  }
});

/**
 * GET /categories - Return distinct categories and subcategories
 */
router.get('/categories', async (req, res) => {
  try {
    const result = await query(
      `SELECT DISTINCT category, subcategory
       FROM documents
       WHERE category IS NOT NULL
       ORDER BY category, subcategory`
    );

    // Group subcategories under categories
    const categories = {};
    for (const row of result.rows) {
      if (!categories[row.category]) {
        categories[row.category] = [];
      }
      if (row.subcategory && !categories[row.category].includes(row.subcategory)) {
        categories[row.category].push(row.subcategory);
      }
    }

    res.json({ categories });
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

/**
 * GET /:id - Get single document with current version content
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT d.*, dv.content_md, dv.version_number, dv.status AS version_status,
              dv.change_summary, dv.created_at AS version_created_at,
              u.display_name AS author_name
       FROM documents d
       LEFT JOIN document_versions dv ON dv.id = d.current_version_id
       LEFT JOIN users u ON u.id = dv.author_id
       WHERE d.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const doc = result.rows[0];

    // Resolve {{price:item_key}} tags
    doc.content_md = await resolvePricingTags(doc.content_md);

    res.json({ document: doc });
  } catch (err) {
    console.error('Error fetching document:', err.message);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

/**
 * POST / - Create a new document (super_admin only)
 */
router.post('/', requireRole('super_admin'), async (req, res) => {
  try {
    const { title, slug, category, subcategory, content_md } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'title and slug are required' });
    }

    // Check for slug uniqueness
    const existing = await query('SELECT id FROM documents WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'A document with this slug already exists' });
    }

    const docId = uuidv4();
    const versionId = uuidv4();

    // Create the document
    await query(
      `INSERT INTO documents (id, slug, title, category, subcategory, current_version_id)
       VALUES ($1, $2, $3, $4, $5, NULL)`,
      [docId, slug, title, category || null, subcategory || null]
    );

    // Create the first version (approved)
    await query(
      `INSERT INTO document_versions (id, document_id, version_number, content_md, author_id, status)
       VALUES ($1, $2, 1, $3, $4, 'approved')`,
      [versionId, docId, content_md || '', req.user.id]
    );

    // Set current_version_id
    await query(
      `UPDATE documents SET current_version_id = $1 WHERE id = $2`,
      [versionId, docId]
    );

    await logAudit(req.user.id, 'create', 'document', docId, { title, slug }, req.ip);

    const result = await query(
      `SELECT d.*, dv.content_md, dv.version_number
       FROM documents d
       LEFT JOIN document_versions dv ON dv.id = d.current_version_id
       WHERE d.id = $1`,
      [docId]
    );

    res.status(201).json({ document: result.rows[0] });
  } catch (err) {
    console.error('Error creating document:', err.message);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

/**
 * POST /:id/versions - Create a new version (editors+)
 */
router.post('/:id/versions', requireRole('editor'), async (req, res) => {
  try {
    const { id } = req.params;
    const { content_md, change_summary } = req.body;

    if (content_md === undefined) {
      return res.status(400).json({ error: 'content_md is required' });
    }

    // Verify document exists
    const doc = await query('SELECT id, current_version_id FROM documents WHERE id = $1', [id]);
    if (doc.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Get the latest version number
    const latestVersion = await query(
      'SELECT MAX(version_number) AS max_version FROM document_versions WHERE document_id = $1',
      [id]
    );
    const nextVersion = (latestVersion.rows[0].max_version || 0) + 1;

    // Determine status based on role
    const status = req.user.role === 'super_admin' ? 'approved' : 'pending_review';
    const versionId = uuidv4();

    const result = await query(
      `INSERT INTO document_versions (id, document_id, version_number, content_md, change_summary, author_id, status, parent_version_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [versionId, id, nextVersion, content_md, change_summary || null, req.user.id, status, doc.rows[0].current_version_id]
    );

    // If super_admin, auto-approve and update current_version_id
    if (status === 'approved') {
      await query(
        'UPDATE documents SET current_version_id = $1 WHERE id = $2',
        [versionId, id]
      );
    }

    await logAudit(req.user.id, 'create', 'document_version', versionId, { document_id: id, version_number: nextVersion, status }, req.ip);

    res.status(201).json({ version: result.rows[0] });
  } catch (err) {
    console.error('Error creating version:', err.message);
    res.status(500).json({ error: 'Failed to create version' });
  }
});

/**
 * GET /:id/versions - List all versions for a document
 */
router.get('/:id/versions', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT dv.*, u.display_name AS author_name,
              r.display_name AS reviewer_name
       FROM document_versions dv
       LEFT JOIN users u ON u.id = dv.author_id
       LEFT JOIN users r ON r.id = dv.reviewed_by
       WHERE dv.document_id = $1
       ORDER BY dv.version_number DESC`,
      [id]
    );

    res.json({ versions: result.rows });
  } catch (err) {
    console.error('Error listing versions:', err.message);
    res.status(500).json({ error: 'Failed to list versions' });
  }
});

/**
 * GET /:id/versions/:versionId - Get specific version
 */
router.get('/:id/versions/:versionId', async (req, res) => {
  try {
    const { id, versionId } = req.params;

    const result = await query(
      `SELECT dv.*, u.display_name AS author_name
       FROM document_versions dv
       LEFT JOIN users u ON u.id = dv.author_id
       WHERE dv.id = $1 AND dv.document_id = $2`,
      [versionId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Version not found' });
    }

    res.json({ version: result.rows[0] });
  } catch (err) {
    console.error('Error fetching version:', err.message);
    res.status(500).json({ error: 'Failed to fetch version' });
  }
});

/**
 * POST /:id/versions/:versionId/approve - Approve a version (super_admin only)
 */
router.post('/:id/versions/:versionId/approve', requireRole('super_admin'), async (req, res) => {
  try {
    const { id, versionId } = req.params;

    const result = await query(
      `UPDATE document_versions
       SET status = 'approved', reviewed_by = $1, reviewed_at = NOW()
       WHERE id = $2 AND document_id = $3
       RETURNING *`,
      [req.user.id, versionId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Version not found' });
    }

    // Update document current_version_id
    await query(
      'UPDATE documents SET current_version_id = $1 WHERE id = $2',
      [versionId, id]
    );

    await logAudit(req.user.id, 'approve', 'document_version', versionId, { document_id: id }, req.ip);

    res.json({ version: result.rows[0] });
  } catch (err) {
    console.error('Error approving version:', err.message);
    res.status(500).json({ error: 'Failed to approve version' });
  }
});

/**
 * POST /:id/versions/:versionId/reject - Reject a version (super_admin only)
 */
router.post('/:id/versions/:versionId/reject', requireRole('super_admin'), async (req, res) => {
  try {
    const { id, versionId } = req.params;
    const { comment } = req.body;

    const result = await query(
      `UPDATE document_versions
       SET status = 'rejected', reviewed_by = $1, reviewed_at = NOW(), change_summary = COALESCE($2, change_summary)
       WHERE id = $3 AND document_id = $4
       RETURNING *`,
      [req.user.id, comment || null, versionId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Version not found' });
    }

    await logAudit(req.user.id, 'reject', 'document_version', versionId, { document_id: id, comment }, req.ip);

    res.json({ version: result.rows[0] });
  } catch (err) {
    console.error('Error rejecting version:', err.message);
    res.status(500).json({ error: 'Failed to reject version' });
  }
});

/**
 * GET /:id/versions/:versionId/diff - Diff between this version and current
 */
router.get('/:id/versions/:versionId/diff', async (req, res) => {
  try {
    const { id, versionId } = req.params;

    // Get the target version
    const targetResult = await query(
      'SELECT content_md, version_number FROM document_versions WHERE id = $1 AND document_id = $2',
      [versionId, id]
    );
    if (targetResult.rows.length === 0) {
      return res.status(404).json({ error: 'Version not found' });
    }

    // Get the current version
    const currentResult = await query(
      `SELECT dv.content_md, dv.version_number
       FROM documents d
       JOIN document_versions dv ON dv.id = d.current_version_id
       WHERE d.id = $1`,
      [id]
    );

    const currentContent = currentResult.rows.length > 0 ? currentResult.rows[0].content_md : '';
    const targetContent = targetResult.rows[0].content_md || '';

    const diff = generateDiff(currentContent, targetContent);

    res.json({
      diff,
      current_version: currentResult.rows.length > 0 ? currentResult.rows[0].version_number : null,
      target_version: targetResult.rows[0].version_number,
    });
  } catch (err) {
    console.error('Error generating diff:', err.message);
    res.status(500).json({ error: 'Failed to generate diff' });
  }
});

// --------------------------------------------------------------------------
// Sharing routes
// --------------------------------------------------------------------------

/**
 * POST /:id/shares - Create a sharing link
 */
router.post('/:id/shares', async (req, res) => {
  try {
    const { id } = req.params;
    const { access_level, expires_at } = req.body;

    // Verify document exists
    const doc = await query('SELECT id FROM documents WHERE id = $1', [id]);
    if (doc.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const share = await createShare(id, req.user.id, access_level, expires_at);

    await logAudit(req.user.id, 'create', 'document_share', share.id, { document_id: id }, req.ip);

    res.status(201).json({ share });
  } catch (err) {
    console.error('Error creating share:', err.message);
    res.status(500).json({ error: 'Failed to create share' });
  }
});

/**
 * GET /:id/shares - List all shares for a document
 */
router.get('/:id/shares', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT ds.*, u.display_name AS created_by_name
       FROM document_shares ds
       LEFT JOIN users u ON u.id = ds.created_by
       WHERE ds.document_id = $1
       ORDER BY ds.created_at DESC`,
      [id]
    );

    res.json({ shares: result.rows });
  } catch (err) {
    console.error('Error listing shares:', err.message);
    res.status(500).json({ error: 'Failed to list shares' });
  }
});

/**
 * DELETE /:id/shares/:shareId - Revoke a share
 */
router.delete('/:id/shares/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;

    const share = await revokeShare(shareId);
    if (!share) {
      return res.status(404).json({ error: 'Share not found' });
    }

    await logAudit(req.user.id, 'revoke', 'document_share', shareId, null, req.ip);

    res.json({ message: 'Share revoked', share });
  } catch (err) {
    console.error('Error revoking share:', err.message);
    res.status(500).json({ error: 'Failed to revoke share' });
  }
});

// --------------------------------------------------------------------------
// Access control routes
// --------------------------------------------------------------------------

/**
 * POST /:id/access - Grant user access
 */
router.post('/:id/access', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, access_level } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const validLevels = ['view', 'edit'];
    if (access_level && !validLevels.includes(access_level)) {
      return res.status(400).json({ error: `Invalid access_level. Must be one of: ${validLevels.join(', ')}` });
    }

    const result = await query(
      `INSERT INTO document_user_access (document_id, user_id, access_level, granted_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, user_id, access_level || 'view', req.user.id]
    );

    await logAudit(req.user.id, 'grant_access', 'document_user_access', result.rows[0].id, { document_id: id, user_id, access_level }, req.ip);

    res.status(201).json({ access: result.rows[0] });
  } catch (err) {
    console.error('Error granting access:', err.message);
    res.status(500).json({ error: 'Failed to grant access' });
  }
});

/**
 * DELETE /:id/access/:accessId - Revoke user access
 */
router.delete('/:id/access/:accessId', async (req, res) => {
  try {
    const { accessId } = req.params;

    const result = await query(
      'DELETE FROM document_user_access WHERE id = $1 RETURNING *',
      [accessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Access record not found' });
    }

    await logAudit(req.user.id, 'revoke_access', 'document_user_access', accessId, null, req.ip);

    res.json({ message: 'Access revoked' });
  } catch (err) {
    console.error('Error revoking access:', err.message);
    res.status(500).json({ error: 'Failed to revoke access' });
  }
});

// --------------------------------------------------------------------------
// Helper: resolve {{price:item_key}} tags
// --------------------------------------------------------------------------
async function resolvePricingTags(contentMd) {
  if (!contentMd) return contentMd;

  const priceTagRegex = /\{\{price:([^}]+)\}\}/g;
  const matches = [...contentMd.matchAll(priceTagRegex)];

  if (matches.length === 0) return contentMd;

  const itemKeys = matches.map((m) => m[1].trim());
  const uniqueKeys = [...new Set(itemKeys)];

  const placeholders = uniqueKeys.map((_, i) => `$${i + 1}`).join(', ');
  const result = await query(
    `SELECT item_key, vendor_name, product_name,
            cost_onetime_low, cost_onetime_high,
            cost_monthly_low, cost_monthly_high,
            cost_annual_low, cost_annual_high
     FROM reference_pricing
     WHERE item_key IN (${placeholders}) AND is_active = TRUE`,
    uniqueKeys
  );

  const pricingMap = {};
  for (const row of result.rows) {
    const parts = [];
    if (row.cost_monthly_low != null || row.cost_monthly_high != null) {
      const low = row.cost_monthly_low != null ? `$${Number(row.cost_monthly_low).toLocaleString()}` : '';
      const high = row.cost_monthly_high != null ? `$${Number(row.cost_monthly_high).toLocaleString()}` : '';
      parts.push(low && high ? `${low}-${high}/mo` : `${low || high}/mo`);
    }
    if (row.cost_onetime_low != null || row.cost_onetime_high != null) {
      const low = row.cost_onetime_low != null ? `$${Number(row.cost_onetime_low).toLocaleString()}` : '';
      const high = row.cost_onetime_high != null ? `$${Number(row.cost_onetime_high).toLocaleString()}` : '';
      parts.push(low && high ? `${low}-${high} one-time` : `${low || high} one-time`);
    }
    if (row.cost_annual_low != null || row.cost_annual_high != null) {
      const low = row.cost_annual_low != null ? `$${Number(row.cost_annual_low).toLocaleString()}` : '';
      const high = row.cost_annual_high != null ? `$${Number(row.cost_annual_high).toLocaleString()}` : '';
      parts.push(low && high ? `${low}-${high}/yr` : `${low || high}/yr`);
    }

    const vendorInfo = row.vendor_name ? ` (${row.vendor_name})` : '';
    pricingMap[row.item_key] = parts.length > 0 ? `${parts.join(', ')}${vendorInfo}` : `N/A${vendorInfo}`;
  }

  let resolved = contentMd;
  for (const match of matches) {
    const fullMatch = match[0];
    const key = match[1].trim();
    const replacement = pricingMap[key] || `[pricing: ${key} not found]`;
    resolved = resolved.replace(fullMatch, replacement);
  }

  return resolved;
}

module.exports = router;
