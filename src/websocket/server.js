'use strict';

const { WebSocketServer } = require('ws');
const cookie = require('cookie');
const { query } = require('../config/database');
const { pool } = require('../config/database');
const presence = require('./presence');
const cursors = require('./cursors');
const notifications = require('./notifications');

// Map of userId -> Set of WebSocket connections (supports multiple tabs)
const connections = new Map();

// Track liveness for heartbeat
const HEARTBEAT_INTERVAL = 30000;
let heartbeatTimer = null;

/**
 * Parse the connect-pg-simple session from the database using the session ID
 * extracted from the signed cookie.
 *
 * @param {string} sid - The raw session ID (after unsigning)
 * @returns {Promise<object|null>} The session data, or null
 */
async function getSessionFromStore(sid) {
  try {
    const result = await query(
      'SELECT sess FROM session WHERE sid = $1 AND expire > NOW()',
      [sid]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0].sess;
  } catch (err) {
    console.error('Error reading session from store:', err.message);
    return null;
  }
}

/**
 * Unsign a connect-style signed cookie value.
 * Signed cookies have the format: s:<value>.<signature>
 *
 * @param {string} val - The raw cookie value
 * @param {string} secret - The session secret
 * @returns {string|false}
 */
function unsignCookie(val, secret) {
  if (typeof val !== 'string' || val.substring(0, 2) !== 's:') {
    return val; // Not signed
  }

  const crypto = require('crypto');
  const raw = val.slice(2);
  const dotIndex = raw.lastIndexOf('.');
  if (dotIndex === -1) return false;

  const payload = raw.substring(0, dotIndex);
  const sig = raw.substring(dotIndex + 1);

  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64')
    .replace(/=+$/, '');

  if (sig === expected) return payload;
  return false;
}

/**
 * Attach WebSocket server to the HTTP server.
 *
 * @param {http.Server} server - The HTTP server instance
 * @returns {{ wss: WebSocketServer }}
 */
function setupWebSocket(server) {
  const env = require('../config/env');

  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', async (ws, req) => {
    // -----------------------------------------------------------------------
    // Validate session cookie and extract userId
    // -----------------------------------------------------------------------
    let userId = null;

    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const rawSid = cookies['connect.sid'];

      if (!rawSid) {
        ws.close(4001, 'No session cookie');
        return;
      }

      const sid = unsignCookie(decodeURIComponent(rawSid), env.SESSION_SECRET);
      if (!sid) {
        ws.close(4001, 'Invalid session signature');
        return;
      }

      const sessionData = await getSessionFromStore(sid);
      if (!sessionData || !sessionData.userId) {
        ws.close(4001, 'No authenticated session');
        return;
      }

      userId = sessionData.userId;
    } catch (err) {
      console.error('WebSocket auth error:', err.message);
      ws.close(4001, 'Authentication failed');
      return;
    }

    // -----------------------------------------------------------------------
    // Store connection
    // -----------------------------------------------------------------------
    ws.userId = userId;
    ws.isAlive = true;

    if (!connections.has(userId)) {
      connections.set(userId, new Set());
    }
    connections.get(userId).add(ws);

    console.log(`WebSocket connected: user ${userId}`);

    // Broadcast presence update
    presence.handleConnect(userId);

    // -----------------------------------------------------------------------
    // Pong handler for heartbeat
    // -----------------------------------------------------------------------
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // -----------------------------------------------------------------------
    // Message routing
    // -----------------------------------------------------------------------
    ws.on('message', (raw) => {
      let message;
      try {
        message = JSON.parse(raw);
      } catch (err) {
        console.error('Invalid WebSocket message:', err.message);
        return;
      }

      const { type, data } = message;

      switch (type) {
        case 'ping':
          // Client-side heartbeat; respond with pong
          sendToSocket(ws, 'pong', {});
          break;

        case 'presence':
          if (data && data.action === 'join') {
            presence.handleJoinPage(userId, data.page);
          } else if (data && data.action === 'leave') {
            presence.handleLeavePage(userId, data.page);
          }
          break;

        case 'cursor':
          cursors.handleCursorMove(userId, data);
          break;

        case 'notification':
          // Clients don't typically send notifications, but support it for admin use
          if (data && data.targetUserId) {
            notifications.sendNotification(data.targetUserId, data.notification);
          }
          break;

        default:
          console.warn('Unknown WebSocket message type:', type);
      }
    });

    // -----------------------------------------------------------------------
    // Disconnect handling
    // -----------------------------------------------------------------------
    ws.on('close', () => {
      console.log(`WebSocket disconnected: user ${userId}`);

      const userConns = connections.get(userId);
      if (userConns) {
        userConns.delete(ws);
        if (userConns.size === 0) {
          connections.delete(userId);
          // User fully offline: clean up presence
          presence.handleDisconnect(userId);
        }
      }
    });

    ws.on('error', (err) => {
      console.error(`WebSocket error for user ${userId}:`, err.message);
    });
  });

  // -------------------------------------------------------------------------
  // Heartbeat: ping every 30s, terminate dead connections
  // -------------------------------------------------------------------------
  heartbeatTimer = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        console.log(`Terminating dead WebSocket connection: user ${ws.userId}`);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, HEARTBEAT_INTERVAL);

  wss.on('close', () => {
    clearInterval(heartbeatTimer);
  });

  return { wss };
}

/**
 * Send a JSON message to a specific WebSocket.
 */
function sendToSocket(ws, type, data) {
  if (ws.readyState === 1) { // WebSocket.OPEN
    ws.send(JSON.stringify({ type, data }));
  }
}

/**
 * Broadcast a message to all connected clients, optionally excluding a user.
 *
 * @param {string} type - Message type
 * @param {*} data - Message payload
 * @param {string|null} excludeUserId - User ID to exclude from broadcast
 */
function broadcast(type, data, excludeUserId) {
  const payload = JSON.stringify({ type, data });

  for (const [userId, sockets] of connections) {
    if (excludeUserId && userId === excludeUserId) continue;
    for (const ws of sockets) {
      if (ws.readyState === 1) {
        ws.send(payload);
      }
    }
  }
}

/**
 * Send a message to a specific user (all their connections).
 *
 * @param {string} userId - Target user ID
 * @param {string} type - Message type
 * @param {*} data - Message payload
 * @returns {boolean} Whether the user was online and received the message
 */
function sendToUser(userId, type, data) {
  const sockets = connections.get(userId);
  if (!sockets || sockets.size === 0) return false;

  const payload = JSON.stringify({ type, data });
  for (const ws of sockets) {
    if (ws.readyState === 1) {
      ws.send(payload);
    }
  }
  return true;
}

/**
 * Get the connections map (for use by other websocket modules).
 */
function getConnections() {
  return connections;
}

module.exports = { setupWebSocket, broadcast, sendToUser, getConnections };
