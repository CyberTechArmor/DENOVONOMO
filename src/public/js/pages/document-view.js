import api from '../api.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { formatDate, formatDateTime, formatRelative } from '../utils/dates.js';
import { truncate } from '../utils/format.js';
import auth from '../auth.js';
import { createShareManager } from '../components/share-manager.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export default function documentViewPage(params) {
  const container = document.getElementById('page-content');
  let doc = null;
  let versions = [];
  let versionPanelOpen = false;
  let diffVisible = false;
  let diffVersionA = null;
  let diffVersionB = null;
  let shareManagerInstance = null;
  let destroyed = false;
  let docId = params.id; // may be slug initially, updated to UUID after load

  function renderLoading() {
    container.innerHTML = `
      <div class="p-6">
        <div class="skeleton skeleton-heading mb-4" style="width:40%"></div>
        <div class="flex gap-5">
          <div class="flex-1">
            <div class="card">
              <div class="skeleton skeleton-text mb-3"></div>
              <div class="skeleton skeleton-text mb-3" style="width:90%"></div>
              <div class="skeleton skeleton-text mb-3" style="width:80%"></div>
              <div class="skeleton skeleton-text mb-3" style="width:85%"></div>
              <div class="skeleton skeleton-text" style="width:60%"></div>
            </div>
          </div>
          <div style="width:220px;flex-shrink:0">
            <div class="card">
              <div class="skeleton skeleton-text mb-2"></div>
              <div class="skeleton skeleton-text mb-2" style="width:70%"></div>
              <div class="skeleton skeleton-text" style="width:50%"></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function generateTOC(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const headings = temp.querySelectorAll('h2, h3');
    const items = [];
    headings.forEach((h, i) => {
      const id = 'toc-heading-' + i;
      h.setAttribute('id', id);
      items.push({
        id,
        level: h.tagName === 'H2' ? 2 : 3,
        text: h.textContent
      });
    });
    return { items, html: temp.innerHTML };
  }

  function renderMarkdown(content) {
    if (typeof window.markdownit === 'function') {
      const md = window.markdownit({ html: false, linkify: true, typographer: true });
      return md.render(content || '');
    }
    return '<pre>' + escapeHtml(content || '') + '</pre>';
  }

  function render() {
    if (destroyed || !doc) return;

    const renderedHtml = renderMarkdown(doc.content || '');
    const { items: tocItems, html: htmlWithIds } = generateTOC(renderedHtml);
    const isEditor = auth.isEditor();
    const currentVersion = doc.version || doc.current_version || 1;

    container.innerHTML = `
      <div class="p-6">
        <!-- Top bar -->
        <div class="flex justify-between items-center mb-5">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <a href="#/documents" class="text-sm text-muted" style="text-decoration:none">&larr; Documents</a>
            </div>
            <h1 style="margin:0">${escapeHtml(doc.title || 'Untitled')}</h1>
            <div class="flex items-center gap-3 mt-2">
              ${doc.category ? `<span class="badge">${escapeHtml(doc.category)}</span>` : ''}
              ${doc.subcategory ? `<span class="badge" style="font-size:0.625rem">${escapeHtml(doc.subcategory)}</span>` : ''}
              <span class="text-xs text-muted">v${currentVersion}</span>
              <span class="text-xs text-muted">&middot; Updated ${formatRelative(doc.updated_at)}</span>
              ${doc.author_name ? `<span class="text-xs text-muted">&middot; by ${escapeHtml(doc.author_name)}</span>` : ''}
            </div>
          </div>
          <div class="flex gap-2">
            ${isEditor ? `<a href="#/documents/${docId}/edit" class="btn btn-primary">Edit</a>` : ''}
            <button class="btn btn-secondary" id="docview-share-btn">Share</button>
            <button class="btn btn-secondary" id="docview-print-btn">Print</button>
            <button class="btn btn-secondary" id="docview-pdf-btn">PDF</button>
            <button class="btn btn-secondary" id="docview-versions-btn">Versions</button>
          </div>
        </div>

        <div class="flex gap-5">
          <!-- Main content -->
          <div class="flex-1">
            <div class="card" style="padding:var(--space-5)">
              <div class="document-content" id="docview-content" style="line-height:1.8;font-size:0.95rem">
                ${htmlWithIds}
              </div>
            </div>
          </div>

          <!-- Table of Contents (right rail) -->
          ${tocItems.length > 0 ? `
            <div style="width:220px;flex-shrink:0" id="docview-toc-rail">
              <div class="card" style="padding:var(--space-3);position:sticky;top:var(--space-4)">
                <div class="text-xs font-semibold text-muted mb-3" style="text-transform:uppercase;letter-spacing:0.05em">Contents</div>
                <nav>
                  ${tocItems.map(item => `
                    <a href="#${item.id}" class="docview-toc-item" style="
                      display:block;
                      padding:3px 0 3px ${item.level === 3 ? 'var(--space-4)' : '0'};
                      font-size:${item.level === 3 ? '0.75rem' : '0.8125rem'};
                      color:var(--color-text-muted);
                      text-decoration:none;
                      border-left:2px solid transparent;
                      padding-left:var(--space-3);
                    ">${escapeHtml(item.text)}</a>
                  `).join('')}
                </nav>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Version history slide-out panel -->
        <div id="docview-version-panel" class="version-panel" style="
          position:fixed;top:0;right:0;width:420px;height:100vh;
          background:var(--color-bg);border-left:1px solid var(--color-border);
          box-shadow:-4px 0 16px rgba(0,0,0,0.1);z-index:40;
          transform:translateX(100%);transition:transform 0.3s ease;
          overflow-y:auto;
        ">
          <div style="padding:var(--space-4);border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center">
            <h3 style="margin:0">Version History</h3>
            <button class="btn btn-ghost btn-sm" id="docview-versions-close">&times;</button>
          </div>

          <div style="padding:var(--space-3) var(--space-4)">
            <div class="text-sm font-medium mb-3">Compare versions</div>
            <div class="flex gap-2 mb-4">
              <select id="diff-version-a" class="form-select" style="flex:1">
                <option value="">Version A</option>
              </select>
              <select id="diff-version-b" class="form-select" style="flex:1">
                <option value="">Version B</option>
              </select>
              <button class="btn btn-sm btn-secondary" id="diff-compare-btn">Diff</button>
            </div>
            <div id="diff-container"></div>
          </div>

          <div id="docview-versions-list" style="padding:var(--space-3) var(--space-4)">
            <div class="text-sm font-medium mb-3">All Versions</div>
          </div>
        </div>

        <!-- Share panel (rendered into modal) -->
      </div>`;

    bindEvents();
  }

  function bindEvents() {
    // Share
    container.querySelector('#docview-share-btn')?.addEventListener('click', openSharePanel);

    // Print
    container.querySelector('#docview-print-btn')?.addEventListener('click', () => {
      window.print();
    });

    // PDF download
    container.querySelector('#docview-pdf-btn')?.addEventListener('click', handlePdfDownload);

    // Version panel toggle
    container.querySelector('#docview-versions-btn')?.addEventListener('click', () => toggleVersionPanel(true));
    container.querySelector('#docview-versions-close')?.addEventListener('click', () => toggleVersionPanel(false));

    // Diff compare
    container.querySelector('#diff-compare-btn')?.addEventListener('click', handleDiffCompare);

    // TOC smooth scroll
    container.querySelectorAll('.docview-toc-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function toggleVersionPanel(open) {
    versionPanelOpen = open;
    const panel = container.querySelector('#docview-version-panel');
    if (panel) {
      panel.style.transform = open ? 'translateX(0)' : 'translateX(100%)';
    }
    if (open && versions.length === 0) {
      loadVersions();
    }
  }

  async function loadVersions() {
    const list = container.querySelector('#docview-versions-list');
    const selectA = container.querySelector('#diff-version-a');
    const selectB = container.querySelector('#diff-version-b');

    if (list) {
      list.innerHTML = `
        <div class="text-sm font-medium mb-3">All Versions</div>
        <div class="skeleton skeleton-text mb-2"></div>
        <div class="skeleton skeleton-text mb-2" style="width:80%"></div>
      `;
    }

    try {
      const data = await api.get(`/documents/${docId}/versions`);
      versions = data.versions || data || [];

      // Populate selects
      if (selectA && selectB) {
        const optionsHtml = versions.map(v =>
          `<option value="${v.version || v.id}">v${v.version || v.id}${v.change_summary ? ' - ' + escapeHtml(truncate(v.change_summary, 30)) : ''}</option>`
        ).join('');
        selectA.innerHTML = '<option value="">Version A</option>' + optionsHtml;
        selectB.innerHTML = '<option value="">Version B</option>' + optionsHtml;
      }

      // Render version list
      if (list) {
        list.innerHTML = `
          <div class="text-sm font-medium mb-3">All Versions (${versions.length})</div>
          ${versions.length === 0 ? '<div class="text-sm text-muted">No version history available.</div>' :
            versions.map(v => `
              <div class="version-item" style="padding:var(--space-3);border:1px solid var(--color-border);border-radius:var(--radius-default);margin-bottom:var(--space-2)">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-medium text-sm">v${v.version || v.id}</span>
                  <span class="badge ${v.status === 'approved' ? 'badge-success' : v.status === 'pending_review' ? 'badge-warning' : ''}" style="font-size:0.625rem">
                    ${escapeHtml(v.status || 'published')}
                  </span>
                </div>
                ${v.change_summary ? `<div class="text-sm" style="margin-bottom:4px">${escapeHtml(v.change_summary)}</div>` : ''}
                <div class="text-xs text-muted">
                  ${v.author_name ? escapeHtml(v.author_name) + ' &middot; ' : ''}${formatDateTime(v.created_at)}
                </div>
                <button class="btn btn-sm btn-ghost mt-2 version-restore-btn" data-version="${v.version || v.id}" style="font-size:0.75rem">
                  View this version
                </button>
              </div>
            `).join('')}`;

        list.querySelectorAll('.version-restore-btn').forEach(btn => {
          btn.addEventListener('click', () => loadVersion(btn.dataset.version));
        });
      }
    } catch (err) {
      if (list) {
        list.innerHTML = `
          <div class="text-sm font-medium mb-3">All Versions</div>
          <div class="text-sm text-muted">Failed to load versions.</div>`;
      }
    }
  }

  async function loadVersion(version) {
    try {
      const data = await api.get(`/documents/${docId}/versions/${version}`);
      const content = data.content || data.document?.content || '';
      const contentEl = container.querySelector('#docview-content');
      if (contentEl) {
        contentEl.innerHTML = renderMarkdown(content);
        showToast(`Viewing version ${version}`, 'info');
      }
    } catch (err) {
      showToast('Failed to load version: ' + err.message, 'error');
    }
  }

  async function handleDiffCompare() {
    const vA = container.querySelector('#diff-version-a')?.value;
    const vB = container.querySelector('#diff-version-b')?.value;
    const diffContainer = container.querySelector('#diff-container');

    if (!vA || !vB) {
      showToast('Select two versions to compare', 'warning');
      return;
    }

    if (vA === vB) {
      showToast('Select different versions', 'warning');
      return;
    }

    if (!diffContainer) return;

    diffContainer.innerHTML = '<div class="text-sm text-muted">Loading diff...</div>';

    try {
      const data = await api.get(`/documents/${docId}/diff?from=${vA}&to=${vB}`);
      const diffData = data.diff || data.changes || [];

      if (diffData.length === 0) {
        diffContainer.innerHTML = '<div class="text-sm text-muted">No differences found.</div>';
        return;
      }

      // Use DiffViewer if available
      if (window.DiffViewer && typeof window.DiffViewer.renderDiff === 'function') {
        window.DiffViewer.renderDiff(diffContainer, diffData);
      } else {
        // Fallback: simple diff rendering
        diffContainer.innerHTML = diffData.map(chunk => {
          const cls = chunk.type === 'added' ? 'background:#d4edda;color:#155724' :
                      chunk.type === 'removed' ? 'background:#f8d7da;color:#721c24' : '';
          const prefix = chunk.type === 'added' ? '+' : chunk.type === 'removed' ? '-' : ' ';
          return chunk.value.split('\n').filter(l => l !== '').map(line =>
            `<div style="font-family:monospace;font-size:0.8rem;padding:1px 8px;${cls}"><span style="color:var(--color-text-muted);margin-right:8px">${prefix}</span>${escapeHtml(line)}</div>`
          ).join('');
        }).join('');
      }
    } catch (err) {
      diffContainer.innerHTML = `<div class="text-sm text-muted">Failed to load diff: ${escapeHtml(err.message)}</div>`;
    }
  }

  function openSharePanel() {
    const { bodyEl } = openModal({
      title: 'Share Document',
      size: 'md',
      body: '<div id="share-manager-mount"></div>',
      closable: true,
      onClose: () => {
        if (shareManagerInstance) {
          shareManagerInstance.destroy();
          shareManagerInstance = null;
        }
      }
    });

    const mount = bodyEl.querySelector('#share-manager-mount');
    if (mount) {
      shareManagerInstance = createShareManager(mount, {
        resourceType: 'document',
        resourceId: docId
      });
    }
  }

  async function handlePdfDownload() {
    const btn = container.querySelector('#docview-pdf-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Generating...';
    }

    try {
      const response = await fetch(`/api/documents/${docId}/pdf`);
      if (!response.ok) throw new Error('PDF generation failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.title || 'document'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('PDF downloaded', 'success');
    } catch (err) {
      showToast('PDF download failed: ' + err.message, 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'PDF';
      }
    }
  }

  async function loadData() {
    renderLoading();
    try {
      const data = await api.get(`/documents/${params.id}`);
      doc = data.document || data;
      if (doc.id) docId = doc.id; // use real UUID for subsequent API calls
      render();
    } catch (err) {
      container.innerHTML = `
        <div class="p-6">
          <a href="#/documents" class="text-sm text-muted" style="text-decoration:none">&larr; Back to Documents</a>
          <div class="empty-state mt-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px">
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
            </svg>
            <h3>Document Not Found</h3>
            <p>${escapeHtml(err.message)}</p>
          </div>
        </div>`;
    }
  }

  loadData();

  return {
    destroy() {
      destroyed = true;
      if (shareManagerInstance) {
        shareManagerInstance.destroy();
        shareManagerInstance = null;
      }
    }
  };
}
