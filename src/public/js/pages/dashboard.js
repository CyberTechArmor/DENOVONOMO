import api from '../api.js';
import { showToast } from '../components/toast.js';
import { formatDate } from '../utils/dates.js';
import { formatCurrency, formatNumber } from '../utils/format.js';
import auth from '../auth.js';

const STATUS_COLORS = {
  planning: 'badge-info',
  setup: 'badge-warning',
  active: 'badge-success',
  archived: ''
};

function renderLoading() {
  return `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1>Dashboard</h1>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-5)" class="mb-6">
        ${Array(4).fill('<div class="card"><div class="skeleton skeleton-heading"></div><div class="skeleton skeleton-text" style="width:40%"></div></div>').join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-5)">
        ${Array(4).fill('<div class="card"><div class="skeleton skeleton-card"></div></div>').join('')}
      </div>
    </div>`;
}

function renderEmptyState() {
  return `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
      </svg>
      <h3>No Data Yet</h3>
      <p>Add locations and start making decisions to see your dashboard come to life.</p>
    </div>`;
}

export default function dashboardPage(params) {
  const container = document.getElementById('page-content');
  container.innerHTML = renderLoading();

  let charts = [];
  let filters = { organization: '', status: '', dateFrom: '', dateTo: '' };

  async function loadData() {
    try {
      const queryParts = [];
      if (filters.organization) queryParts.push(`organization=${encodeURIComponent(filters.organization)}`);
      if (filters.status) queryParts.push(`status=${encodeURIComponent(filters.status)}`);
      if (filters.dateFrom) queryParts.push(`dateFrom=${encodeURIComponent(filters.dateFrom)}`);
      if (filters.dateTo) queryParts.push(`dateTo=${encodeURIComponent(filters.dateTo)}`);
      const qs = queryParts.length ? '?' + queryParts.join('&') : '';

      const data = await api.get(`/dashboard${qs}`);
      render(data);
    } catch (err) {
      container.innerHTML = `
        <div class="p-6">
          <h1 class="mb-5">Dashboard</h1>
          ${renderEmptyState()}
        </div>`;
    }
  }

  function render(data) {
    const d = data || {};
    const summary = d.summary || {};
    const locations = d.locations || [];
    const statusBreakdown = d.statusBreakdown || {};
    const costTimeline = d.costTimeline || [];
    const costByLocation = d.costByLocation || [];
    const pipeline = d.pipeline || {};
    const revenueVsCost = d.revenueVsCost || [];
    const organizations = d.organizations || [];

    const totalLocations = summary.totalLocations || locations.length || 0;
    const totalImplementation = summary.totalImplementationCost || 0;
    const monthlyOps = summary.monthlyOperationalCost || 0;
    const avgTransition = summary.avgTransitionDays || 0;

    const planningCount = statusBreakdown.planning || 0;
    const setupCount = statusBreakdown.setup || 0;
    const activeCount = statusBreakdown.active || 0;
    const archivedCount = statusBreakdown.archived || 0;

    container.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-5">
          <h1>Dashboard</h1>
          <div class="flex gap-3 items-center">
            <select id="dash-org-filter" class="form-select" style="width:180px">
              <option value="">All Organizations</option>
              ${organizations.map(o => `<option value="${o.id}" ${filters.organization === o.id ? 'selected' : ''}>${o.name}</option>`).join('')}
            </select>
            <select id="dash-status-filter" class="form-select" style="width:140px">
              <option value="">All Statuses</option>
              <option value="planning" ${filters.status === 'planning' ? 'selected' : ''}>Planning</option>
              <option value="setup" ${filters.status === 'setup' ? 'selected' : ''}>Setup</option>
              <option value="active" ${filters.status === 'active' ? 'selected' : ''}>Active</option>
              <option value="archived" ${filters.status === 'archived' ? 'selected' : ''}>Archived</option>
            </select>
            <input type="date" id="dash-date-from" class="form-input" style="width:150px" value="${filters.dateFrom}" placeholder="From" title="Date from">
            <input type="date" id="dash-date-to" class="form-input" style="width:150px" value="${filters.dateTo}" placeholder="To" title="Date to">
            <button class="btn btn-secondary" id="dash-export-btn">Export</button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space-5)" class="mb-6">
          <div class="card cursor-pointer dash-summary-card" data-navigate="locations">
            <div class="text-sm text-muted font-medium mb-2">Total Locations</div>
            <div style="font-size:1.75rem;font-weight:700;color:var(--color-primary-900)">${formatNumber(totalLocations)}</div>
            <div class="flex gap-3 mt-3 text-xs">
              <span class="badge badge-info">${planningCount} Planning</span>
              <span class="badge badge-warning">${setupCount} Setup</span>
              <span class="badge badge-success">${activeCount} Active</span>
              ${archivedCount ? `<span class="badge">${archivedCount} Archived</span>` : ''}
            </div>
          </div>

          <div class="card cursor-pointer dash-summary-card" data-navigate="costs">
            <div class="text-sm text-muted font-medium mb-2">Total Implementation Cost</div>
            <div style="font-size:1.75rem;font-weight:700;color:var(--color-primary-900)">${formatCurrency(totalImplementation)}</div>
            <div class="text-xs text-muted mt-3">Across all locations</div>
          </div>

          <div class="card cursor-pointer dash-summary-card" data-navigate="costs">
            <div class="text-sm text-muted font-medium mb-2">Monthly Operational Cost</div>
            <div style="font-size:1.75rem;font-weight:700;color:var(--color-primary-900)">${formatCurrency(monthlyOps)}</div>
            <div class="text-xs text-muted mt-3">${formatCurrency(monthlyOps * 12)} / year projected</div>
          </div>

          <div class="card cursor-pointer dash-summary-card" data-navigate="locations">
            <div class="text-sm text-muted font-medium mb-2">Avg Transition Time</div>
            <div style="font-size:1.75rem;font-weight:700;color:var(--color-primary-900)">${avgTransition} <span style="font-size:1rem;font-weight:400">days</span></div>
            <div class="text-xs text-muted mt-3">From start to go-live</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(450px,1fr));gap:var(--space-5)">
          <div class="card">
            <div class="card-header"><h4>Cost Over Time</h4></div>
            <div class="card-body" style="height:280px"><canvas id="chart-cost-time"></canvas></div>
          </div>
          <div class="card">
            <div class="card-header"><h4>Cost by Location</h4></div>
            <div class="card-body" style="height:280px"><canvas id="chart-cost-location"></canvas></div>
          </div>
          <div class="card">
            <div class="card-header"><h4>Location Pipeline</h4></div>
            <div class="card-body" style="height:280px"><canvas id="chart-pipeline"></canvas></div>
          </div>
          <div class="card">
            <div class="card-header"><h4>Revenue vs Cost</h4></div>
            <div class="card-body" style="height:280px"><canvas id="chart-revenue-cost"></canvas></div>
          </div>
        </div>
      </div>`;

    bindEvents();
    renderCharts(data);
  }

  function renderCharts(data) {
    destroyCharts();

    if (typeof Chart === 'undefined') return;

    const d = data || {};
    const costTimeline = d.costTimeline || [];
    const costByLocation = d.costByLocation || [];
    const pipeline = d.pipeline || {};
    const revenueVsCost = d.revenueVsCost || [];

    const chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, font: { size: 12 } } } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true } }
    };

    // Cost over time - line chart
    const ctxTime = document.getElementById('chart-cost-time');
    if (ctxTime) {
      charts.push(new Chart(ctxTime, {
        type: 'line',
        data: {
          labels: costTimeline.map(c => c.label || c.month || ''),
          datasets: [{
            label: 'One-Time',
            data: costTimeline.map(c => c.oneTime || 0),
            borderColor: '#334e68',
            backgroundColor: 'rgba(51,78,104,0.1)',
            fill: true, tension: 0.3
          }, {
            label: 'Monthly',
            data: costTimeline.map(c => c.monthly || 0),
            borderColor: '#de911d',
            backgroundColor: 'rgba(222,145,29,0.1)',
            fill: true, tension: 0.3
          }]
        },
        options: chartDefaults
      }));
    }

    // Cost by location - bar chart
    const ctxLoc = document.getElementById('chart-cost-location');
    if (ctxLoc) {
      charts.push(new Chart(ctxLoc, {
        type: 'bar',
        data: {
          labels: costByLocation.map(c => c.name || c.label || ''),
          datasets: [{
            label: 'Total Cost',
            data: costByLocation.map(c => c.total || c.amount || 0),
            backgroundColor: '#627d98',
            borderRadius: 4
          }]
        },
        options: chartDefaults
      }));
    }

    // Pipeline - horizontal bar
    const pipelineLabels = ['Planning', 'Setup', 'Active', 'Archived'];
    const pipelineData = [
      pipeline.planning || 0,
      pipeline.setup || 0,
      pipeline.active || 0,
      pipeline.archived || 0
    ];
    const ctxPipeline = document.getElementById('chart-pipeline');
    if (ctxPipeline) {
      charts.push(new Chart(ctxPipeline, {
        type: 'bar',
        data: {
          labels: pipelineLabels,
          datasets: [{
            label: 'Locations',
            data: pipelineData,
            backgroundColor: ['#2680c2', '#e9b949', '#27ab83', '#bcccdc'],
            borderRadius: 4
          }]
        },
        options: {
          ...chartDefaults,
          indexAxis: 'y',
          scales: {
            x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            y: { grid: { display: false } }
          }
        }
      }));
    }

    // Revenue vs Cost - grouped bar
    const ctxRevenue = document.getElementById('chart-revenue-cost');
    if (ctxRevenue) {
      charts.push(new Chart(ctxRevenue, {
        type: 'bar',
        data: {
          labels: revenueVsCost.map(r => r.name || r.label || ''),
          datasets: [{
            label: 'Revenue',
            data: revenueVsCost.map(r => r.revenue || 0),
            backgroundColor: '#27ab83',
            borderRadius: 4
          }, {
            label: 'Cost',
            data: revenueVsCost.map(r => r.cost || 0),
            backgroundColor: '#e12d39',
            borderRadius: 4
          }]
        },
        options: chartDefaults
      }));
    }
  }

  function destroyCharts() {
    charts.forEach(c => { try { c.destroy(); } catch(e) {} });
    charts = [];
  }

  function bindEvents() {
    container.querySelectorAll('.dash-summary-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.dataset.navigate;
        if (target) window.location.hash = '#/' + target;
      });
    });

    const orgFilter = container.querySelector('#dash-org-filter');
    const statusFilter = container.querySelector('#dash-status-filter');
    const dateFrom = container.querySelector('#dash-date-from');
    const dateTo = container.querySelector('#dash-date-to');
    const exportBtn = container.querySelector('#dash-export-btn');

    if (orgFilter) orgFilter.addEventListener('change', () => { filters.organization = orgFilter.value; loadData(); });
    if (statusFilter) statusFilter.addEventListener('change', () => { filters.status = statusFilter.value; loadData(); });
    if (dateFrom) dateFrom.addEventListener('change', () => { filters.dateFrom = dateFrom.value; loadData(); });
    if (dateTo) dateTo.addEventListener('change', () => { filters.dateTo = dateTo.value; loadData(); });

    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        try {
          exportBtn.disabled = true;
          exportBtn.textContent = 'Exporting...';
          const queryParts = [];
          if (filters.organization) queryParts.push(`organization=${encodeURIComponent(filters.organization)}`);
          if (filters.status) queryParts.push(`status=${encodeURIComponent(filters.status)}`);
          if (filters.dateFrom) queryParts.push(`dateFrom=${encodeURIComponent(filters.dateFrom)}`);
          if (filters.dateTo) queryParts.push(`dateTo=${encodeURIComponent(filters.dateTo)}`);
          const qs = queryParts.length ? '?' + queryParts.join('&') : '';
          const response = await fetch(`/api/dashboard/export${qs}`);
          if (!response.ok) throw new Error('Export failed');
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `dashboard-export-${new Date().toISOString().slice(0,10)}.csv`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('Dashboard exported', 'success');
        } catch (err) {
          showToast('Export failed: ' + err.message, 'error');
        } finally {
          exportBtn.disabled = false;
          exportBtn.textContent = 'Export';
        }
      });
    }
  }

  loadData();

  return {
    destroy() {
      destroyCharts();
    }
  };
}
