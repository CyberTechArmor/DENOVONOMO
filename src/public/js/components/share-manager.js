import api from '../api.js';
import { showToast } from './toast.js';
import { formatRelative } from '../utils/dates.js';

/**
 * Share Manager component.
 * Renders share management UI: list shares, create new, revoke, copy link.
 *
 * @param {HTMLElement} container - DOM element to render into
 * @param {object} opts
 * @param {string} opts.resourceType - e.g. 'document', 'location'
 * @param {string} opts.resourceId - The resource ID to share
 * @returns {object} API with refresh(), destroy()
 */
export function createShareManager(container, opts = {}) {
  const { resourceType, resourceId } = opts;
  let shares = [];
  let loading = true;
  let destroyed = false;

  function renderLoading() {
    container.innerHTML = `
      <div class="share-manager">
        <div class="share-manager-header" style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--color-border)">
          <h4 style="margin:0;font-size:0.95rem">Share Settings</h4>
        </div>
        <div style="padding:var(--space-4)">
          <div class="skeleton skeleton-text mb-3"></div>
          <div class="skeleton skeleton-text mb-3" style="width:70%"></div>
          <div class="skeleton skeleton-text" style="width:50%"></div>
        </div>
      </div>`;
  }

  function render() {
    if (destroyed) return;

    container.innerHTML = `
      <div class="share-manager">
        <div class="share-manager-header" style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--color-border)">
          <h4 style="margin:0;font-size:0.95rem">Share Settings</h4>
          <button class="btn btn-sm btn-primary" id="share-add-btn">+ Add Share</button>
        </div>

        <div id="share-new-form" style="display:none;padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--color-border);background:var(--color-bg-subtle)">
          <div class="form-group mb-3">
            <label class="form-label text-sm">Share with (email)</label>
            <input type="email" id="share-email" class="form-input" placeholder="user@example.com">
          </div>
          <div class="form-group mb-3">
            <label class="form-label text-sm">Permission</label>
            <select id="share-permission" class="form-select">
              <option value="view">View only</option>
              <option value="comment">Can comment</option>
              <option value="edit">Can edit</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-primary" id="share-create-btn">Share</button>
            <button class="btn btn-sm btn-secondary" id="share-cancel-btn">Cancel</button>
          </div>
        </div>

        <div class="share-manager-link" style="padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--color-border)">
          <div class="text-sm font-medium mb-2">Share Link</div>
          <div class="flex gap-2">
            <input type="text" id="share-link-input" class="form-input flex-1" readonly
              value="${window.location.origin}/shared/${resourceType}/${resourceId}"
              style="font-size:0.8125rem">
            <button class="btn btn-sm btn-secondary" id="share-copy-btn">Copy</button>
          </div>
        </div>

        <div class="share-manager-list" style="padding:var(--space-3) var(--space-4)">
          <div class="text-sm font-medium mb-3">Shared with (${shares.length})</div>
          ${shares.length === 0 ? `
            <div class="text-sm text-muted" style="padding:var(--space-3) 0">Not shared with anyone yet.</div>
          ` : shares.map(share => `
            <div class="share-item flex justify-between items-center" style="padding:var(--space-2) 0;border-bottom:1px solid var(--color-border)" data-share-id="${share.id}">
              <div class="flex items-center gap-3">
                <div style="width:32px;height:32px;border-radius:50%;background:var(--color-primary-100);color:var(--color-primary-700);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:600">
                  ${escapeHtml((share.email || share.user_email || '?').charAt(0).toUpperCase())}
                </div>
                <div>
                  <div class="text-sm font-medium">${escapeHtml(share.email || share.user_email || 'Unknown')}</div>
                  <div class="text-xs text-muted">${escapeHtml(share.permission || 'view')} &middot; ${formatRelative(share.created_at)}</div>
                </div>
              </div>
              <button class="btn btn-sm btn-ghost share-revoke-btn" data-share-id="${share.id}" title="Revoke" style="color:var(--color-danger)">
                &times;
              </button>
            </div>
          `).join('')}
        </div>
      </div>`;

    bindEvents();
  }

  function bindEvents() {
    const addBtn = container.querySelector('#share-add-btn');
    const form = container.querySelector('#share-new-form');
    const cancelBtn = container.querySelector('#share-cancel-btn');
    const createBtn = container.querySelector('#share-create-btn');
    const copyBtn = container.querySelector('#share-copy-btn');
    const linkInput = container.querySelector('#share-link-input');

    if (addBtn && form) {
      addBtn.addEventListener('click', () => {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (cancelBtn && form) {
      cancelBtn.addEventListener('click', () => { form.style.display = 'none'; });
    }

    if (createBtn) {
      createBtn.addEventListener('click', handleCreate);
    }

    if (copyBtn && linkInput) {
      copyBtn.addEventListener('click', () => {
        linkInput.select();
        navigator.clipboard.writeText(linkInput.value).then(() => {
          showToast('Link copied to clipboard', 'success');
          copyBtn.textContent = 'Copied!';
          setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
        }).catch(() => {
          document.execCommand('copy');
          showToast('Link copied', 'success');
        });
      });
    }

    container.querySelectorAll('.share-revoke-btn').forEach(btn => {
      btn.addEventListener('click', () => handleRevoke(btn.dataset.shareId));
    });
  }

  async function handleCreate() {
    const email = container.querySelector('#share-email')?.value?.trim();
    const permission = container.querySelector('#share-permission')?.value;

    if (!email) {
      showToast('Email is required', 'warning');
      return;
    }

    try {
      await api.post(`/${resourceType}s/${resourceId}/shares`, { email, permission });
      showToast('Shared successfully', 'success');
      await loadShares();
    } catch (err) {
      showToast('Failed to share: ' + err.message, 'error');
    }
  }

  async function handleRevoke(shareId) {
    try {
      await api.delete(`/${resourceType}s/${resourceId}/shares/${shareId}`);
      showToast('Share revoked', 'success');
      await loadShares();
    } catch (err) {
      showToast('Failed to revoke: ' + err.message, 'error');
    }
  }

  async function loadShares() {
    if (destroyed) return;
    try {
      loading = true;
      renderLoading();
      const data = await api.get(`/${resourceType}s/${resourceId}/shares`);
      shares = data.shares || data || [];
      loading = false;
      render();
    } catch {
      loading = false;
      shares = [];
      render();
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  loadShares();

  return {
    refresh: loadShares,
    destroy() {
      destroyed = true;
      container.innerHTML = '';
    }
  };
}
