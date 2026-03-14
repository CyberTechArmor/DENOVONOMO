import api from '../api.js';
import { showToast } from '../components/toast.js';
import { formatDateTime, formatRelative } from '../utils/dates.js';
import auth from '../auth.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export default function profilePage(params) {
  const container = document.getElementById('page-content');
  let user = null;
  let sessions = [];
  let mfaSetup = null;
  let destroyed = false;

  function renderLoading() {
    container.innerHTML = `
      <div class="p-6" style="max-width:720px;margin:0 auto">
        <div class="skeleton skeleton-heading mb-5" style="width:20%"></div>
        <div class="card mb-4">
          <div class="skeleton skeleton-text mb-3" style="width:40%"></div>
          <div class="skeleton skeleton-text mb-3" style="width:60%"></div>
          <div class="skeleton skeleton-text" style="width:30%"></div>
        </div>
      </div>`;
  }

  function render() {
    if (destroyed || !user) return;

    container.innerHTML = `
      <div class="p-6" style="max-width:720px;margin:0 auto">
        <h1 class="mb-5">Profile Settings</h1>

        <!-- Profile info -->
        <div class="card mb-4" style="padding:var(--space-5)">
          <h3 style="margin:0 0 var(--space-4)">Profile Information</h3>
          <div class="flex gap-5 items-start">
            <div style="flex-shrink:0">
              <div id="profile-avatar-preview" style="
                width:80px;height:80px;border-radius:50%;
                background:var(--color-primary-100);color:var(--color-primary-700);
                display:flex;align-items:center;justify-content:center;
                font-size:1.5rem;font-weight:700;overflow:hidden;
              ">
                ${user.avatar_url
                  ? `<img src="${escapeHtml(user.avatar_url)}" alt="" style="width:100%;height:100%;object-fit:cover">`
                  : escapeHtml((user.display_name || user.email || '?').charAt(0).toUpperCase())
                }
              </div>
            </div>
            <div class="flex-1">
              <div class="form-group mb-3">
                <label class="form-label">Display Name</label>
                <input type="text" id="profile-name" class="form-input" value="${escapeHtml(user.display_name || '')}">
              </div>
              <div class="form-group mb-3">
                <label class="form-label">Avatar URL</label>
                <input type="url" id="profile-avatar" class="form-input" placeholder="https://example.com/avatar.jpg" value="${escapeHtml(user.avatar_url || '')}">
                <div class="form-hint">Enter a URL to an image. Supported formats: JPG, PNG, GIF.</div>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" value="${escapeHtml(user.email || '')}" disabled>
                <div class="form-hint">Email cannot be changed. Contact an administrator.</div>
              </div>
              <div class="form-group">
                <label class="form-label">Role</label>
                <input type="text" class="form-input" value="${escapeHtml(user.role || '')}" disabled>
              </div>
            </div>
          </div>
          <div style="margin-top:var(--space-4);text-align:right">
            <button class="btn btn-primary" id="profile-save-btn">Save Profile</button>
          </div>
        </div>

        <!-- Change Password -->
        <div class="card mb-4" style="padding:var(--space-5)">
          <h3 style="margin:0 0 var(--space-4)">Change Password</h3>
          <div class="form-group mb-3">
            <label class="form-label">Current Password</label>
            <input type="password" id="profile-current-pw" class="form-input" placeholder="Enter current password">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)" class="mb-3">
            <div class="form-group">
              <label class="form-label">New Password</label>
              <input type="password" id="profile-new-pw" class="form-input" placeholder="New password (min 8 chars)">
            </div>
            <div class="form-group">
              <label class="form-label">Confirm New Password</label>
              <input type="password" id="profile-confirm-pw" class="form-input" placeholder="Confirm new password">
            </div>
          </div>
          <div class="flex justify-end">
            <button class="btn btn-primary" id="profile-change-pw-btn">Change Password</button>
          </div>
        </div>

        <!-- MFA Section -->
        <div class="card mb-4" style="padding:var(--space-5)">
          <div class="flex justify-between items-center mb-4">
            <h3 style="margin:0">Two-Factor Authentication</h3>
            <span class="badge ${user.mfa_enabled ? 'badge-success' : ''}">${user.mfa_enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <p class="text-sm text-muted mb-4">
            ${user.mfa_enabled
              ? 'Two-factor authentication is enabled on your account. You will be prompted for a code when logging in.'
              : 'Add an extra layer of security to your account by enabling two-factor authentication.'
            }
          </p>
          <div id="mfa-setup-area"></div>
          <div class="flex justify-end">
            ${user.mfa_enabled
              ? '<button class="btn btn-danger" id="mfa-disable-btn">Disable MFA</button>'
              : '<button class="btn btn-primary" id="mfa-enable-btn">Enable MFA</button>'
            }
          </div>
        </div>

        <!-- Active Sessions -->
        <div class="card" style="padding:var(--space-5)">
          <h3 style="margin:0 0 var(--space-4)">Active Sessions</h3>
          <div id="profile-sessions">
            ${sessions.length === 0 ? `
              <div class="text-sm text-muted">No active sessions found.</div>
            ` : sessions.map(session => `
              <div class="flex justify-between items-center" style="padding:var(--space-3) 0;border-bottom:1px solid var(--color-border)">
                <div>
                  <div class="text-sm font-medium">${escapeHtml(session.device || session.user_agent || 'Unknown device')}</div>
                  <div class="text-xs text-muted">
                    ${session.ip_address ? escapeHtml(session.ip_address) + ' &middot; ' : ''}
                    Last active ${formatRelative(session.last_active || session.created_at)}
                    ${session.is_current ? ' &middot; <strong>Current session</strong>' : ''}
                  </div>
                </div>
                ${!session.is_current ? `
                  <button class="btn btn-sm btn-ghost session-revoke-btn" data-session-id="${session.id}" style="color:var(--color-danger)">Revoke</button>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;

    bindEvents();
  }

  function bindEvents() {
    // Save profile
    container.querySelector('#profile-save-btn')?.addEventListener('click', saveProfile);

    // Avatar URL preview
    container.querySelector('#profile-avatar')?.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      const preview = container.querySelector('#profile-avatar-preview');
      if (preview && url) {
        preview.innerHTML = `<img src="${escapeHtml(url)}" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">`;
      }
    });

    // Change password
    container.querySelector('#profile-change-pw-btn')?.addEventListener('click', changePassword);

    // MFA
    container.querySelector('#mfa-enable-btn')?.addEventListener('click', startMfaSetup);
    container.querySelector('#mfa-disable-btn')?.addEventListener('click', disableMfa);

    // Session revoke
    container.querySelectorAll('.session-revoke-btn').forEach(btn => {
      btn.addEventListener('click', () => revokeSession(btn.dataset.sessionId));
    });
  }

  async function saveProfile() {
    const displayName = container.querySelector('#profile-name')?.value?.trim();
    const avatarUrl = container.querySelector('#profile-avatar')?.value?.trim();
    const btn = container.querySelector('#profile-save-btn');

    if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }

    try {
      await api.put('/auth/profile', {
        display_name: displayName || null,
        avatar_url: avatarUrl || null
      });
      user.display_name = displayName;
      user.avatar_url = avatarUrl;
      auth.user = { ...auth.user, display_name: displayName, avatar_url: avatarUrl };
      showToast('Profile updated', 'success');
    } catch (err) {
      showToast('Failed to update profile: ' + err.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Save Profile'; }
    }
  }

  async function changePassword() {
    const currentPw = container.querySelector('#profile-current-pw')?.value;
    const newPw = container.querySelector('#profile-new-pw')?.value;
    const confirmPw = container.querySelector('#profile-confirm-pw')?.value;
    const btn = container.querySelector('#profile-change-pw-btn');

    if (!currentPw) { showToast('Current password is required', 'warning'); return; }
    if (!newPw || newPw.length < 8) { showToast('New password must be at least 8 characters', 'warning'); return; }
    if (newPw !== confirmPw) { showToast('Passwords do not match', 'warning'); return; }

    if (btn) { btn.disabled = true; btn.textContent = 'Changing...'; }

    try {
      await api.post('/auth/change-password', {
        current_password: currentPw,
        new_password: newPw
      });
      showToast('Password changed successfully', 'success');
      // Clear fields
      const fields = ['#profile-current-pw', '#profile-new-pw', '#profile-confirm-pw'];
      fields.forEach(sel => {
        const el = container.querySelector(sel);
        if (el) el.value = '';
      });
    } catch (err) {
      showToast('Failed to change password: ' + err.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Change Password'; }
    }
  }

  async function startMfaSetup() {
    const btn = container.querySelector('#mfa-enable-btn');
    const area = container.querySelector('#mfa-setup-area');

    if (btn) { btn.disabled = true; btn.textContent = 'Setting up...'; }

    try {
      const data = await api.post('/auth/mfa/setup', {});
      mfaSetup = data;

      if (area) {
        area.innerHTML = `
          <div style="text-align:center;padding:var(--space-4);background:var(--color-bg-subtle);border-radius:var(--radius-default);margin-bottom:var(--space-4)">
            <p class="text-sm mb-3">Scan this QR code with your authenticator app:</p>
            ${data.qr_code_url || data.qrCode
              ? `<img src="${escapeHtml(data.qr_code_url || data.qrCode)}" alt="QR Code" style="width:200px;height:200px;margin:0 auto;display:block">`
              : `<div class="text-sm text-muted mb-2">QR code unavailable.</div>`
            }
            ${data.secret ? `
              <p class="text-xs text-muted mt-3">Manual entry code: <code style="background:var(--color-bg);padding:2px 6px;border-radius:3px;font-size:0.75rem">${escapeHtml(data.secret)}</code></p>
            ` : ''}
            <div class="form-group mt-4" style="max-width:300px;margin:0 auto">
              <label class="form-label text-sm">Enter verification code</label>
              <div class="flex gap-2">
                <input type="text" id="mfa-verify-code" class="form-input" placeholder="123456" maxlength="6" style="text-align:center;letter-spacing:4px;font-size:1.1rem">
                <button class="btn btn-primary" id="mfa-verify-btn">Verify</button>
              </div>
            </div>
          </div>`;

        area.querySelector('#mfa-verify-btn')?.addEventListener('click', verifyMfa);
        area.querySelector('#mfa-verify-code')?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') verifyMfa();
        });
      }
    } catch (err) {
      showToast('Failed to start MFA setup: ' + err.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Enable MFA'; }
    }
  }

  async function verifyMfa() {
    const code = container.querySelector('#mfa-verify-code')?.value?.trim();
    if (!code || code.length < 6) {
      showToast('Enter a valid 6-digit code', 'warning');
      return;
    }

    try {
      await api.post('/auth/mfa/verify-setup', {
        code,
        setup_token: mfaSetup?.setup_token || mfaSetup?.token
      });
      user.mfa_enabled = true;
      auth.user = { ...auth.user, mfa_enabled: true };
      showToast('MFA enabled successfully', 'success');
      render();
    } catch (err) {
      showToast('Verification failed: ' + err.message, 'error');
    }
  }

  async function disableMfa() {
    const btn = container.querySelector('#mfa-disable-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Disabling...'; }

    try {
      await api.post('/auth/mfa/disable', {});
      user.mfa_enabled = false;
      auth.user = { ...auth.user, mfa_enabled: false };
      showToast('MFA disabled', 'success');
      render();
    } catch (err) {
      showToast('Failed to disable MFA: ' + err.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Disable MFA'; }
    }
  }

  async function revokeSession(sessionId) {
    try {
      await api.delete(`/auth/sessions/${sessionId}`);
      sessions = sessions.filter(s => s.id !== sessionId);
      showToast('Session revoked', 'success');
      render();
    } catch (err) {
      showToast('Failed to revoke session: ' + err.message, 'error');
    }
  }

  async function loadData() {
    renderLoading();
    try {
      // Load profile and sessions in parallel
      const [profileData, sessionData] = await Promise.all([
        api.get('/auth/me'),
        api.get('/auth/sessions').catch(() => ({ sessions: [] }))
      ]);

      user = profileData.user || profileData;
      sessions = sessionData.sessions || sessionData || [];
      render();
    } catch (err) {
      container.innerHTML = `
        <div class="p-6" style="max-width:720px;margin:0 auto">
          <h1 class="mb-5">Profile Settings</h1>
          <div class="empty-state">
            <h3>Unable to Load Profile</h3>
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
