import api from '../api.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { formatRelative } from '../utils/dates.js';
import { slugify, truncate } from '../utils/format.js';
import auth from '../auth.js';

const CATEGORY_COLORS = {
  'Getting Started': 'badge-info',
  'Technology': 'badge-success',
  'Operations': 'badge-warning',
  'Compliance': 'badge-error',
  'Finance': '',
  'HR': 'badge-info',
  'Marketing': 'badge-success'
};

function getCategoryBadgeClass(category) {
  return CATEGORY_COLORS[category] || '';
}

export default function documentsPage(params) {
  const container = document.getElementById('page-content');
  let documents = [];
  let categories = [];
  let selectedCategory = null;
  let selectedSubcategory = null;
  let searchQuery = '';
  let viewMode = 'grid'; // 'grid' or 'list'
  let expandedCategories = new Set();

  function renderLoading() {
    container.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-5">
          <h1>Document Library</h1>
        </div>
        <div class="flex gap-5">
          <div style="width:260px;flex-shrink:0">
            <div class="card">
              ${Array(5).fill('<div class="skeleton skeleton-text mb-3" style="width:80%"></div>').join('')}
            </div>
          </div>
          <div class="flex-1">
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-4)">
              ${Array(6).fill('<div class="card"><div class="skeleton skeleton-card"></div></div>').join('')}
            </div>
          </div>
        </div>
      </div>`;
  }

  function buildCategoryTree(docs) {
    const tree = {};
    docs.forEach(doc => {
      const cat = doc.category || 'Uncategorized';
      const sub = doc.subcategory || null;
      if (!tree[cat]) tree[cat] = { count: 0, subcategories: {} };
      tree[cat].count++;
      if (sub) {
        if (!tree[cat].subcategories[sub]) tree[cat].subcategories[sub] = 0;
        tree[cat].subcategories[sub]++;
      }
    });
    return tree;
  }

  function getFilteredDocs() {
    let filtered = documents;
    if (selectedCategory) {
      filtered = filtered.filter(d => (d.category || 'Uncategorized') === selectedCategory);
    }
    if (selectedSubcategory) {
      filtered = filtered.filter(d => d.subcategory === selectedSubcategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        (d.title || '').toLowerCase().includes(q) ||
        (d.category || '').toLowerCase().includes(q) ||
        (d.subcategory || '').toLowerCase().includes(q)
      );
    }
    return filtered;
  }

  function render() {
    const tree = buildCategoryTree(documents);
    const filtered = getFilteredDocs();
    const isSuperAdmin = auth.isSuperAdmin();

    container.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-5">
          <h1>Document Library</h1>
          <div class="flex gap-3 items-center">
            <div style="position:relative">
              <input type="text" id="doc-search" class="form-input" placeholder="Search documents..." style="width:260px;padding-left:36px" value="${searchQuery}">
              <svg style="position:absolute;left:10px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:var(--color-text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <div class="flex gap-1" style="border:1px solid var(--color-border);border-radius:var(--radius-default);overflow:hidden">
              <button class="btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}" id="view-grid" title="Grid view">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button class="btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}" id="view-list" title="List view">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>
            ${isSuperAdmin ? '<button class="btn btn-primary" id="new-doc-btn">New Document</button>' : ''}
          </div>
        </div>

        <div class="flex gap-5">
          <div style="width:260px;flex-shrink:0">
            <div class="card" style="padding:var(--space-3)">
              <div class="text-xs font-semibold text-muted" style="padding:var(--space-2) var(--space-3);text-transform:uppercase;letter-spacing:0.05em">Categories</div>
              <div id="category-tree">
                <div class="doc-cat-item ${!selectedCategory ? 'is-active' : ''}" data-category="" style="padding:var(--space-2) var(--space-3);border-radius:var(--radius-sm);cursor:pointer;font-size:0.875rem;display:flex;justify-content:space-between;align-items:center">
                  <span>All Documents</span>
                  <span class="text-xs text-muted">${documents.length}</span>
                </div>
                ${Object.entries(tree).map(([cat, info]) => {
                  const subs = Object.entries(info.subcategories);
                  const isExpanded = expandedCategories.has(cat);
                  const isActive = selectedCategory === cat && !selectedSubcategory;
                  return `
                    <div class="doc-cat-group">
                      <div class="doc-cat-item ${isActive ? 'is-active' : ''}" data-category="${cat}" style="padding:var(--space-2) var(--space-3);border-radius:var(--radius-sm);cursor:pointer;font-size:0.875rem;display:flex;justify-content:space-between;align-items:center">
                        <span class="flex items-center gap-2">
                          ${subs.length > 0 ? `<svg class="doc-cat-arrow" style="width:12px;height:12px;transition:transform 0.15s;${isExpanded ? 'transform:rotate(90deg)' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>` : '<span style="width:12px"></span>'}
                          ${cat}
                        </span>
                        <span class="text-xs text-muted">${info.count}</span>
                      </div>
                      ${subs.length > 0 ? `
                        <div class="doc-subcats" style="display:${isExpanded ? 'block' : 'none'};padding-left:var(--space-5)">
                          ${subs.map(([sub, count]) => `
                            <div class="doc-subcat-item ${selectedSubcategory === sub && selectedCategory === cat ? 'is-active' : ''}" data-category="${cat}" data-subcategory="${sub}" style="padding:var(--space-1) var(--space-3);border-radius:var(--radius-sm);cursor:pointer;font-size:0.8125rem;display:flex;justify-content:space-between;align-items:center">
                              <span>${sub}</span>
                              <span class="text-xs text-muted">${count}</span>
                            </div>
                          `).join('')}
                        </div>
                      ` : ''}
                    </div>`;
                }).join('')}
              </div>
            </div>
          </div>

          <div class="flex-1">
            ${filtered.length === 0 ? `
              <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                <h3>No Documents Found</h3>
                <p>${searchQuery ? 'Try adjusting your search terms.' : 'No documents in this category yet.'}</p>
              </div>
            ` : viewMode === 'grid' ? `
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-4)">
                ${filtered.map(doc => `
                  <div class="card cursor-pointer doc-card" data-slug="${doc.slug}" style="display:flex;flex-direction:column">
                    <div class="flex justify-between items-start mb-3">
                      <h4 style="font-size:0.95rem;flex:1;margin-right:var(--space-2)">${truncate(doc.title, 60)}</h4>
                    </div>
                    <div class="flex items-center gap-2 mb-3">
                      <span class="badge ${getCategoryBadgeClass(doc.category)}">${doc.category || 'Uncategorized'}</span>
                      ${doc.subcategory ? `<span class="badge" style="font-size:0.625rem">${doc.subcategory}</span>` : ''}
                    </div>
                    <div class="flex justify-between items-center text-xs text-muted" style="margin-top:auto">
                      <span>Updated ${formatRelative(doc.updated_at)}</span>
                      <span>${doc.version_count || 1} version${(doc.version_count || 1) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="card" style="padding:0;overflow:hidden">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Updated</th>
                      <th>Versions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filtered.map(doc => `
                      <tr class="cursor-pointer doc-card" data-slug="${doc.slug}">
                        <td><strong>${doc.title}</strong></td>
                        <td>
                          <span class="badge ${getCategoryBadgeClass(doc.category)}">${doc.category || 'Uncategorized'}</span>
                          ${doc.subcategory ? `<span class="badge" style="font-size:0.625rem;margin-left:4px">${doc.subcategory}</span>` : ''}
                        </td>
                        <td class="text-sm text-muted">${formatRelative(doc.updated_at)}</td>
                        <td class="text-sm text-muted">${doc.version_count || 1}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      </div>`;

    bindEvents();
  }

  function bindEvents() {
    // Search
    const searchInput = container.querySelector('#doc-search');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          searchQuery = searchInput.value.trim();
          render();
        }, 300);
      });
    }

    // View toggle
    container.querySelector('#view-grid')?.addEventListener('click', () => { viewMode = 'grid'; render(); });
    container.querySelector('#view-list')?.addEventListener('click', () => { viewMode = 'list'; render(); });

    // Category selection
    container.querySelectorAll('.doc-cat-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const cat = item.dataset.category;
        if (cat === '') {
          selectedCategory = null;
          selectedSubcategory = null;
        } else {
          selectedCategory = cat;
          selectedSubcategory = null;
          // Toggle expand
          const arrow = item.querySelector('.doc-cat-arrow');
          if (arrow) {
            if (expandedCategories.has(cat)) {
              expandedCategories.delete(cat);
            } else {
              expandedCategories.add(cat);
            }
          }
        }
        render();
      });
    });

    // Subcategory selection
    container.querySelectorAll('.doc-subcat-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedCategory = item.dataset.category;
        selectedSubcategory = item.dataset.subcategory;
        render();
      });
    });

    // Doc cards - navigate
    container.querySelectorAll('.doc-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.dataset.slug;
        if (slug) window.location.hash = `#/documents/${slug}`;
      });
    });

    // New document button
    container.querySelector('#new-doc-btn')?.addEventListener('click', openNewDocModal);

    // Style active items
    container.querySelectorAll('.doc-cat-item.is-active, .doc-subcat-item.is-active').forEach(el => {
      el.style.background = 'var(--color-primary-50)';
      el.style.color = 'var(--color-primary-700)';
      el.style.fontWeight = '600';
    });
    container.querySelectorAll('.doc-cat-item:not(.is-active), .doc-subcat-item:not(.is-active)').forEach(el => {
      el.addEventListener('mouseenter', () => { el.style.background = 'var(--color-bg-subtle)'; });
      el.addEventListener('mouseleave', () => { el.style.background = ''; });
    });
  }

  function openNewDocModal() {
    const uniqueCategories = [...new Set(documents.map(d => d.category).filter(Boolean))];
    const uniqueSubcategories = [...new Set(documents.map(d => d.subcategory).filter(Boolean))];

    openModal({
      title: 'New Document',
      size: 'md',
      body: `
        <div class="form-group">
          <label class="form-label">Title <span class="required">*</span></label>
          <input type="text" id="new-doc-title" class="form-input" placeholder="Document title">
        </div>
        <div class="form-group">
          <label class="form-label">Slug</label>
          <input type="text" id="new-doc-slug" class="form-input" placeholder="auto-generated-from-title">
          <div class="form-hint">Auto-generated from title. Edit if needed.</div>
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select id="new-doc-category" class="form-select">
            <option value="">Select category</option>
            ${uniqueCategories.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Subcategory</label>
          <input type="text" id="new-doc-subcategory" class="form-input" placeholder="Optional subcategory" list="subcategory-list">
          <datalist id="subcategory-list">
            ${uniqueSubcategories.map(s => `<option value="${s}">`).join('')}
          </datalist>
        </div>
        <div class="form-group">
          <label class="form-label">Initial Content</label>
          <textarea id="new-doc-content" class="form-textarea" rows="6" placeholder="# Document Title\n\nStart writing..."></textarea>
        </div>
      `,
      footer: [
        { label: 'Cancel', class: 'btn-secondary', onClick: () => closeModal() },
        { label: 'Create Document', class: 'btn-primary', onClick: handleCreateDoc }
      ]
    });

    // Auto-generate slug from title
    const titleInput = document.getElementById('new-doc-title');
    const slugInput = document.getElementById('new-doc-slug');
    if (titleInput && slugInput) {
      titleInput.addEventListener('input', () => {
        slugInput.value = slugify(titleInput.value);
      });
    }
  }

  async function handleCreateDoc() {
    const title = document.getElementById('new-doc-title')?.value?.trim();
    const slug = document.getElementById('new-doc-slug')?.value?.trim();
    const category = document.getElementById('new-doc-category')?.value;
    const subcategory = document.getElementById('new-doc-subcategory')?.value?.trim();
    const content = document.getElementById('new-doc-content')?.value;

    if (!title) {
      showToast('Title is required', 'warning');
      return;
    }

    try {
      const doc = await api.post('/documents', {
        title,
        slug: slug || slugify(title),
        category: category || null,
        subcategory: subcategory || null,
        content: content || ''
      });
      closeModal();
      showToast('Document created', 'success');
      const created = doc.document || doc;
      window.location.hash = `#/documents/${created.slug || slug || slugify(title)}`;
    } catch (err) {
      showToast('Failed to create document: ' + err.message, 'error');
    }
  }

  async function loadData() {
    renderLoading();
    try {
      const data = await api.get('/documents');
      documents = data.documents || data || [];
      categories = [...new Set(documents.map(d => d.category).filter(Boolean))];
      // Auto-expand first category
      if (categories.length > 0 && expandedCategories.size === 0) {
        expandedCategories.add(categories[0]);
      }
      render();
    } catch (err) {
      container.innerHTML = `
        <div class="p-6">
          <h1 class="mb-5">Document Library</h1>
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
            <h3>Unable to Load Documents</h3>
            <p>${err.message}</p>
          </div>
        </div>`;
    }
  }

  loadData();

  return { destroy() {} };
}
