import auth from './auth.js';
import Router from './router.js';
import ws from './websocket.js';
import { showToast } from './components/toast.js';
import { openModal, closeModal } from './components/modal.js';
import { registerShortcut } from './utils/shortcuts.js';
import api from './api.js';

// Import page modules
import dashboardPage from './pages/dashboard.js';
import documentsPage from './pages/documents.js';
import documentViewPage from './pages/document-view.js';
import documentEditPage from './pages/document-edit.js';
import decisionsPage from './pages/decisions.js';
import kanbanPage from './pages/kanban.js';
import costsPage from './pages/costs.js';
import usersPage from './pages/users.js';
import profilePage from './pages/profile.js';

let router = null;

// Locations page (renders a list of locations with links to decisions/checklist/costs)
function locationsPage() {
  const el = document.getElementById('page-content');
  el.innerHTML = '<div class="p-6"><div class="spinner"></div></div>';

  api.get('/locations').then(data => {
    const locations = data.locations || data || [];
    el.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h1>Locations</h1>
          ${auth.isEditor() ? '<button class="btn btn-primary" id="add-location-btn">New Location</button>' : ''}
        </div>
        ${locations.length === 0 ? `
          <div class="card p-8 text-center">
            <p class="text-muted mb-4">No locations yet. Create your first location to get started.</p>
            ${auth.isEditor() ? '<button class="btn btn-primary" id="add-location-btn2">Create Location</button>' : ''}
          </div>
        ` : `
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:var(--space-5)">
            ${locations.map(loc => `
              <div class="card" style="cursor:pointer" data-loc-id="${loc.id}">
                <div class="card-body">
                  <div class="flex justify-between items-center mb-3">
                    <h3 style="margin:0">${loc.name}</h3>
                    <span class="badge badge-${loc.status === 'active' ? 'success' : loc.status === 'setup' ? 'warning' : 'info'}">${loc.status}</span>
                  </div>
                  <p class="text-muted text-sm mb-3">${loc.address || 'No address'}</p>
                  <span class="badge">${loc.location_type === 'de_novo' ? 'De Novo' : 'Expansion'}</span>
                  <div class="flex gap-3 mt-4">
                    <a href="#/locations/${loc.id}/decisions" class="btn btn-sm btn-secondary">Decisions</a>
                    <a href="#/locations/${loc.id}/checklist" class="btn btn-sm btn-secondary">Checklist</a>
                    <a href="#/locations/${loc.id}/costs" class="btn btn-sm btn-secondary">Costs</a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>`;

    // Add location button handler(s)
    el.querySelectorAll('#add-location-btn, #add-location-btn2').forEach(btn => {
      btn.addEventListener('click', () => showAddLocationModal());
    });

    // Card click
    el.querySelectorAll('[data-loc-id]').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        window.location.hash = `/locations/${card.dataset.locId}/decisions`;
      });
    });
  }).catch(() => {
    el.innerHTML = '<div class="p-6"><h1>Locations</h1><p class="text-muted">Failed to load locations.</p></div>';
  });

  return {};
}

async function showAddLocationModal() {
  let orgs = [];
  try {
    const data = await api.get('/locations');
    // We'd need an orgs endpoint; for now allow creating without org
  } catch {}

  openModal({
    title: 'Create New Location',
    body: `
      <div class="form-group">
        <label class="form-label">Location Name</label>
        <input type="text" class="form-input" id="loc-name" placeholder="e.g., Main Street Clinic" required>
      </div>
      <div class="form-group">
        <label class="form-label">Address</label>
        <input type="text" class="form-input" id="loc-address" placeholder="Full address">
      </div>
      <div class="form-group">
        <label class="form-label">Location Type</label>
        <select class="form-select" id="loc-type">
          <option value="de_novo">De Novo (From Scratch)</option>
          <option value="expansion">Expansion (Existing Standards)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Target Go-Live Date</label>
        <input type="date" class="form-input" id="loc-golive">
      </div>
    `,
    footer: [
      { label: 'Cancel', class: 'btn-secondary', onClick: () => closeModal() },
      { label: 'Create Location', class: 'btn-primary', onClick: async () => {
        const name = document.getElementById('loc-name')?.value.trim();
        if (!name) { showToast('Name is required', 'error'); return; }
        try {
          await api.post('/locations', {
            name,
            address: document.getElementById('loc-address')?.value,
            location_type: document.getElementById('loc-type')?.value,
            target_go_live_date: document.getElementById('loc-golive')?.value || null,
          });
          closeModal();
          showToast('Location created', 'success');
          router.resolve();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }}
    ]
  });
}

// Reference Pricing page
// TODO: Pricing table needs per-unit context (e.g. "per device/mo", "per user/mo")
// and quantity columns. Without this, prices like CrowdStrike look flat ($15)
// instead of per-device. Add unit_label and quantity fields to reference_pricing
// table and display them in the UI.
function pricingPage() {
  const el = document.getElementById('page-content');
  el.innerHTML = '<div class="p-6"><div class="spinner"></div></div>';

  api.get('/pricing').then(data => {
    const items = data.pricing || data || [];
    el.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h1>Reference Pricing</h1>
          <div class="flex gap-3">
            <button class="btn btn-secondary" id="export-csv-btn">Export CSV</button>
            ${auth.isEditor() ? '<button class="btn btn-primary" id="add-pricing-btn">Add Entry</button>' : ''}
          </div>
        </div>
        <div class="card">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Vendor</th>
                  <th>Product</th>
                  <th>One-Time</th>
                  <th>Monthly</th>
                  <th>Annual</th>
                  <th>Verified</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(p => `
                  <tr>
                    <td>${p.category}</td>
                    <td>${p.vendor_name}</td>
                    <td>${p.product_name}</td>
                    <td>${p.cost_onetime_low || p.cost_onetime_high ? `$${p.cost_onetime_low || 0}–$${p.cost_onetime_high || 0}` : '—'}</td>
                    <td>${p.cost_monthly_low || p.cost_monthly_high ? `$${p.cost_monthly_low || 0}–$${p.cost_monthly_high || 0}` : '—'}</td>
                    <td>${p.cost_annual_low || p.cost_annual_high ? `$${p.cost_annual_low || 0}–$${p.cost_annual_high || 0}` : '—'}</td>
                    <td>${p.verified_at ? new Date(p.verified_at).toLocaleDateString() : '<span class="badge badge-warning">Unverified</span>'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  }).catch(() => {
    el.innerHTML = '<div class="p-6"><h1>Reference Pricing</h1><p class="text-muted">Failed to load pricing data.</p></div>';
  });

  return {};
}

// Command Palette
function openCommandPalette() {
  const overlay = document.getElementById('command-palette-overlay');
  if (!overlay) return;
  overlay.classList.add('is-active');
  const input = document.getElementById('command-palette-search');
  if (input) {
    input.value = '';
    input.focus();
  }
}

function closeCommandPalette() {
  const overlay = document.getElementById('command-palette-overlay');
  if (overlay) overlay.classList.remove('is-active');
}

function setupCommandPalette() {
  const overlay = document.getElementById('command-palette-overlay');
  const input = document.getElementById('command-palette-search');
  const results = document.getElementById('command-palette-results');

  if (!overlay || !input) return;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCommandPalette();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCommandPalette();
  });

  let searchTimeout;
  input.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const q = input.value.trim();
    if (!q) {
      results.innerHTML = '<div class="command-palette-group-label">Quick actions</div>';
      return;
    }
    searchTimeout = setTimeout(async () => {
      try {
        const docs = await api.get(`/documents?search=${encodeURIComponent(q)}`);
        const items = (docs.documents || docs || []).slice(0, 8);
        results.innerHTML = items.length ? items.map(d => `
          <a href="#/documents/${d.id}" class="command-palette-item" onclick="document.getElementById('command-palette-overlay').classList.remove('is-active')">
            <span>${d.title}</span>
            <span class="text-muted text-sm">${d.category || ''}</span>
          </a>
        `).join('') : '<div class="p-4 text-muted">No results found</div>';
      } catch {
        results.innerHTML = '<div class="p-4 text-muted">Search failed</div>';
      }
    }, 300);
  });

  document.getElementById('search-trigger')?.addEventListener('click', openCommandPalette);
}

