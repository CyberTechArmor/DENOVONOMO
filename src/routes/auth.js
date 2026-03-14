'use strict';

const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { query } = require('../config/database');
const { requireAuth, loadUser } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { logAudit } = require('../middleware/audit');

const router = Router();

// Temporary MFA session store (in-memory, cleared on restart)
const mfaSessions = new Map();

// ---------------------------------------------------------------------------
// POST /login
// ---------------------------------------------------------------------------
const loginSchema = {
  email: { required: true, type: 'string', maxLength: 255 },
  password: { required: true, type: 'string', minLength: 1 },
};

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { rows } = await query(
      'SELECT id, email, display_name, role, password_hash, totp_enabled, totp_secret, is_active FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // If TOTP is enabled, require MFA verification
    if (user.totp_enabled) {
      const mfaSessionId = crypto.randomBytes(32).toString('hex');
      mfaSessions.set(mfaSessionId, {
        userId: user.id,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      // Clean expired sessions
      for (const [key, val] of mfaSessions.entries()) {
        if (val.expiresAt < Date.now()) mfaSessions.delete(key);
      }

      return res.json({ requireMfa: true, mfaSessionId });
    }

    // No TOTP - complete login
    req.session.userId = user.id;
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    await logAudit(user.id, 'login', 'user', user.id, {}, req.ip);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /mfa-verify
// ---------------------------------------------------------------------------
const mfaSchema = {
  mfaSessionId: { required: true, type: 'string' },
  code: { required: true, type: 'string', minLength: 6, maxLength: 6 },
};

router.post('/mfa-verify', validate(mfaSchema), async (req, res, next) => {
  try {
    const { mfaSessionId, code } = req.body;

    const mfaSession = mfaSessions.get(mfaSessionId);
    if (!mfaSession || mfaSession.expiresAt < Date.now()) {
      mfaSessions.delete(mfaSessionId);
      return res.status(401).json({ error: 'Invalid or expired MFA session' });
    }

    const { rows: users } = await query(
      'SELECT id, email, display_name, role, totp_secret FROM users WHERE id = $1',
      [mfaSession.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = users[0];
    const { authenticator } = require('otplib');
    const isValid = authenticator.check(code, user.totp_secret);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid TOTP code' });
    }

    mfaSessions.delete(mfaSessionId);
    req.session.userId = user.id;
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    await logAudit(user.id, 'login_mfa', 'user', user.id, {}, req.ip);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /logout
// ---------------------------------------------------------------------------
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err.message);
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// ---------------------------------------------------------------------------
// GET /me
// ---------------------------------------------------------------------------
router.get('/me', requireAuth, loadUser, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    id: req.user.id,
    email: req.user.email,
    display_name: req.user.display_name,
    role: req.user.role,
    avatar_url: req.user.avatar_url,
    totp_enabled: req.user.totp_enabled,
    created_at: req.user.created_at,
  });
});

module.exports = router;
