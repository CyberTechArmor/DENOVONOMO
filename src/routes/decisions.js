'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { requireAuth, loadUser } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

router.use(requireAuth, loadUser);

// --------------------------------------------------------------------------
// Decision tree template (seed data)
// --------------------------------------------------------------------------
const DECISION_TREE_TEMPLATE = {
  categories: [
    {
      name: 'Technology',
      subcategories: [
        {
          name: 'EHR / Practice Management',
          items: [
            { item_key: 'ehr_system', label: 'EHR System', options: [
              { option_name: 'Epic', option_type: 'off_the_shelf', description: 'Enterprise EHR platform' },
              { option_name: 'Athenahealth', option_type: 'managed_service', description: 'Cloud-based EHR' },
              { option_name: 'eClinicalWorks', option_type: 'off_the_shelf', description: 'Ambulatory EHR' },
              { option_name: 'Custom Build', option_type: 'build_custom', description: 'Build in-house' },
            ]},
            { item_key: 'practice_mgmt', label: 'Practice Management Software', options: [
              { option_name: 'Kareo', option_type: 'managed_service', description: 'Cloud PM' },
              { option_name: 'AdvancedMD', option_type: 'managed_service', description: 'Cloud PM + EHR' },
              { option_name: 'Integrated with EHR', option_type: 'off_the_shelf', description: 'Use EHR built-in PM' },
            ]},
          ],
        },
        {
          name: 'Infrastructure',
          items: [
            { item_key: 'cloud_provider', label: 'Cloud Hosting Provider', options: [
              { option_name: 'AWS', option_type: 'managed_service', description: 'Amazon Web Services' },
              { option_name: 'Azure', option_type: 'managed_service', description: 'Microsoft Azure' },
              { option_name: 'GCP', option_type: 'managed_service', description: 'Google Cloud Platform' },
              { option_name: 'On-Premise', option_type: 'build_custom', description: 'Self-hosted infrastructure' },
            ]},
            { item_key: 'network_setup', label: 'Network Setup', options: [
              { option_name: 'Managed IT Service', option_type: 'managed_service', description: 'Outsourced network management' },
              { option_name: 'In-House IT', option_type: 'build_custom', description: 'Build and manage internally' },
            ]},
            { item_key: 'phone_system', label: 'Phone System', options: [
              { option_name: 'RingCentral', option_type: 'managed_service', description: 'Cloud VoIP' },
              { option_name: 'Vonage', option_type: 'managed_service', description: 'Business VoIP' },
              { option_name: '8x8', option_type: 'managed_service', description: 'Unified communications' },
              { option_name: 'Traditional PBX', option_type: 'off_the_shelf', description: 'On-premise phone system' },
            ]},
          ],
        },
        {
          name: 'Security & Compliance',
          items: [
            { item_key: 'hipaa_compliance', label: 'HIPAA Compliance Tool', options: [
              { option_name: 'Compliancy Group', option_type: 'managed_service', description: 'HIPAA compliance SaaS' },
              { option_name: 'HIPAA One', option_type: 'managed_service', description: 'Automated compliance' },
              { option_name: 'Internal Program', option_type: 'build_custom', description: 'Build compliance program in-house' },
            ]},
            { item_key: 'cybersecurity', label: 'Cybersecurity Solution', options: [
              { option_name: 'CrowdStrike', option_type: 'managed_service', description: 'Endpoint detection & response' },
              { option_name: 'SentinelOne', option_type: 'managed_service', description: 'AI-powered security' },
              { option_name: 'Open Source Stack', option_type: 'open_source', description: 'OSSEC + Snort + pfSense' },
            ]},
          ],
        },
      ],
    },
    {
      name: 'Operations',
      subcategories: [
        {
          name: 'Staffing',
          items: [
            { item_key: 'staffing_model', label: 'Staffing Model', options: [
              { option_name: 'Full-Time Employees', option_type: 'build_custom', description: 'Direct hire all staff' },
              { option_name: 'Staffing Agency', option_type: 'managed_service', description: 'Contract through agency' },
              { option_name: 'Hybrid Model', option_type: 'build_custom', description: 'Core FTEs + agency flex' },
            ]},
            { item_key: 'credentialing_service', label: 'Credentialing Service', options: [
              { option_name: 'Medallion', option_type: 'managed_service', description: 'Automated credentialing' },
              { option_name: 'VerityStream', option_type: 'managed_service', description: 'Credentialing management' },
              { option_name: 'In-House', option_type: 'build_custom', description: 'Internal credentialing team' },
            ]},
          ],
        },
        {
          name: 'Revenue Cycle',
          items: [
            { item_key: 'billing_service', label: 'Billing / RCM', options: [
              { option_name: 'Outsourced RCM', option_type: 'managed_service', description: 'Third-party billing company' },
              { option_name: 'In-House Billing', option_type: 'build_custom', description: 'Internal billing department' },
              { option_name: 'Hybrid', option_type: 'build_custom', description: 'Core in-house, complex outsourced' },
            ]},
            { item_key: 'patient_payments', label: 'Patient Payment Platform', options: [
              { option_name: 'Stripe Health', option_type: 'managed_service', description: 'Modern payment processing' },
              { option_name: 'InstaMed', option_type: 'managed_service', description: 'Healthcare payments network' },
              { option_name: 'Rectangle Health', option_type: 'managed_service', description: 'Patient financing + payments' },
            ]},
          ],
        },
      ],
    },
    {
      name: 'Facilities',
      subcategories: [
        {
          name: 'Real Estate',
          items: [
            { item_key: 'space_strategy', label: 'Space Strategy', options: [
              { option_name: 'Lease', option_type: 'off_the_shelf', description: 'Lease existing medical space' },
              { option_name: 'Build-Out', option_type: 'build_custom', description: 'Custom build-out of raw space' },
              { option_name: 'Purchase', option_type: 'off_the_shelf', description: 'Purchase commercial property' },
            ]},
          ],
        },
        {
          name: 'Equipment',
          items: [
            { item_key: 'medical_equipment', label: 'Medical Equipment Strategy', options: [
              { option_name: 'Buy New', option_type: 'off_the_shelf', description: 'Purchase all new equipment' },
              { option_name: 'Lease Equipment', option_type: 'managed_service', description: 'Equipment leasing program' },
              { option_name: 'Buy Refurbished', option_type: 'off_the_shelf', description: 'Certified refurbished equipment' },
              { option_name: 'Mix', option_type: 'off_the_shelf', description: 'New for critical, refurbished for others' },
            ]},
            { item_key: 'furniture', label: 'Office Furniture', options: [
              { option_name: 'Medical-Grade New', option_type: 'off_the_shelf', description: 'New medical office furniture' },
              { option_name: 'Budget Mix', option_type: 'off_the_shelf', description: 'Mix of new and used' },
            ]},
          ],
        },
      ],
    },
    {
      name: 'Marketing',
      subcategories: [
        {
          name: 'Digital Presence',
          items: [
            { item_key: 'website', label: 'Website', options: [
              { option_name: 'Custom Build', option_type: 'build_custom', description: 'Custom website development' },
              { option_name: 'WordPress', option_type: 'open_source', description: 'WordPress with medical theme' },
              { option_name: 'Squarespace', option_type: 'managed_service', description: 'Managed website builder' },
            ]},
            { item_key: 'seo_marketing', label: 'SEO & Marketing', options: [
              { option_name: 'Agency', option_type: 'managed_service', description: 'Healthcare marketing agency' },
              { option_name: 'In-House', option_type: 'build_custom', description: 'Internal marketing team' },
              { option_name: 'Skip', option_type: 'skip', description: 'Handle organically' },
            ]},
          ],
        },
      ],
    },
  ],
};