// Sidebar toggle
function setupSidebar() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('topbar-hamburger');
  const overlay = document.getElementById('sidebar-overlay');

  function toggleSidebar() {
    sidebar.classList.toggle('is-collapsed');
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.classList.toggle('sidebar-is-collapsed');
  }

  if (toggle && sidebar) {
    toggle.addEventListener('click', toggleSidebar);
  }

  // Allow clicking the sidebar header (logo area) to expand when collapsed
  const sidebarHeader = document.querySelector('.sidebar-header');
  if (sidebarHeader && sidebar) {
    sidebarHeader.addEventListener('click', (e) => {
      if (sidebar.classList.contains('is-collapsed')) {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
      }
    });
  }

  // Also allow clicking any nav icon to expand when collapsed
  if (sidebar) {
    sidebar.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (sidebar.classList.contains('is-collapsed')) {
          e.preventDefault();
          toggleSidebar();
          // Navigate after expanding
          const href = item.getAttribute('href');
          if (href) {
            setTimeout(() => { window.location.hash = href.replace('#', ''); }, 300);
          }
        }
      });
    });
  }

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('is-open');
      overlay?.classList.toggle('is-active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      overlay.classList.remove('is-active');
    });
  }

  // Sidebar user button opens profile
  const sidebarUser = document.getElementById('sidebar-user');
  if (sidebarUser) {
    sidebarUser.addEventListener('click', () => {
      window.location.hash = '/profile';
    });
  }
}

