'use strict';

const express = require('express');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

// --------------------------------------------------------------------------
// MCP token authentication middleware (replaces session-based auth)
// --------------------------------------------------------------------------
async function requireMcpAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Missing or invalid Authorization header' },
        id: req.body && req.body.id ? req.body.id : null,
      });
    }

    const token = authHeader.slice(7);
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const result = await query(
      `SELECT mt.id, mt.name, mt.created_by, u.display_name, u.role
       FROM mcp_tokens mt
       JOIN users u ON u.id = mt.created_by
       WHERE mt.token_hash = $1 AND mt.is_active = TRUE`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Invalid or revoked token' },
        id: req.body && req.body.id ? req.body.id : null,
      });
    }

    const mcpToken = result.rows[0];

    // Update last_used_at
    await query(
      'UPDATE mcp_tokens SET last_used_at = NOW() WHERE id = $1',
      [mcpToken.id]
    );

    // Attach user info to request
    req.mcpToken = mcpToken;
    req.user = {
      id: mcpToken.created_by,
      display_name: mcpToken.display_name,
      role: mcpToken.role,
    };

    next();
  } catch (err) {
    console.error('MCP auth error:', err.message);
    res.status(500).json({
      jsonrpc: '2.0',
      error: { code: -32603, message: 'Internal authentication error' },
      id: req.body && req.body.id ? req.body.id : null,
    });
  }
}

// --------------------------------------------------------------------------
// MCP tool implementations
// --------------------------------------------------------------------------

/**
 * get_pricing - Retrieve pricing data with optional filters
 */
async function handleGetPricing(params) {
  const { category, vendor, item_key } = params || {};
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
  if (item_key) {
    conditions.push(`rp.item_key = $${paramIndex++}`);
    values.push(item_key);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await query(
    `SELECT rp.id, rp.category, rp.subcategory, rp.item_key, rp.vendor_name,
            rp.product_name, rp.product_url,
            rp.cost_onetime_low, rp.cost_onetime_high,
            rp.cost_monthly_low, rp.cost_monthly_high,
            rp.cost_annual_low, rp.cost_annual_high,
            rp.notes, rp.source, rp.verified_at
     FROM reference_pricing rp
     ${whereClause}
     ORDER BY rp.category, rp.subcategory, rp.item_key
     LIMIT 100`,
    values
  );

  return {
    pricing: result.rows,
    count: result.rows.length,
  };
}

/**
 * update_pricing - Update or create a pricing entry
 */
async function handleUpdatePricing(params, userId) {
  const {
    item_key, category, subcategory, vendor_name, product_name, product_url,
    cost_onetime_low, cost_onetime_high, cost_monthly_low, cost_monthly_high,
    cost_annual_low, cost_annual_high, notes, source,
  } = params || {};

  if (!item_key) {
    throw { code: -32602, message: 'item_key is required' };
  }

  // Check if entry exists
  const existing = await query(
    'SELECT id FROM reference_pricing WHERE item_key = $1',
    [item_key]
  );

  let result;
  if (existing.rows.length > 0) {
    result = await query(
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
       WHERE id = $15
       RETURNING *`,
      [
        category || null, subcategory || null,
        vendor_name || null, product_name || null, product_url || null,
        cost_onetime_low != null ? cost_onetime_low : null,
        cost_onetime_high != null ? cost_onetime_high : null,
        cost_monthly_low != null ? cost_monthly_low : null,
        cost_monthly_high != null ? cost_monthly_high : null,
        cost_annual_low != null ? cost_annual_low : null,
        cost_annual_high != null ? cost_annual_high : null,
        notes || null, source || null,
        userId, existing.rows[0].id,
      ]
    );

    return { action: 'updated', pricing: result.rows[0] };
  } else {
    const id = uuidv4();
    result = await query(
      `INSERT INTO reference_pricing
         (id, category, subcategory, item_key, vendor_name, product_name, product_url,
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
        notes || null, source || null, userId,
      ]
    );

    return { action: 'created', pricing: result.rows[0] };
  }
}

/**
 * flag_for_review - Flag a pricing entry for human review
 */
async function handleFlagForReview(params, userId) {
  const { item_key, reason } = params || {};

  if (!item_key) {
    throw { code: -32602, message: 'item_key is required' };
  }

  const existing = await query(
    'SELECT id, notes FROM reference_pricing WHERE item_key = $1 AND is_active = TRUE',
    [item_key]
  );

  if (existing.rows.length === 0) {
    throw { code: -32602, message: `No active pricing entry found for item_key: ${item_key}` };
  }

  const entry = existing.rows[0];
  const reviewNote = `[FLAGGED FOR REVIEW ${new Date().toISOString()}] ${reason || 'Flagged by MCP client'}`;
  const updatedNotes = entry.notes
    ? `${entry.notes}\n${reviewNote}`
    : reviewNote;

  await query(
    `UPDATE reference_pricing SET notes = $1, verified_at = NULL WHERE id = $2`,
    [updatedNotes, entry.id]
  );

  await logAudit(userId, 'flag_for_review', 'reference_pricing', entry.id, {
    item_key,
    reason: reason || 'Flagged by MCP client',
  }, 'mcp');

  return {
    flagged: true,
    item_key,
    message: `Entry "${item_key}" flagged for review`,
  };
}

// --------------------------------------------------------------------------
// Tool registry
// --------------------------------------------------------------------------
const MCP_TOOLS = {
  get_pricing: {
    description: 'Retrieve reference pricing data with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Filter by category' },
        vendor: { type: 'string', description: 'Filter by vendor name (partial match)' },
        item_key: { type: 'string', description: 'Filter by exact item key' },
      },
    },
    handler: handleGetPricing,
  },
  update_pricing: {
    description: 'Create or update a reference pricing entry',
    inputSchema: {
      type: 'object',
      properties: {
        item_key: { type: 'string', description: 'Unique item key (required)' },
        category: { type: 'string' },
        subcategory: { type: 'string' },
        vendor_name: { type: 'string' },
        product_name: { type: 'string' },
        product_url: { type: 'string' },
        cost_onetime_low: { type: 'number' },
        cost_onetime_high: { type: 'number' },
        cost_monthly_low: { type: 'number' },
        cost_monthly_high: { type: 'number' },
        cost_annual_low: { type: 'number' },
        cost_annual_high: { type: 'number' },
        notes: { type: 'string' },
        source: { type: 'string' },
      },
      required: ['item_key'],
    },
    handler: handleUpdatePricing,
  },
  flag_for_review: {
    description: 'Flag a pricing entry for human review',
    inputSchema: {
      type: 'object',
      properties: {
        item_key: { type: 'string', description: 'Item key to flag (required)' },
        reason: { type: 'string', description: 'Reason for flagging' },
      },
      required: ['item_key'],
    },
    handler: handleFlagForReview,
  },
};

