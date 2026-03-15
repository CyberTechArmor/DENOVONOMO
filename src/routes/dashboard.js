'use strict';

const express = require('express');
const { query } = require('../config/database');
const { requireAuth, loadUser } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, loadUser);

/**
 * GET / - Aggregate dashboard data
 */
router.get('/', async (req, res) => {
  try {
    // Location counts by status
    const locationsByStatus = await query(
      `SELECT status, COUNT(*) AS count
       FROM locations
       GROUP BY status
       ORDER BY status`
    );

    // Total costs across all locations
    const totalCosts = await query(
      `SELECT
         SUM(CASE WHEN cost_type = 'one_time' THEN amount ELSE 0 END) AS one_time_total,
         SUM(CASE WHEN cost_type = 'monthly' THEN amount ELSE 0 END) AS monthly_total,
         SUM(CASE WHEN cost_type = 'annual' THEN amount ELSE 0 END) AS annual_total,
         SUM(amount) AS grand_total
       FROM cost_entries`
    );

    // Average transition time (days between transition_start_date and transition_end_date)
    const avgTransition = await query(
      `SELECT
         AVG(EXTRACT(EPOCH FROM (transition_end_date - transition_start_date)) / 86400)::numeric(10,1) AS avg_transition_days
       FROM locations
       WHERE transition_start_date IS NOT NULL AND transition_end_date IS NOT NULL`
    );

    // Overall decision progress
    const decisionStats = await query(
      `SELECT
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE status = 'decided') AS decided,
         COUNT(*) FILTER (WHERE status = 'pending') AS pending
       FROM decisions`
    );

    // Checklist stats
    const checklistStats = await query(
      `SELECT
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE status = 'done') AS done,
         COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress
       FROM checklist_items`
    );

    // Build status breakdown object from rows
    const statusBreakdown = {};
    let totalLocations = 0;
    for (const row of locationsByStatus.rows) {
      statusBreakdown[row.status] = parseInt(row.count, 10) || 0;
      totalLocations += parseInt(row.count, 10) || 0;
    }

    const costs = totalCosts.rows[0] || {};
    const avgDays = avgTransition.rows[0]
      ? parseFloat(avgTransition.rows[0].avg_transition_days) || 0
      : 0;

    // Fetch locations list for the frontend
    const locationsResult = await query(
      `SELECT l.id, l.name, l.status, l.address, l.location_type,
              o.name AS organization_name
       FROM locations l
       LEFT JOIN organizations o ON o.id = l.organization_id
       ORDER BY l.created_at DESC`
    );

    // Fetch organizations for filter dropdown
    const orgsResult = await query(
      `SELECT id, name FROM organizations ORDER BY name`
    );

    res.json({
      summary: {
        totalLocations,
        totalImplementationCost: parseFloat(costs.one_time_total) || 0,
        monthlyOperationalCost: parseFloat(costs.monthly_total) || 0,
        avgTransitionDays: Math.round(avgDays),
      },
      locations: locationsResult.rows,
      statusBreakdown,
      pipeline: statusBreakdown,
      costTimeline: [],
      costByLocation: [],
      revenueVsCost: [],
      organizations: orgsResult.rows,
      decision_stats: decisionStats.rows[0],
      checklist_stats: checklistStats.rows[0],
    });
  } catch (err) {
    console.error('Error fetching dashboard:', err.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

/**
 * GET /charts/cost-over-time - Monthly cost data for line chart
 */
router.get('/charts/cost-over-time', async (req, res) => {
  try {
    const result = await query(
      `SELECT
         DATE_TRUNC('month', created_at) AS month,
         SUM(CASE WHEN cost_type = 'one_time' THEN amount ELSE 0 END) AS one_time,
         SUM(CASE WHEN cost_type = 'monthly' THEN amount ELSE 0 END) AS monthly,
         SUM(CASE WHEN cost_type = 'annual' THEN amount ELSE 0 END) AS annual,
         SUM(amount) AS total
       FROM cost_entries
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month ASC`
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error('Error fetching cost-over-time:', err.message);
    res.status(500).json({ error: 'Failed to fetch cost-over-time data' });
  }
});

/**
 * GET /charts/cost-by-location - Cost comparison by location
 */
router.get('/charts/cost-by-location', async (req, res) => {
  try {
    const result = await query(
      `SELECT
         l.id AS location_id,
         l.name AS location_name,
         SUM(CASE WHEN ce.cost_type = 'one_time' THEN ce.amount ELSE 0 END) AS one_time,
         SUM(CASE WHEN ce.cost_type = 'monthly' THEN ce.amount ELSE 0 END) AS monthly,
         SUM(CASE WHEN ce.cost_type = 'annual' THEN ce.amount ELSE 0 END) AS annual,
         COALESCE(SUM(ce.amount), 0) AS total
       FROM locations l
       LEFT JOIN cost_entries ce ON ce.location_id = l.id
       GROUP BY l.id, l.name
       ORDER BY total DESC`
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error('Error fetching cost-by-location:', err.message);
    res.status(500).json({ error: 'Failed to fetch cost-by-location data' });
  }
});

/**
 * GET /charts/location-pipeline - Location status funnel
 */
router.get('/charts/location-pipeline', async (req, res) => {
  try {
    const result = await query(
      `SELECT
         status,
         COUNT(*) AS count,
         COALESCE(SUM(estimated_total_cost), 0) AS total_estimated_cost,
         COALESCE(SUM(actual_total_cost), 0) AS total_actual_cost
       FROM locations
       GROUP BY status
       ORDER BY
         CASE status
           WHEN 'planning' THEN 1
           WHEN 'setup' THEN 2
           WHEN 'active' THEN 3
           WHEN 'archived' THEN 4
         END`
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error('Error fetching location-pipeline:', err.message);
    res.status(500).json({ error: 'Failed to fetch location-pipeline data' });
  }
});

/**
 * GET /charts/revenue-vs-cost - Revenue and cost by location
 */
router.get('/charts/revenue-vs-cost', async (req, res) => {
  try {
    const result = await query(
      `SELECT
         l.id AS location_id,
         l.name AS location_name,
         l.status,
         COALESCE(l.estimated_revenue_monthly, 0) AS estimated_revenue_monthly,
         COALESCE(l.submitted_billing_monthly, 0) AS submitted_billing_monthly,
         COALESCE(l.estimated_total_cost, 0) AS estimated_total_cost,
         COALESCE(l.actual_total_cost, 0) AS actual_total_cost,
         COALESCE((SELECT SUM(amount) FROM cost_entries WHERE location_id = l.id), 0) AS tracked_cost_total
       FROM locations l
       ORDER BY l.name`
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error('Error fetching revenue-vs-cost:', err.message);
    res.status(500).json({ error: 'Failed to fetch revenue-vs-cost data' });
  }
});

module.exports = router;