// Notification bell
function setupNotifications() {
  const bell = document.getElementById('notification-bell');
  const dropdown = document.getElementById('notification-dropdown');
  if (bell && dropdown) {
    bell.addEventListener('click', () => {
      dropdown.classList.toggle('is-active');
    });
    document.addEventListener('click', (e) => {
      if (!bell.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('is-active');
      }
    });
  }
}

// User dropdown
function setupUserDropdown() {
  const btn = document.getElementById('user-menu-btn');
  const dropdown = document.getElementById('user-dropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', () => dropdown.classList.toggle('is-active'));

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('is-active');
    }
  });

  dropdown.querySelector('[data-action="logout"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    auth.logout();
  });

  dropdown.querySelector('[data-action="profile"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.remove('is-active');
    window.location.hash = '/profile';
  });
}

// Update user info in sidebar and topbar
function updateUserUI(user) {
  if (!user) return;
  const name = user.display_name || user.email;
  const initial = name.charAt(0).toUpperCase();

  document.getElementById('sidebar-user-name')?.replaceChildren(document.createTextNode(name));
  document.getElementById('sidebar-user-role')?.replaceChildren(document.createTextNode(user.role.replace('_', ' ')));
  document.getElementById('topbar-user-name')?.replaceChildren(document.createTextNode(name));

  document.querySelectorAll('#sidebar-avatar, #topbar-avatar').forEach(el => {
    el.textContent = initial;
  });

  // Hide admin nav section for non-admins
  const adminSection = document.getElementById('admin-nav-section');
  if (adminSection && !auth.isSuperAdmin()) {
    adminSection.style.display = 'none';
  }
}

// WebSocket handlers
function setupWebSocket() {
  ws.on('notification', (data) => {
    showToast(data.title || data.message, data.type || 'info');
    const badge = document.getElementById('notification-badge');
    if (badge) badge.classList.remove('hidden');
  });

  ws.on('presence', () => {});
  ws.on('cursor', () => {});
  ws.connect();
}

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const user = await auth.init();
  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  updateUserUI(user);

  // Create router and register routes
  router = new Router();
  router
    .add('/dashboard', dashboardPage)
    .add('/documents', documentsPage)
    .add('/documents/:id', documentViewPage)
    .add('/documents/:id/edit', documentEditPage)
    .add('/locations', locationsPage)
    .add('/locations/:id/decisions', decisionsPage)
    .add('/locations/:id/checklist', kanbanPage)
    .add('/locations/:id/costs', costsPage)
    .add('/users', usersPage)
    .add('/profile', profilePage)
    .add('/pricing', pricingPage);

  // UI setup
  setupSidebar();
  setupNotifications();
  setupUserDropdown();
  setupCommandPalette();

  // Keyboard shortcuts
  registerShortcut('ctrl+k', (e) => { e.preventDefault(); openCommandPalette(); });
  registerShortcut('meta+k', (e) => { e.preventDefault(); openCommandPalette(); });

  // WebSocket
  setupWebSocket();

  // Initialize Lucide icons
  if (window.lucide) window.lucide.createIcons();

  // Resolve initial route
  router.resolve();
});

export { router };
