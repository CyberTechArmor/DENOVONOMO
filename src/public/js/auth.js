import api from './api.js';

class AuthManager {
  constructor() {
    this.user = null;
  }

  async init() {
    try {
      this.user = await api.get('/auth/me');
      return this.user;
    } catch {
      this.user = null;
      return null;
    }
  }

  async login(email, password) {
    const result = await api.post('/auth/login', { email, password });
    if (result.requireMfa) {
      return { requireMfa: true, mfaSessionId: result.mfaSessionId };
    }
    this.user = result.user;
    return { user: this.user };
  }

  async verifyMfa(code, mfaSessionId) {
    const result = await api.post('/auth/mfa-verify', { code, mfaSessionId });
    this.user = result.user;
    return this.user;
  }

  async logout() {
    await api.post('/auth/logout');
    this.user = null;
    window.location.href = '/login.html';
  }

  isAuthenticated() { return !!this.user; }
  hasRole(...roles) { return this.user && roles.includes(this.user.role); }
  isSuperAdmin() { return this.hasRole('super_admin'); }
  isEditor() { return this.hasRole('super_admin', 'editor'); }
}

export default new AuthManager();
