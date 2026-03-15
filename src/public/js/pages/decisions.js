import api from '../api.js';
import { showToast } from '../components/toast.js';
import { formatCurrency } from '../utils/format.js';
import auth from '../auth.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export default function decisionsPage(params) {
  const container = document.getElementById('page-content');
  const locationId = params.id;

  let templates = [];
  let decisions = [];
  let categories = [];
  let currentCategoryIndex = 0;
  let currentStepIndex = 0;
  let viewMode = 'step'; // 'step' or 'summary'
  let destroyed = false;

  function renderLoading() {
    container.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-5">
          <div class="skeleton skeleton-heading" style="width:30%"></div>
        </div>
        <div class="flex gap-5">
          <div style="width:280px;flex-shrink:0">
            <div class="card">
              ${Array(6).fill('<div class="skeleton skeleton-text mb-3" style="width:80%"></div>').join('')}
            </div>
          </div>
          <div class="flex-1">
            <div class="card">
              <div class="skeleton skeleton-heading mb-4"></div>
              <div class="skeleton skeleton-text mb-3" style="width:90%"></div>
              <div class="skeleton skeleton-card" style="height:200px"></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function buildCategories() {
    const catMap = {};
    templates.forEach(t => {
      const cat = t.category || 'General';
      if (!catMap[cat]) catMap[cat] = [];
      catMap[cat].push(t);
    });
    categories = Object.entries(catMap).map(([name, items]) => ({
      name,
      items,
      decidedCount: items.filter(item => {
        const d = decisions.find(dec => dec.template_id === item.id || dec.item_key === item.id);
        return d && d.status !== 'pending';
      }).length
    }));
  }

  function getCurrentTemplate() {
    if (!categories[currentCategoryIndex]) return null;
    return categories[currentCategoryIndex].items[currentStepIndex] || null;
  }

  function getCurrentDecision() {
    const tmpl = getCurrentTemplate();
    if (!tmpl) return null;
    return decisions.find(d => d.template_id === tmpl.id || d.item_key === tmpl.id) || null;
  }

  function getOverallProgress() {
    const total = templates.length;
    if (total === 0) return 0;
    // Count templates that have a matching non-pending decision
    const decided = templates.filter(t =>
      decisions.some(d => (d.template_id === t.id || d.item_key === t.id) && d.status !== 'pending')
    ).length;
    return Math.round((decided / total) * 100);
  }

  function render() {
    if (destroyed) return;

    if (viewMode === 'summary') {
      renderSummary();
      return;
    }

    const tmpl = getCurrentTemplate();
    const decision = getCurrentDecision();
    const progress = getOverallProgress();

    container.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-5">
          <div>
            <a href="#/locations/${locationId}" class="text-sm text-muted" style="text-decoration:none">&larr; Back to location</a>
            <h1 style="margin:var(--space-2) 0 0">Decision Engine</h1>
          </div>
          <div class="flex gap-2 items-center">
            <button class="btn btn-secondary" id="dec-summary-btn">Summary</button>
            <button class="btn btn-secondary" id="dec-export-btn">Export Report</button>
          </div>
        </div>

        <!-- Overall progress bar -->
        <div class="mb-5">
          <div class="flex justify-between text-sm mb-1">
            <span>Overall Progress</span>
            <span class="font-medium">${progress}%</span>
          </div>
          <div style="height:8px;background:var(--color-bg-subtle);border-radius:4px;overflow:hidden">
            <div style="height:100%;width:${progress}%;background:var(--color-primary);border-radius:4px;transition:width 0.3s ease"></div>
          </div>
        </div>

        <div class="flex gap-5">
          <!-- Left progress panel -->
          <div style="width:280px;flex-shrink:0">
            <div class="card" style="padding:var(--space-3)">
              <div class="text-xs font-semibold text-muted mb-3" style="text-transform:uppercase;letter-spacing:0.05em">Categories</div>
              ${categories.map((cat, catIdx) => `
                <div class="dec-cat-item ${catIdx === currentCategoryIndex ? 'is-active' : ''}" data-cat-idx="${catIdx}" style="
                  padding:var(--space-2) var(--space-3);border-radius:var(--radius-sm);cursor:pointer;
                  font-size:0.875rem;display:flex;justify-content:space-between;align-items:center;
                  ${catIdx === currentCategoryIndex ? 'background:var(--color-primary-50);color:var(--color-primary-700);font-weight:600' : ''}
                ">
                  <span class="flex items-center gap-2">
                    ${cat.decidedCount === cat.items.length
                      ? '<span style="color:var(--color-success);font-size:14px">&#10003;</span>'
                      : cat.decidedCount > 0
                        ? '<span style="color:var(--color-warning);font-size:14px">&#9679;</span>'
                        : '<span style="color:var(--color-text-muted);font-size:14px">&#9675;</span>'
                    }
                    ${escapeHtml(cat.name)}
                  </span>
                  <span class="text-xs text-muted">${cat.decidedCount}/${cat.items.length}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Main decision area -->
          <div class="flex-1">
            ${!tmpl ? `
              <div class="empty-state">
                <h3>All Decisions Complete</h3>
                <p>You have addressed all decision items. View the summary for a complete overview.</p>
                <button class="btn btn-primary mt-3" id="dec-goto-summary">View Summary</button>
              </div>
            ` : `
              <div class="card" style="padding:var(--space-5)">
                <!-- Step header -->
                <div class="flex justify-between items-center mb-4">
                  <div>
                    <span class="badge mb-2">${escapeHtml(categories[currentCategoryIndex]?.name || '')}</span>
                    <h2 style="margin:var(--space-2) 0 0">${escapeHtml(tmpl.question || tmpl.title || 'Decision')}</h2>
                  </div>
                  <span class="text-sm text-muted">Step ${currentStepIndex + 1} of ${categories[currentCategoryIndex]?.items.length || 0}</span>
                </div>

                ${tmpl.context ? `
                  <div class="mb-5" style="padding:var(--space-3);background:var(--color-bg-subtle);border-radius:var(--radius-default);font-size:0.875rem;line-height:1.6">
                    ${escapeHtml(tmpl.context)}
                  </div>
                ` : ''}

                <!-- Option cards -->
                <div class="mb-5" id="dec-options">
                  <div class="text-sm font-medium mb-3">Options</div>
                  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-3)">
                    ${(tmpl.options || []).map((opt, optIdx) => {
                      const isSelected = decision?.selected_option_id === opt.id || decision?.selected_option === opt.name || decision?.selected_option === opt.id;
                      return `
                        <div class="dec-option-card" data-option-idx="${optIdx}" data-option-id="${opt.id}" style="
                          border:2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'};
                          border-radius:var(--radius-default);padding:var(--space-4);cursor:pointer;
                          ${isSelected ? 'background:var(--color-primary-50)' : ''}
                          transition:border-color 0.15s ease,background 0.15s ease;
                        ">
                          <div class="flex justify-between items-start mb-2">
                            <h4 style="margin:0;font-size:0.95rem">${escapeHtml(opt.name || opt.title || 'Option ' + (optIdx + 1))}</h4>
                            ${opt.type ? `<span class="badge" style="font-size:0.625rem">${escapeHtml(opt.type)}</span>` : ''}
                          </div>
                          ${opt.cost_range || opt.cost_min != null ? `
                            <div class="text-sm font-medium mb-2" style="color:var(--color-primary-700)">
                              ${opt.cost_range || (formatCurrency(opt.cost_min || 0) + ' - ' + formatCurrency(opt.cost_max || 0))}
                            </div>
                          ` : ''}
                          ${opt.description ? `<div class="text-sm text-muted mb-2">${escapeHtml(opt.description)}</div>` : ''}

                          <div class="dec-option-details" style="display:none;margin-top:var(--space-3)">
                            ${opt.benefits && opt.benefits.length ? `
                              <div class="mb-2">
                                <div class="text-xs font-semibold" style="color:var(--color-success)">Benefits</div>
                                <ul style="margin:4px 0;padding-left:var(--space-4);font-size:0.8125rem">
                                  ${opt.benefits.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
                                </ul>
                              </div>
                            ` : ''}
                            ${opt.risks && opt.risks.length ? `
                              <div>
                                <div class="text-xs font-semibold" style="color:var(--color-danger)">Risks</div>
                                <ul style="margin:4px 0;padding-left:var(--space-4);font-size:0.8125rem">
                                  ${opt.risks.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                                </ul>
                              </div>
                            ` : ''}
                          </div>

                          <button class="btn btn-sm btn-ghost dec-expand-btn" style="margin-top:var(--space-2);font-size:0.75rem">
                            Show details
                          </button>
                        </div>`;
                    }).join('')}
                  </div>
                </div>

                <!-- Selection form -->
                <div class="mb-4" style="border-top:1px solid var(--color-border);padding-top:var(--space-4)">
                  <div class="form-group mb-3">
                    <label class="form-label text-sm">Reasoning / Notes</label>
                    <textarea id="dec-reasoning" class="form-textarea" rows="3" placeholder="Why did you choose this option?">${escapeHtml(decision?.reasoning || '')}</textarea>
                  </div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">
                    <div class="form-group">
                      <label class="form-label text-sm">Vendor (optional)</label>
                      <input type="text" id="dec-vendor" class="form-input" placeholder="Vendor name" value="${escapeHtml(decision?.vendor || '')}">
                    </div>
                    <div class="form-group">
                      <label class="form-label text-sm">Cost Override</label>
                      <input type="number" id="dec-cost" class="form-input" placeholder="0.00" step="0.01" value="${decision?.cost_override != null ? decision.cost_override : ''}">
                    </div>
                  </div>
                </div>

                <!-- Navigation buttons -->
                <div class="flex justify-between items-center" style="border-top:1px solid var(--color-border);padding-top:var(--space-4)">
                  <button class="btn btn-secondary" id="dec-back-btn" ${currentCategoryIndex === 0 && currentStepIndex === 0 ? 'disabled' : ''}>Back</button>
                  <div class="flex gap-2">
                    <button class="btn btn-ghost" id="dec-skip-btn">Skip</button>
                    <button class="btn btn-ghost" id="dec-na-btn">N/A</button>
                    <button class="btn btn-primary" id="dec-save-next-btn">Save &amp; Next</button>
                  </div>
                </div>
              </div>
            `}
          </div>
        </div>
      </div>`;

    bindEvents();
  }

  function renderSummary() {
    if (destroyed) return;
    const progress = getOverallProgress();

    container.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-5">
          <div>
            <a href="#/locations/${locationId}" class="text-sm text-muted" style="text-decoration:none">&larr; Back to location</a>
            <h1 style="margin:var(--space-2) 0 0">Decision Summary</h1>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary" id="dec-back-to-steps">Back to Steps</button>
            <button class="btn btn-primary" id="dec-export-btn2">Export Report</button>
          </div>
        </div>

        <div class="mb-5">
          <div class="flex justify-between text-sm mb-1">
            <span>Overall Progress</span>
            <span class="font-medium">${progress}%</span>
          </div>
          <div style="height:8px;background:var(--color-bg-subtle);border-radius:4px;overflow:hidden">
            <div style="height:100%;width:${progress}%;background:var(--color-primary);border-radius:4px"></div>
          </div>
        </div>

        <div class="card" style="padding:0;overflow:hidden">
          <table class="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Decision</th>
                <th>Selected Option</th>
                <th>Vendor</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${templates.map(tmpl => {
                const dec = decisions.find(d => d.template_id === tmpl.id || d.item_key === tmpl.id);
                const selectedOpt = dec ? (tmpl.options || []).find(o => o.id === dec.selected_option_id || o.name === dec.selected_option || o.id === dec.selected_option) : null;
                const status = dec?.status || 'pending';
                const statusBadge = status === 'decided' ? 'badge-success'
                  : status === 'skipped' ? 'badge-warning'
                  : status === 'na' ? ''
                  : 'badge-info';
                return `
                  <tr>
                    <td><span class="badge" style="font-size:0.625rem">${escapeHtml(tmpl.category || 'General')}</span></td>
                    <td class="font-medium">${escapeHtml(tmpl.question || tmpl.title || '')}</td>
                    <td>${selectedOpt ? escapeHtml(selectedOpt.name || '') : '<span class="text-muted">-</span>'}</td>
                    <td>${dec?.vendor ? escapeHtml(dec.vendor) : '<span class="text-muted">-</span>'}</td>
                    <td>${dec?.cost_override != null ? formatCurrency(dec.cost_override) : '<span class="text-muted">-</span>'}</td>
                    <td><span class="badge ${statusBadge}">${escapeHtml(status)}</span></td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;

    container.querySelector('#dec-back-to-steps')?.addEventListener('click', () => {
      viewMode = 'step';
      render();
    });

    container.querySelector('#dec-export-btn2')?.addEventListener('click', handleExport);
  }

  function bindEvents() {
    // Category selection
    container.querySelectorAll('.dec-cat-item').forEach(item => {
      item.addEventListener('click', () => {
        currentCategoryIndex = parseInt(item.dataset.catIdx, 10);
        currentStepIndex = 0;
        render();
      });
    });

    // Option card selection
    container.querySelectorAll('.dec-option-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.dec-expand-btn')) return;
        // Deselect all
        container.querySelectorAll('.dec-option-card').forEach(c => {
          c.style.borderColor = 'var(--color-border)';
          c.style.background = '';
        });
        // Select this one
        card.style.borderColor = 'var(--color-primary)';
        card.style.background = 'var(--color-primary-50)';
        card.setAttribute('data-selected', 'true');
      });
    });

    // Expand/collapse details
    container.querySelectorAll('.dec-expand-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.dec-option-card');
        const details = card?.querySelector('.dec-option-details');
        if (details) {
          const isHidden = details.style.display === 'none';
          details.style.display = isHidden ? 'block' : 'none';
          btn.textContent = isHidden ? 'Hide details' : 'Show details';
        }
      });
    });

    // Navigation
    container.querySelector('#dec-back-btn')?.addEventListener('click', goBack);
    container.querySelector('#dec-skip-btn')?.addEventListener('click', () => saveDecision('skipped'));
    container.querySelector('#dec-na-btn')?.addEventListener('click', () => saveDecision('na'));
    container.querySelector('#dec-save-next-btn')?.addEventListener('click', () => saveDecision('decided'));

    // Summary/Export
    container.querySelector('#dec-summary-btn')?.addEventListener('click', () => {
      viewMode = 'summary';
      render();
    });
    container.querySelector('#dec-goto-summary')?.addEventListener('click', () => {
      viewMode = 'summary';
      render();
    });
    container.querySelector('#dec-export-btn')?.addEventListener('click', handleExport);
  }

  function goBack() {
    if (currentStepIndex > 0) {
      currentStepIndex--;
    } else if (currentCategoryIndex > 0) {
      currentCategoryIndex--;
      currentStepIndex = (categories[currentCategoryIndex]?.items.length || 1) - 1;
    }
    render();
  }

  function goNext() {
    const catItems = categories[currentCategoryIndex]?.items || [];
    if (currentStepIndex < catItems.length - 1) {
      currentStepIndex++;
    } else if (currentCategoryIndex < categories.length - 1) {
      currentCategoryIndex++;
      currentStepIndex = 0;
    } else {
      viewMode = 'summary';
    }
    render();
  }

  async function saveDecision(status) {
    const tmpl = getCurrentTemplate();
    if (!tmpl) { goNext(); return; }

    const reasoning = container.querySelector('#dec-reasoning')?.value?.trim() || '';
    const vendor = container.querySelector('#dec-vendor')?.value?.trim() || '';
    const costOverride = container.querySelector('#dec-cost')?.value;

    // Find selected option
    let selectedOptionId = null;
    const selectedCard = container.querySelector('.dec-option-card[data-selected="true"]');
    if (selectedCard) {
      selectedOptionId = selectedCard.dataset.optionId;
    }

    // For "decided", require selection
    if (status === 'decided' && !selectedOptionId) {
      showToast('Please select an option first', 'warning');
      return;
    }

    // Find selected option name for the backend
    let selectedOptionName = null;
    if (selectedOptionId && tmpl.options) {
      const opt = tmpl.options.find(o => o.id === selectedOptionId);
      if (opt) selectedOptionName = opt.name;
    }

    // Extract category and subcategory from template category (format: "Category — Subcategory")
    const catParts = (tmpl.category || '').split(' — ');
    const templateCategory = catParts[0] || 'General';
    const templateSubcategory = catParts[1] || null;

    try {
      const payload = {
        item_key: tmpl.id,
        category: templateCategory,
        subcategory: templateSubcategory,
        selected_option: selectedOptionName,
        status: status === 'na' ? 'not_applicable' : status,
        reasoning,
        vendors: vendor ? JSON.stringify([vendor]) : null,
        estimated_cost_onetime: costOverride ? parseFloat(costOverride) : null,
      };

      const result = await api.post(`/decisions/location/${locationId}`, payload);

      // Update local decisions
      const existing = decisions.findIndex(d => d.template_id === tmpl.id || d.item_key === tmpl.id);
      const newDec = result.decision || result || payload;
      if (existing >= 0) {
        decisions[existing] = { ...decisions[existing], ...newDec };
      } else {
        decisions.push(newDec);
      }
      buildCategories();

      showToast(
        status === 'decided' ? 'Decision saved' : status === 'skipped' ? 'Skipped' : 'Marked as N/A',
        'success'
      );
      goNext();
    } catch (err) {
      showToast('Failed to save decision: ' + err.message, 'error');
    }
  }

  async function handleExport() {
    try {
      const response = await fetch(`/api/decisions/location/${locationId}/export`);
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `decisions-report-${locationId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Report exported', 'success');
    } catch (err) {
      showToast('Export failed: ' + err.message, 'error');
    }
  }

  async function loadData() {
    renderLoading();
    try {
      const [tmplData, decData] = await Promise.all([
        api.get('/decisions/templates'),
        api.get(`/decisions/location/${locationId}`)
      ]);

      templates = tmplData.templates || tmplData || [];
      decisions = decData.decisions || decData || [];
      buildCategories();
      render();
    } catch (err) {
      container.innerHTML = `
        <div class="p-6">
          <a href="#/locations/${locationId}" class="text-sm text-muted" style="text-decoration:none">&larr; Back to location</a>
          <div class="empty-state mt-5">
            <h3>Unable to Load Decision Engine</h3>
            <p>${escapeHtml(err.message)}</p>
          </div>
        </div>`;
    }
  }

  loadData();

  return {
    destroy() { destroyed = true; }
  };
}
