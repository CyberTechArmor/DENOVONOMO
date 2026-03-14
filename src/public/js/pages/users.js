import api from '../api.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { formatDate, formatRelative } from '../utils/dates.js';
import auth from '../auth.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const ROLE_BADGES = {
  super_admin: 'badge-error',
  admin: 'badge-warning',
  editor: 'badge-info',
  viewer: 'badge-success',
  user: ''
};

export default function usersPage(params) {
  const container = document.getElementById('page-content');
  let users = [];
  let searchQuery = '';
  let destroyed = false;

  // Access control
  if (!auth.isSuperAdmin()) {
    container.innerHTML = `
      <div class="p-6">
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px">
            <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
          </svg>
          <h3>Access Denied</h3>
          <p>Only super administrators can manage users.</p>
        </div>
      </div>`;
    return { destroy() {} };
  }

  function renderLoading() {
    container.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-5">
          <div class="skeleton skeleton-heading" style="width:20%"></div>
          <div class="skeleton skeleton-text" style="width:120px;height:36px"></div>
        </div>
        <div class="card" style="padding:0;overflow:hidden">
          ${Array(5).fill(`
            <div style="padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--color-border);display:flex;gap:var(--space-3)">
              <div class="skeleton" style="width:36px;height:36px;border-radius:50%"></div>
              <div class="flex-1">
                <div class="skeleton skeleton-text mb-2" style="width:30%"></div>
                <div class="skeleton skeleton-text" style="width:50%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  function getFilteredUsers() {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(u =>
      (u.display_name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  }

  function render() {
    if (destroyed) return;
    const filtered = getFilteredUsers();

    container.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-5">
          <h1>User Management</h1>
          <div class="flex gap-3 items-center">
            <div style="position:relative">
              <input type="text" id="users-search" class="form-input" placeholder="Search users..." style="width:240px;padding-left:36px" value="${escapeHtml(searchQuery)}">
              <svg style="position:absolute;left:10px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:var(--color-text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <button class="btn btn-primary" id="users-create-btn">Create User</button>
          </div>
        </div>

        <div class="card" style="padding:0;overflow:hidden">
          <table class="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>MFA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `
                <tr><td colspan="7" class="text-center text-muted" style="padding:var(--space-5)">
                  ${searchQuery ? 'No users match your search.' : 'No users found.'}
                </td></tr>
              ` : filtered.map(user => `
                <tr data-user-id="${user.id}">
                  <td>
                    <div class="flex items-center gap-3">
                      <div style="width:36px;height:36px;border-radius:50%;background:var(--color-primary-100);color:var(--color-primary-700);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:600;flex-shrink:0">
                        ${user.avatar_url
                          ? `<img src="${escapeHtml(user.avatar_url)}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`
                          : escapeHtml((user.display_name || user.email || '?').charAt(0).toUpperCase())
                        }
                      </div>
                      <span class="font-medium">${escapeHtml(user.display_name || user.email || '')}</span>
                    </div>
                  </td>
                  <td class="text-sm">${escapeHtml(user.email || '')}</td>
                  <td><span class="badge ${ROLE_BADGES[user.role] || ''}">${escapeHtml(user.role || 'user')}</span></td>
                  <td>
                    <span class="badge ${user.is_active !== false ? 'badge-success' : ''}" style="font-size:0.625rem">
                      ${user.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td class="text-sm text-muted">${user.last_login ? formatRelative(user.last_login) : 'Never'}</td>
                  <td>
                    ${user.mfa_enabled
                      ? '<span style="color:var(--color-success);font-size:0.8rem" title="MFA enabled">&#10003;</span>'
                      : '<span class="text-muted" title="MFA disabled">&mdash;</span>'
                    }
                  </td>
                  <td>
                    <div class="flex gap-1">
                      <button class="btn btn-sm btn-ghost user-edit-btn" data-user-id="${user.id}">Edit</button>
                      <button class="btn btn-sm btn-ghost user-toggle-btn" data-user-id="${user.id}" style="color:${user.is_active !== false ? 'var(--color-danger)' : 'var(--color-success)'}">
                        ${user.is_active !== false ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>`;

    bindEvents();
  }

  function bindEvents() {
    // Search
    const searchInput = container.querySelector('#users-search');
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

    // Create user
    container.querySelector('#users-create-btn')?.addEventListener('click', openCreateUserModal);

    // Edit user
    container.querySelectorAll('.user-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const user = users.find(u => u.id === btn.dataset.userId);
        if (user) openEditUserModal(user);
      });
    });

    // Toggle active
    container.querySelectorAll('.user-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleUserActive(btn.dataset.userId));
    });
  }

  function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pw = '';
    for (let i = 0; i < 16; i++) {
      pw += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pw;
  }

  function openCreateUserModal() {
    openModal({
      title: 'Create User',
      size: 'md',
      body: `
        <div class="form-group mb-3">
          <label class="form-label">Email <span class="required">*</span></label>
          <input type="email" id="create-user-email" class="form-input" placeholder="user@example.com">
        </div>
        <div class="form-group mb-3">
          <label class="form-label">Display Name</label>
          <input type="text" id="create-user-name" class="form-input" placeholder="John Doe">
        </div>
        <div class="form-group mb-3">
          <label class="form-label">Role</label>
          <select id="create-user-role" class="form-select">
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <div class="form-group mb-3">
          <label class="form-label">Password <span class="required">*</span></label>
          <div class="flex gap-2">
            <input type="text" id="create-user-password" class="form-input flex-1" placeholder="Password">
            <button class="btn btn-secondary" id="create-user-gen-pw" type="button">Generate</button>
          </div>
          <div class="form-hint">Minimum 8 characters.</div>
        </div>
      `,
      footer: [
        { label: 'Cancel', class: 'btn-secondary', onClick: () => closeModal() },
        { label: 'Create User', class: 'btn-primary', onClick: handleCreateUser }
      ]
    });

    document.getElementById('create-user-gen-pw')?.addEventListener('click', () => {
      const pwInput = document.getElementById('create-user-password');
      if (pwInput) pwInput.value = generatePassword();
    });
  }

  async function handleCreateUser() {
    const email = document.getElementById('create-user-email')?.value?.trim();
    const displayName = document.getElementById('create-user-name')?.value?.trim();
    const role = document.getElementById('create-user-role')?.value;
    const password = document.getElementById('create-user-password')?.value;

    if (!email) { showToast('Email is required', 'warning'); return; }
    if (!password || password.length < 8) { showToast('Password must be at least 8 characters', 'warning'); return; }

    try {
      const result = await api.post('/users', {
        email,
        display_name: displayName || null,
        role: role || 'viewer',
        password
      });
      const newUser = result.user || result;
      users.push(newUser);
      closeModal();
      showToast('User created successfully', 'success');
      render();
    } catch (err) {
      showToast('Failed to create user: ' + err.message, 'error');
    }
  }

  function openEditUserModal(user) {
    openModal({
      title: 'Edit User',
      size: 'md',
      body: `
        <div class="form-group mb-3">
          <label class="form-label">Email</label>
          <input type="email" id="edit-user-email" class="form-input" value="${escapeHtml(user.email || '')}" disabled>
        </div>
        <div class="form-group mb-3">
          <label class="form-label">Display Name</label>
          <input type="text" id="edit-user-name" class="form-input" value="${escapeHtml(user.display_name || '')}">
        </div>
        <div class="form-group mb-3">
          <label class="form-label">Role</label>
          <select id="edit-user-role" class="form-select">
            <option value="viewer" ${user.role === 'viewer' ? 'selected' : ''}>Viewer</option>
            <option value="editor" ${user.role === 'editor' ? 'selected' : ''}>Editor</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
            <option value="super_admin" ${user.role === 'super_admin' ? 'selected' : ''}>Super Admin</option>
          </select>
        </div>
        <div class="form-group mb-3">
          <label class="form-label">New Password (leave blank to keep current)</label>
          <div class="flex gap-2">
            <input type="text" id="edit-user-password" class="form-input flex-1" placeholder="New password">
            <button class="btn btn-secondary" id="edit-user-gen-pw" type="button">Generate</button>
          </div>
        </div>
      `,
      footer: [
        { label: 'Cancel', class: 'btn-secondary', onClick: () => closeModal() },
        { label: 'Save Changes', class: 'btn-primary', onClick: () => handleEditUser(user.id) }
      ]
    });

    document.getElementById('edit-user-gen-pw')?.addEventListener('click', () => {
      const pwInput = document.getElementById('edit-user-password');
      if (pwInput) pwInput.value = generatePassword();
    });
  }

  async function handleEditUser(userId) {
    const displayName = document.getElementById('edit-user-name')?.value?.trim();
    const role = document.getElementById('edit-user-role')?.value;
    const password = document.getElementById('edit-user-password')?.value;

    const payload = {
      display_name: displayName || null,
      role: role || 'viewer'
    };
    if (password && password.length >= 8) {
      payload.password = password;
    }

    try {
      await api.put(`/users/${userId}`, payload);
      const idx = users.findIndex(u => u.id === userId);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...payload };
      }
      closeModal();
      showToast('User updated', 'success');
      render();
    } catch (err) {
      showToast('Failed to update user: ' + err.message, 'error');
    }
  }

  async function toggleUserActive(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newActive = user.is_active === false;
    try {
      await api.patch(`/users/${userId}`, { is_active: newActive });
      user.is_active = newActive;
      showToast(newActive ? 'User reactivated' : 'User deactivated', 'success');
      render();
    } catch (err) {
      showToast('Failed to update user: ' + err.message, 'error');
    }
  }

  async function loadData() {
    renderLoading();
    try {
      const data = await api.get('/users');
      users = data.users || data || [];
      render();
    } catch (err) {
      container.innerHTML = `
        <div class="p-6">
          <h1 class="mb-5">User Management</h1>
          <div class="empty-state">
            <h3>Unable to Load Users</h3>
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
