import api from '../api.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { formatCurrency, formatNumber } from '../utils/format.js';
import { formatDate } from '../utils/dates.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export default function costsPage(params) {
  const container = document.getElementById('page-content');
  const locationId = params.id;

  let costs = [];
  let summary = {};
  let charts = [];
  let destroyed = false;

  function renderLoading() {
    container.innerHTML = `
      <div class="p-6">
        <div class="skeleton skeleton-heading mb-5" style="width:25%"></div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4)" class="mb-5">
          ${Array(3).fill('<div class="card"><div class="skeleton skeleton-heading"></div><div class="skeleton skeleton-text" style="width:50%"></div></div>').join('')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
          ${Array(2).fill('<div class="card"><div class="skeleton skeleton-card" style="height:250px"></div></div>').join('')}
        </div>
      </div>`;
  }

  function render() {
    if (destroyed) return;

    const oneTimeCost = summary.one_time_cost || summary.oneTimeCost || 0;
    const monthlyCost = summary.monthly_cost || summary.monthlyCost || 0;
    const annualProjection = monthlyCost * 12 + oneTimeCost;
    const totalRevenue = summary.revenue || summary.total_revenue || 0;
    const roi = totalRevenue > 0 && annualProjection > 0
      ? (((totalRevenue - annualProjection) / annualProjection) * 100).toFixed(1)
      : null;

    container.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-5">
          <div>
            <a href="#/locations/${locationId}" class="text-sm text-muted" style="text-decoration:none">&larr; Back to location</a>
            <h1 style="margin:var(--space-2) 0 0">Cost Dashboard</h1>
          </div>
          <button class="btn btn-primary" id="cost-add-btn">+ Add Cost Entry</button>
        </div>

        <!-- Summary Cards -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space-4)" class="mb-5">
          <div class="card">
            <div class="text-sm text-muted font-medium mb-2">One-Time Costs</div>
            <div style="font-size:1.5rem;font-weight:700;color:var(--color-primary-900)">${formatCurrency(oneTimeCost)}</div>
            <div class="text-xs text-muted mt-2">Setup, equipment, licensing</div>
          </div>
          <div class="card">
            <div class="text-sm text-muted font-medium mb-2">Monthly Costs</div>
            <div style="font-size:1.5rem;font-weight:700;color:var(--color-primary-900)">${formatCurrency(monthlyCost)}</div>
            <div class="text-xs text-muted mt-2">Recurring operational costs</div>
          </div>
          <div class="card">
            <div class="text-sm text-muted font-medium mb-2">Annual Projection</div>
            <div style="font-size:1.5rem;font-weight:700;color:var(--color-primary-900)">${formatCurrency(annualProjection)}</div>
            <div class="text-xs text-muted mt-2">Monthly x 12 + one-time</div>
          </div>
          ${roi !== null ? `
            <div class="card">
              <div class="text-sm text-muted font-medium mb-2">ROI</div>
              <div style="font-size:1.5rem;font-weight:700;color:${parseFloat(roi) >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}">${roi}%</div>
              <div class="text-xs text-muted mt-2">Based on revenue vs costs</div>
            </div>
          ` : ''}
        </div>

        <!-- Revenue / Billing inputs -->
        <div class="card mb-5" style="padding:var(--space-4)">
          <h4 style="margin:0 0 var(--space-3)">Revenue &amp; Billing</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--space-3)">
            <div class="form-group">
              <label class="form-label text-sm">Monthly Revenue</label>
              <input type="number" id="cost-monthly-revenue" class="form-input" step="0.01" placeholder="0.00"
                value="${summary.monthly_revenue || ''}">
            </div>
            <div class="form-group">
              <label class="form-label text-sm">Annual Revenue</label>
              <input type="number" id="cost-annual-revenue" class="form-input" step="0.01" placeholder="0.00"
                value="${summary.annual_revenue || summary.revenue || ''}">
            </div>
            <div class="form-group">
              <label class="form-label text-sm">Billing Rate (per unit)</label>
              <input type="number" id="cost-billing-rate" class="form-input" step="0.01" placeholder="0.00"
                value="${summary.billing_rate || ''}">
            </div>
            <div class="form-group" style="display:flex;align-items:flex-end">
              <button class="btn btn-secondary" id="cost-save-revenue-btn">Update Revenue</button>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:var(--space-4)" class="mb-5">
          <div class="card">
            <div class="card-header"><h4>Category Breakdown</h4></div>
            <div class="card-body" style="height:300px;display:flex;align-items:center;justify-content:center">
              <canvas id="chart-cost-category"></canvas>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><h4>Cost Timeline</h4></div>
            <div class="card-body" style="height:300px">
              <canvas id="chart-cost-timeline"></canvas>
            </div>
          </div>
        </div>

        <!-- Cost entry table -->
        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center">
            <h4 style="margin:0">Cost Entries (${costs.length})</h4>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Vendor</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${costs.length === 0 ? `
                <tr><td colspan="7" class="text-center text-muted" style="padding:var(--space-5)">No cost entries yet. Click "Add Cost Entry" to get started.</td></tr>
              ` : costs.map(cost => `
                <tr data-cost-id="${cost.id}">
                  <td class="font-medium">${escapeHtml(cost.item || cost.name || '')}</td>
                  <td><span class="badge" style="font-size:0.625rem">${escapeHtml(cost.category || '')}</span></td>
                  <td><span class="badge ${cost.type === 'one_time' ? 'badge-info' : 'badge-warning'}" style="font-size:0.625rem">${escapeHtml(cost.type || 'one_time')}</span></td>
                  <td class="font-medium">${formatCurrency(cost.amount)}</td>
                  <td class="text-sm text-muted">${escapeHtml(cost.vendor || '-')}</td>
                  <td class="text-sm text-muted">${cost.date ? formatDate(cost.date) : '-'}</td>
                  <td>
                    <div class="flex gap-1">
                      <button class="btn btn-sm btn-ghost cost-edit-btn" data-cost-id="${cost.id}">Edit</button>
                      <button class="btn btn-sm btn-ghost cost-delete-btn" data-cost-id="${cost.id}" style="color:var(--color-danger)">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>`;

    bindEvents();
    renderCharts();
  }

  function renderCharts() {
    destroyCharts();
    if (typeof Chart === 'undefined') return;

    // Category breakdown doughnut
    const categoryMap = {};
    costs.forEach(c => {
      const cat = c.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + (parseFloat(c.amount) || 0);
    });

    const catCanvas = document.getElementById('chart-cost-category');
    if (catCanvas && Object.keys(categoryMap).length > 0) {
      charts.push(new Chart(catCanvas, {
        type: 'doughnut',
        data: {
          labels: Object.keys(categoryMap),
          datasets: [{
            data: Object.values(categoryMap),
            backgroundColor: ['#334e68', '#2680c2', '#27ab83', '#e9b949', '#e12d39', '#8b5cf6', '#ec4899', '#f97316'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, font: { size: 11 } } }
          }
        }
      }));
    }

    // Cost timeline line chart
    const timelineMap = {};
    costs.forEach(c => {
      if (!c.date) return;
      const month = c.date.slice(0, 7);
      if (!timelineMap[month]) timelineMap[month] = { oneTime: 0, monthly: 0 };
      if (c.type === 'monthly' || c.type === 'recurring') {
        timelineMap[month].monthly += parseFloat(c.amount) || 0;
      } else {
        timelineMap[month].oneTime += parseFloat(c.amount) || 0;
      }
    });

    const timeLabels = Object.keys(timelineMap).sort();
    const timeCanvas = document.getElementById('chart-cost-timeline');
    if (timeCanvas && timeLabels.length > 0) {
      charts.push(new Chart(timeCanvas, {
        type: 'line',
        data: {
          labels: timeLabels,
          datasets: [
            {
              label: 'One-Time',
              data: timeLabels.map(l => timelineMap[l].oneTime),
              borderColor: '#334e68',
              backgroundColor: 'rgba(51,78,104,0.1)',
              fill: true, tension: 0.3
            },
            {
              label: 'Monthly',
              data: timeLabels.map(l => timelineMap[l].monthly),
              borderColor: '#de911d',
              backgroundColor: 'rgba(222,145,29,0.1)',
              fill: true, tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true } } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true }
          }
        }
      }));
    }
  }

  function destroyCharts() {
    charts.forEach(c => { try { c.destroy(); } catch (e) {} });
    charts = [];
  }

  function bindEvents() {
    container.querySelector('#cost-add-btn')?.addEventListener('click', () => openCostModal());

    container.querySelectorAll('.cost-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cost = costs.find(c => c.id === btn.dataset.costId);
        if (cost) openCostModal(cost);
      });
    });

    container.querySelectorAll('.cost-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteCost(btn.dataset.costId));
    });

    container.querySelector('#cost-save-revenue-btn')?.addEventListener('click', saveRevenue);
  }

  function openCostModal(existing = null) {
    const isEdit = !!existing;
    openModal({
      title: isEdit ? 'Edit Cost Entry' : 'Add Cost Entry',
      size: 'md',
      body: `
        <div class="form-group mb-3">
          <label class="form-label">Item Name <span class="required">*</span></label>
          <input type="text" id="cost-item-name" class="form-input" placeholder="e.g. EHR License" value="${escapeHtml(existing?.item || existing?.name || '')}">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)" class="mb-3">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select id="cost-item-category" class="form-select">
              <option value="">Select category</option>
              <option value="Technology" ${existing?.category === 'Technology' ? 'selected' : ''}>Technology</option>
              <option value="Operations" ${existing?.category === 'Operations' ? 'selected' : ''}>Operations</option>
              <option value="HR" ${existing?.category === 'HR' ? 'selected' : ''}>HR</option>
              <option value="Compliance" ${existing?.category === 'Compliance' ? 'selected' : ''}>Compliance</option>
              <option value="Marketing" ${existing?.category === 'Marketing' ? 'selected' : ''}>Marketing</option>
              <option value="Finance" ${existing?.category === 'Finance' ? 'selected' : ''}>Finance</option>
              <option value="Other" ${existing?.category === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Type</label>
            <select id="cost-item-type" class="form-select">
              <option value="one_time" ${existing?.type === 'one_time' ? 'selected' : ''}>One-Time</option>
              <option value="monthly" ${existing?.type === 'monthly' ? 'selected' : ''}>Monthly</option>
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)" class="mb-3">
          <div class="form-group">
            <label class="form-label">Amount <span class="required">*</span></label>
            <input type="number" id="cost-item-amount" class="form-input" step="0.01" placeholder="0.00" value="${existing?.amount || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Vendor</label>
            <input type="text" id="cost-item-vendor" class="form-input" placeholder="Vendor name" value="${escapeHtml(existing?.vendor || '')}">
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="form-label">Date</label>
          <input type="date" id="cost-item-date" class="form-input" value="${existing?.date ? existing.date.slice(0, 10) : ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Notes</label>
          <textarea id="cost-item-notes" class="form-textarea" rows="2">${escapeHtml(existing?.notes || '')}</textarea>
        </div>
      `,
      footer: [
        { label: 'Cancel', class: 'btn-secondary', onClick: () => closeModal() },
        { label: isEdit ? 'Update' : 'Add Entry', class: 'btn-primary', onClick: () => saveCost(existing?.id) }
      ]
    });
  }

  async function saveCost(existingId) {
    const item = document.getElementById('cost-item-name')?.value?.trim();
    const amount = document.getElementById('cost-item-amount')?.value;

    if (!item) { showToast('Item name is required', 'warning'); return; }
    if (!amount) { showToast('Amount is required', 'warning'); return; }

    const payload = {
      item,
      category: document.getElementById('cost-item-category')?.value || null,
      type: document.getElementById('cost-item-type')?.value || 'one_time',
      amount: parseFloat(amount),
      vendor: document.getElementById('cost-item-vendor')?.value?.trim() || null,
      date: document.getElementById('cost-item-date')?.value || null,
      notes: document.getElementById('cost-item-notes')?.value?.trim() || null
    };

    try {
      if (existingId) {
        await api.put(`/costs/location/${locationId}/entries/${existingId}`, payload);
        const idx = costs.findIndex(c => c.id === existingId);
        if (idx >= 0) costs[idx] = { ...costs[idx], ...payload };
        showToast('Cost entry updated', 'success');
      } else {
        const result = await api.post(`/costs/location/${locationId}/entries`, payload);
        costs.push(result.entry || result);
        showToast('Cost entry added', 'success');
      }
      closeModal();
      recalcSummary();
      render();
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    }
  }

  async function deleteCost(costId) {
    try {
      await api.delete(`/costs/location/${locationId}/entries/${costId}`);
      costs = costs.filter(c => c.id !== costId);
      recalcSummary();
      showToast('Cost entry deleted', 'success');
      render();
    } catch (err) {
      showToast('Failed to delete: ' + err.message, 'error');
    }
  }

  async function saveRevenue() {
    const monthlyRevenue = container.querySelector('#cost-monthly-revenue')?.value;
    const annualRevenue = container.querySelector('#cost-annual-revenue')?.value;
    const billingRate = container.querySelector('#cost-billing-rate')?.value;

    try {
      await api.put(`/costs/location/${locationId}/revenue`, {
        monthly_revenue: monthlyRevenue ? parseFloat(monthlyRevenue) : null,
        annual_revenue: annualRevenue ? parseFloat(annualRevenue) : null,
        billing_rate: billingRate ? parseFloat(billingRate) : null
      });
      summary.monthly_revenue = monthlyRevenue ? parseFloat(monthlyRevenue) : null;
      summary.annual_revenue = annualRevenue ? parseFloat(annualRevenue) : null;
      summary.revenue = annualRevenue ? parseFloat(annualRevenue) : null;
      summary.billing_rate = billingRate ? parseFloat(billingRate) : null;
      showToast('Revenue updated', 'success');
      render();
    } catch (err) {
      showToast('Failed to update revenue: ' + err.message, 'error');
    }
  }

  function recalcSummary() {
    let oneTime = 0, monthly = 0;
    costs.forEach(c => {
      const amt = parseFloat(c.amount) || 0;
      if (c.type === 'monthly' || c.type === 'recurring') {
        monthly += amt;
      } else {
        oneTime += amt;
      }
    });
    summary.one_time_cost = oneTime;
    summary.monthly_cost = monthly;
  }

  async function loadData() {
    renderLoading();
    try {
      const data = await api.get(`/costs/location/${locationId}`);
      costs = data.entries || data.costs || data.items || [];
      summary = data.summary || data || {};
      recalcSummary();
      render();
    } catch (err) {
      container.innerHTML = `
        <div class="p-6">
          <a href="#/locations/${locationId}" class="text-sm text-muted" style="text-decoration:none">&larr; Back to location</a>
          <div class="empty-state mt-5">
            <h3>Unable to Load Cost Data</h3>
            <p>${escapeHtml(err.message)}</p>
          </div>
        </div>`;
    }
  }

  loadData();

  return {
    destroy() {
      destroyed = true;
      destroyCharts();
    }
  };
}
