'use strict';

const { query } = require('../config/database');

/**
 * Get server functions lazily to avoid circular requires.
 */
function getServer() {
  return require('./server');
}

/**
 * Send a notification to a specific user.
 * Always persists to the database. Also delivers via WebSocket if the user is online.
 *
 * @param {string} userId - Target user ID
 * @param {{ type: string, title: string, message: string, link?: string }} notification
 * @returns {Promise<object>} The saved notification record
 */
async function sendNotification(userId, notification) {
  const now = new Date().toISOString();

  const notif = {
    type: notification.type || 'info',
    title: notification.title || '',
    message: notification.message || '',
    link: notification.link || null,
    createdAt: now,
  };

  // Persist to database
  let saved;
  try {
    const result = await query(
      `INSERT INTO notifications (user_id, type, title, message, link, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, notif.type, notif.title, notif.message, notif.link, notif.createdAt]
    );
    saved = result.rows[0];
  } catch (err) {
    console.error('Error saving notification:', err.message);
    saved = notif;
  }

  // Deliver via WebSocket if online
  const server = getServer();
  server.sendToUser(userId, 'notification', notif);

  return saved;
}

/**
 * Broadcast a notification to all users with a given role.
 * Persists a notification record for each matching user and delivers via WebSocket
 * to those who are online.
 *
 * @param {string} role - The role to target (e.g., 'admin', 'super_admin', 'editor')
 * @param {{ type: string, title: string, message: string, link?: string }} notification
 * @returns {Promise<void>}
 */
async function broadcastToRole(role, notification) {
  let users;
  try {
    const result = await query('SELECT id FROM users WHERE role = $1', [role]);
    users = result.rows;
  } catch (err) {
    console.error('Error fetching users by role:', err.message);
    return;
  }

  const promises = users.map((user) => sendNotification(user.id, notification));
  await Promise.allSettled(promises);
}

module.exports = { sendNotification, broadcastToRole };
