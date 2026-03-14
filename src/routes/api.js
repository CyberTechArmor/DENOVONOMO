'use strict';

const { Router } = require('express');
const { requireAuth, loadUser } = require('../middleware/auth');

const router = Router();

// Auth routes (no auth required for login/logout)
router.use('/auth', require('./auth'));

// MCP endpoint uses its own token auth, not session auth
try {
  router.use('/mcp', require('./mcp'));
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') throw err;
  console.log('MCP route module not found, skipping /mcp');
}

// Shared document access (public endpoint for short codes)
try {
  const documentsRouter = require('./documents');
  // Mount the shared endpoint before auth middleware
  router.get('/documents/shared/:shortCode', (req, res, next) => {
    req.isPublicAccess = true;
    next();
  }, documentsRouter);
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') throw err;
}

// All routes below require authentication and load the user object
router.use(requireAuth, loadUser);

// Mount authenticated sub-routers
const routes = [
  { path: '/users', file: './users' },
  { path: '/documents', file: './documents' },
  { path: '/locations', file: './locations' },
  { path: '/decisions', file: './decisions' },
  { path: '/checklists', file: './checklists' },
  { path: '/costs', file: './costs' },
  { path: '/dashboard', file: './dashboard' },
  { path: '/pricing', file: './pricing' },
];

for (const route of routes) {
  try {
    router.use(route.path, require(route.file));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log(`Route module ${route.file} not found, skipping ${route.path}`);
    } else {
      throw err;
    }
  }
}

module.exports = router;
