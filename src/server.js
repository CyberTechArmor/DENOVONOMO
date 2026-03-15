'use strict';

const http = require('http');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
const { WebSocketServer } = require('ws');

const env = require('./config/env');
const { pool, query } = require('./config/database');
const apiRouter = require('./routes/api');

const app = express();

// ---------------------------------------------------------------------------
// Security headers via helmet
// ---------------------------------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://unpkg.com', 'https://cdnjs.cloudflare.com'],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://unpkg.com',
          'https://cdnjs.cloudflare.com',
          'https://fonts.googleapis.com',
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", 'wss:', 'ws:', 'https://unpkg.com'],
      },
    },
  })
);

// ---------------------------------------------------------------------------
// Standard middleware
// ---------------------------------------------------------------------------
app.use(cors({ origin: env.APP_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------
const sessionMiddleware = session({
  store: new PgSession({
    pool,
    tableName: 'sessions',
    createTableIfMissing: false,
  }),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
});

app.use(sessionMiddleware);

// ---------------------------------------------------------------------------
// CSRF protection (cookie-based)
// ---------------------------------------------------------------------------
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ---------------------------------------------------------------------------
// Rate limiting on auth routes
// ---------------------------------------------------------------------------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

app.use('/api/auth', authLimiter);

// ---------------------------------------------------------------------------
// Static files
// ---------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
app.use('/api', apiRouter);

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------
app.use((err, req, res, _next) => {
  // CSRF token errors
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ---------------------------------------------------------------------------
// HTTP server and WebSocket
// ---------------------------------------------------------------------------
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('WebSocket message received:', data);
    } catch (err) {
      console.error('Invalid WebSocket message:', err.message);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
  });
});

// Expose wss for use in route handlers if needed
app.set('wss', wss);

// ---------------------------------------------------------------------------
// Database migrations
// ---------------------------------------------------------------------------
async function runMigrations() {
  const fs = require('fs');
  const migrationsDir = path.join(__dirname, 'db', 'migrations');

  // Ensure the migrations tracking table exists
  await query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  let files;
  try {
    files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  } catch (err) {
    console.log('No migrations directory found, skipping migrations.');
    return;
  }

  for (const file of files) {
    const { rows } = await query('SELECT 1 FROM migrations WHERE name = $1', [file]);
    if (rows.length > 0) continue;

    console.log(`Running migration: ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await query(sql);
    await query('INSERT INTO migrations (name) VALUES ($1)', [file]);
    console.log(`Migration completed: ${file}`);
  }
}

// ---------------------------------------------------------------------------
// Create default super_admin user if none exist
// ---------------------------------------------------------------------------
async function createDefaultAdmin() {
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM users');
  if (rows[0].count > 0) return;

  const adminEmail = env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn(
      'No users exist and ADMIN_EMAIL / ADMIN_PASSWORD are not set. Skipping default admin creation.'
    );
    return;
  }

  const bcrypt = require('bcryptjs');
  const { v4: uuidv4 } = require('uuid');
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const result = await query(
    `INSERT INTO users (id, email, display_name, password_hash, role, is_active, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 'super_admin', TRUE, NOW(), NOW()) RETURNING id`,
    [uuidv4(), adminEmail, 'Super Admin', passwordHash]
  );

  console.log(`Default super_admin user created: ${adminEmail}`);

  // Seed guide documents and reference pricing
  try {
    const { runSeed } = require('./services/seed');
    await runSeed(result.rows[0].id);
    console.log('Seed data loaded successfully');
  } catch (err) {
    console.warn('Seed data loading skipped or failed:', err.message);
  }
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function start() {
  try {
    await runMigrations();
    await createDefaultAdmin();

    server.listen(env.APP_PORT, () => {
      console.log(`De Novo NoMo server listening on port ${env.APP_PORT} (${env.NODE_ENV})`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log('HTTP server closed');

    // Close all WebSocket connections
    wss.clients.forEach((client) => client.terminate());

    try {
      await pool.end();
      console.log('Database pool closed');
    } catch (err) {
      console.error('Error closing database pool:', err.message);
    }

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();

module.exports = { app, server, wss };
