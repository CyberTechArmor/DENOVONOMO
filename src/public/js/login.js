document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  const form = document.getElementById('login-form');
  const errorBox = document.getElementById('login-error');
  const mfaSection = document.getElementById('mfa-section');
  const loginBtn = document.getElementById('login-btn');
  const csrfInput = document.getElementById('csrf-token');

  let pendingMfaSessionId = null;

  // Fetch CSRF token on load
  fetchCsrfToken();

  async function fetchCsrfToken() {
    try {
      const res = await fetch('/api/csrf-token', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        csrfInput.value = data.csrfToken || '';
      }
    } catch (_) {
      // CSRF fetch may fail in dev — form will still work
    }
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add('is-visible');
  }

  function hideError() {
    errorBox.textContent = '';
    errorBox.classList.remove('is-visible');
  }

  function setLoading(loading) {
    loginBtn.disabled = loading;
    loginBtn.textContent = loading ? 'Signing in\u2026' : 'Sign in';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = form.email.value.trim();
    const password = form.password.value;
    const mfaCode = form.mfa_code ? form.mfa_code.value.trim() : '';

    // If we have a pending MFA session, verify the code
    if (pendingMfaSessionId && mfaCode) {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/mfa-verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfInput.value,
          },
          credentials: 'same-origin',
          body: JSON.stringify({ mfaSessionId: pendingMfaSessionId, code: mfaCode }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          window.location.href = '/app.html';
          return;
        }

        showError(data.error || 'Invalid verification code.');
      } catch (err) {
        showError('Unable to connect. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Basic validation
    if (!email) {
      document.getElementById('email-error').textContent = 'Email is required';
      form.email.classList.add('is-invalid');
      form.email.focus();
      return;
    }
    document.getElementById('email-error').textContent = '';
    form.email.classList.remove('is-invalid');

    if (!password) {
      document.getElementById('password-error').textContent = 'Password is required';
      form.password.classList.add('is-invalid');
      form.password.focus();
      return;
    }
    document.getElementById('password-error').textContent = '';
    form.password.classList.remove('is-invalid');

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfInput.value,
        },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.user) {
        // Successful login — redirect to app
        window.location.href = '/app.html';
        return;
      }

      // MFA required
      if (data.requireMfa && data.mfaSessionId) {
        pendingMfaSessionId = data.mfaSessionId;
        mfaSection.classList.add('is-visible');
        loginBtn.textContent = 'Verify';
        document.getElementById('mfa-code').focus();
        setLoading(false);
        return;
      }

      // Error
      showError(data.error || 'Invalid email or password.');
    } catch (err) {
      showError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  });
});