/**
 * Flatten the nested decision tree into a flat array of template items
 * that the frontend decision engine expects.
 */
function flattenTemplates() {
  const templates = [];
  for (const cat of DECISION_TREE_TEMPLATE.categories) {
    for (const subcat of cat.subcategories) {
      for (const item of subcat.items) {
        templates.push({
          id: item.item_key,
          category: `${cat.name} — ${subcat.name}`,
          question: item.label,
          title: item.label,
          options: (item.options || []).map((opt, idx) => ({
            id: `${item.item_key}_opt_${idx}`,
            name: opt.option_name,
            type: opt.option_type,
            description: opt.description || '',
            benefits: opt.benefits || [],
            risks: opt.risks || [],
          })),
        });
      }
    }
  }
  return templates;
}

/**
 * GET /templates - Return the flattened decision templates
 */
router.get('/templates', (req, res) => {
  res.json({ templates: flattenTemplates() });
});

/**
 * GET /location/:locationId - Get all decisions for a location
 */
router.get('/location/:locationId', async (req, res) => {
  try {
    const { locationId } = req.params;

    const result = await query(
      `SELECT d.*,
              u.display_name AS decided_by_name,
              COALESCE(
                (SELECT json_agg(
                  json_build_object(
                    'id', do2.id,
                    'option_name', do2.option_name,
                    'option_type', do2.option_type,
                    'description', do2.description,
                    'benefits', do2.benefits,
                    'risks', do2.risks,
                    'estimated_cost_onetime', do2.estimated_cost_onetime,
                    'estimated_cost_monthly', do2.estimated_cost_monthly,
                    'estimated_cost_annual', do2.estimated_cost_annual,
                    'vendor_name', do2.vendor_name,
                    'vendor_url', do2.vendor_url,
                    'is_selected', do2.is_selected
                  ) ORDER BY do2.created_at
                ) FROM decision_options do2 WHERE do2.decision_id = d.id),
                '[]'::json
              ) AS options
       FROM decisions d
       LEFT JOIN users u ON u.id = d.decided_by
       WHERE d.location_id = $1
       ORDER BY d.category, d.subcategory, d.item_key`,
      [locationId]
    );

    res.json({ decisions: result.rows });
  } catch (err) {
    console.error('Error listing decisions:', err.message);
    res.status(500).json({ error: 'Failed to list decisions' });
  }
});

