// Fetch wrapper with CSRF token, auth handling, JSON parsing
let csrfToken = null;

async function fetchCsrfToken() {
  const res = await fetch('/api/csrf-token');
  const data = await res.json();
  csrfToken = data.csrfToken;
}

async function api(endpoint, options = {}) {
  if (!csrfToken && options.method && options.method !== 'GET') {
    await fetchCsrfToken();
  }
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  };
  if (options.method && options.method !== 'GET' && csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  const response = await fetch(`/api${endpoint}`, config);
  if (response.status === 401) {
    window.location.href = '/login.html';
    throw new Error('Unauthorized');
  }
  if (response.status === 403) {
    showToast('Access denied', 'error');
    throw new Error('Forbidden');
  }
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  if (response.status === 204) return null;
  return response.json();
}

// Convenience methods
api.get = (url) => api(url);
api.post = (url, body) => api(url, { method: 'POST', body: JSON.stringify(body) });
api.put = (url, body) => api(url, { method: 'PUT', body: JSON.stringify(body) });
api.patch = (url, body) => api(url, { method: 'PATCH', body: JSON.stringify(body) });
api.delete = (url) => api(url, { method: 'DELETE' });

export default api;