// --------------------------------------------------------------------------
// POST / - MCP JSON-RPC protocol handler
// --------------------------------------------------------------------------
router.post('/', requireMcpAuth, async (req, res) => {
  try {
    const { jsonrpc, method, params, id: requestId } = req.body;

    // Validate JSON-RPC structure
    if (jsonrpc !== '2.0') {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: { code: -32600, message: 'Invalid Request: jsonrpc must be "2.0"' },
        id: requestId || null,
      });
    }

    if (!method || typeof method !== 'string') {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: { code: -32600, message: 'Invalid Request: method is required' },
        id: requestId || null,
      });
    }

    // Handle MCP protocol methods
    switch (method) {
      case 'initialize': {
        return res.json({
          jsonrpc: '2.0',
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: { listChanged: false },
            },
            serverInfo: {
              name: 'denovonomo-mcp',
              version: '1.0.0',
            },
          },
          id: requestId,
        });
      }

      case 'tools/list': {
        const tools = Object.entries(MCP_TOOLS).map(([name, tool]) => ({
          name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        }));

        return res.json({
          jsonrpc: '2.0',
          result: { tools },
          id: requestId,
        });
      }

      case 'tools/call': {
        const toolName = params && params.name;
        const toolArgs = params && params.arguments ? params.arguments : {};

        if (!toolName || !MCP_TOOLS[toolName]) {
          return res.json({
            jsonrpc: '2.0',
            error: { code: -32601, message: `Tool not found: ${toolName}` },
            id: requestId,
          });
        }

        try {
          const toolResult = await MCP_TOOLS[toolName].handler(toolArgs, req.user.id);

          await logAudit(req.user.id, 'mcp_tool_call', 'mcp', null, {
            tool: toolName,
            token_name: req.mcpToken.name,
          }, req.ip);

          return res.json({
            jsonrpc: '2.0',
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(toolResult, null, 2),
                },
              ],
              isError: false,
            },
            id: requestId,
          });
        } catch (toolErr) {
          const errorMessage = toolErr.message || 'Tool execution failed';

          return res.json({
            jsonrpc: '2.0',
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ error: errorMessage }),
                },
              ],
              isError: true,
            },
            id: requestId,
          });
        }
      }

      case 'notifications/initialized': {
        // Acknowledgement - no response needed for notifications
        return res.json({
          jsonrpc: '2.0',
          result: {},
          id: requestId,
        });
      }

      default: {
        return res.json({
          jsonrpc: '2.0',
          error: { code: -32601, message: `Method not found: ${method}` },
          id: requestId,
        });
      }
    }
  } catch (err) {
    console.error('MCP handler error:', err.message);
    res.status(500).json({
      jsonrpc: '2.0',
      error: { code: -32603, message: 'Internal server error' },
      id: req.body && req.body.id ? req.body.id : null,
    });
  }
});

module.exports = router;