/**
 * GET /location/:locationId/progress - Decision progress by category
 */
router.get('/location/:locationId/progress', async (req, res) => {
  try {
    const { locationId } = req.params;

    const result = await query(
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
      [locationId]
    );

    const overall = await query(
      `SELECT
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE status = 'decided') AS decided,
         COUNT(*) FILTER (WHERE status = 'pending') AS pending
       FROM decisions
       WHERE location_id = $1`,
      [locationId]
    );

    res.json({
      by_category: result.rows,
      overall: overall.rows[0],
    });
  } catch (err) {
    console.error('Error fetching decision progress:', err.message);
    res.status(500).json({ error: 'Failed to fetch decision progress' });
  }
});

/**
 * POST /location/:locationId - Create or update a decision
 */
router.post('/location/:locationId', requireRole('editor'), async (req, res) => {
  try {
    const { locationId } = req.params;
    const {
      item_key, category, subcategory, decision_summary,
      selected_option, reasoning, estimated_cost_onetime,
      estimated_cost_monthly, estimated_cost_annual, vendors, status,
    } = req.body;

    if (!item_key) {
      return res.status(400).json({ error: 'item_key is required' });
    }

    // Check if decision already exists for this location + item_key
    const existing = await query(
      'SELECT id FROM decisions WHERE location_id = $1 AND item_key = $2',
      [locationId, item_key]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update existing
      result = await query(
        `UPDATE decisions SET
           category = COALESCE($1, category),
           subcategory = COALESCE($2, subcategory),
           decision_summary = COALESCE($3, decision_summary),
           selected_option = COALESCE($4, selected_option),
           reasoning = COALESCE($5, reasoning),
           estimated_cost_onetime = COALESCE($6, estimated_cost_onetime),
           estimated_cost_monthly = COALESCE($7, estimated_cost_monthly),
           estimated_cost_annual = COALESCE($8, estimated_cost_annual),
           vendors = COALESCE($9, vendors),
           status = COALESCE($10, status),
           decided_by = $11,
           decided_at = CASE WHEN $10 = 'decided' THEN NOW() ELSE decided_at END
         WHERE id = $12
         RETURNING *`,
        [
          category || null, subcategory || null, decision_summary || null,
          selected_option || null, reasoning || null,
          estimated_cost_onetime != null ? estimated_cost_onetime : null,
          estimated_cost_monthly != null ? estimated_cost_monthly : null,
          estimated_cost_annual != null ? estimated_cost_annual : null,
          vendors ? JSON.stringify(vendors) : null,
          status || null, req.user.id, existing.rows[0].id,
        ]
      );

      await logAudit(req.user.id, 'update', 'decision', existing.rows[0].id, { item_key, status }, req.ip);
    } else {
      // Create new
      const id = uuidv4();
      result = await query(
        `INSERT INTO decisions (id, location_id, category, subcategory, item_key,
           decision_summary, selected_option, reasoning,
           estimated_cost_onetime, estimated_cost_monthly, estimated_cost_annual,
           vendors, status, decided_by, decided_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
           CASE WHEN $13 = 'decided' THEN NOW() ELSE NULL END)
         RETURNING *`,
        [
          id, locationId, category || null, subcategory || null, item_key,
          decision_summary || null, selected_option || null, reasoning || null,
          estimated_cost_onetime != null ? estimated_cost_onetime : null,
          estimated_cost_monthly != null ? estimated_cost_monthly : null,
          estimated_cost_annual != null ? estimated_cost_annual : null,
          vendors ? JSON.stringify(vendors) : null,
          status || 'pending', req.user.id,
        ]
      );

      await logAudit(req.user.id, 'create', 'decision', id, { item_key, location_id: locationId }, req.ip);
    }

    res.status(existing.rows.length > 0 ? 200 : 201).json({ decision: result.rows[0] });
  } catch (err) {
    console.error('Error creating/updating decision:', err.message);
    res.status(500).json({ error: 'Failed to save decision' });
  }
});

/**
 * PUT /:id - Update a decision
 */
router.put('/:id', requireRole('editor'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      decision_summary, selected_option, reasoning,
      estimated_cost_onetime, estimated_cost_monthly, estimated_cost_annual,
      vendors, status,
    } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    const fields = {
      decision_summary, selected_option, reasoning,
      estimated_cost_onetime, estimated_cost_monthly, estimated_cost_annual,
      status,
    };

    for (const [field, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates.push(`${field} = $${paramIndex++}`);
        values.push(value);
      }
    }

    if (vendors !== undefined) {
      updates.push(`vendors = $${paramIndex++}`);
      values.push(JSON.stringify(vendors));
    }

    if (status === 'decided') {
      updates.push(`decided_by = $${paramIndex++}`);
      values.push(req.user.id);
      updates.push(`decided_at = NOW()`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const result = await query(
      `UPDATE decisions SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Decision not found' });
    }

    await logAudit(req.user.id, 'update', 'decision', id, { status }, req.ip);

    res.json({ decision: result.rows[0] });
  } catch (err) {
    console.error('Error updating decision:', err.message);
    res.status(500).json({ error: 'Failed to update decision' });
  }
});

/**
 * POST /:id/options - Add a custom option to a decision
 */
router.post('/:id/options', requireRole('editor'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      option_name, option_type, description, benefits, risks,
      estimated_cost_onetime, estimated_cost_monthly, estimated_cost_annual,
      vendor_name, vendor_url,
    } = req.body;

    if (!option_name || !option_type) {
      return res.status(400).json({ error: 'option_name and option_type are required' });
    }

    // Verify decision exists
    const decision = await query('SELECT id FROM decisions WHERE id = $1', [id]);
    if (decision.rows.length === 0) {
      return res.status(404).json({ error: 'Decision not found' });
    }

    const optionId = uuidv4();
    const result = await query(
      `INSERT INTO decision_options (id, decision_id, option_name, option_type, description,
         benefits, risks, estimated_cost_onetime, estimated_cost_monthly, estimated_cost_annual,
         vendor_name, vendor_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        optionId, id, option_name, option_type, description || null,
        benefits || null, risks || null,
        estimated_cost_onetime != null ? estimated_cost_onetime : null,
        estimated_cost_monthly != null ? estimated_cost_monthly : null,
        estimated_cost_annual != null ? estimated_cost_annual : null,
        vendor_name || null, vendor_url || null,
      ]
    );

    await logAudit(req.user.id, 'create', 'decision_option', optionId, { decision_id: id, option_name }, req.ip);

    res.status(201).json({ option: result.rows[0] });
  } catch (err) {
    console.error('Error adding option:', err.message);
    res.status(500).json({ error: 'Failed to add option' });
  }
});

/**
 * GET /location/:locationId/report - Generate decision report data
 */
router.get('/location/:locationId/report', async (req, res) => {
  try {
    const { locationId } = req.params;

    // Get location info
    const locResult = await query(
      'SELECT * FROM locations WHERE id = $1',
      [locationId]
    );
    if (locResult.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Get all decisions grouped by category
    const decisions = await query(
      `SELECT d.*,
              u.display_name AS decided_by_name
       FROM decisions d
       LEFT JOIN users u ON u.id = d.decided_by
       WHERE d.location_id = $1
       ORDER BY d.category, d.subcategory, d.item_key`,
      [locationId]
    );

    // Group by category
    const grouped = {};
    let totalOneTime = 0;
    let totalMonthly = 0;
    let totalAnnual = 0;

    for (const d of decisions.rows) {
      const cat = d.category || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(d);
      totalOneTime += Number(d.estimated_cost_onetime) || 0;
      totalMonthly += Number(d.estimated_cost_monthly) || 0;
      totalAnnual += Number(d.estimated_cost_annual) || 0;
    }

    res.json({
      location: locResult.rows[0],
      decisions_by_category: grouped,
      totals: {
        one_time: totalOneTime,
        monthly: totalMonthly,
        annual: totalAnnual,
      },
      decision_count: decisions.rows.length,
    });
  } catch (err) {
    console.error('Error generating report:', err.message);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;
