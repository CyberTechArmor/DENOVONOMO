'use strict';

const { query } = require('../config/database');

// Throttle tracking: userId -> last broadcast timestamp
const lastUpdate = new Map();
const THROTTLE_MS = 100;

/**
 * Get server functions lazily to avoid circular requires.
 */
function getServer() {
  return require('./server');
}

/**
 * Get the presence module lazily to avoid circular requires.
 */
function getPresence() {
  return require('./presence');
}

/**
 * Look up a user's display_name and avatar from the database.
 * Results are cached in memory for the lifetime of the process.
 *
 * @param {string} userId
 * @returns {Promise<{ display_name: string, avatar: string|null }>}
 */
const userInfoCache = new Map();

async function getUserInfo(userId) {
  if (userInfoCache.has(userId)) {
    return userInfoCache.get(userId);
  }

  try {
    const result = await query(
      'SELECT name, email FROM users WHERE id = $1',
      [userId]
    );

    const info = {
      display_name: result.rows.length > 0 ? (result.rows[0].name || result.rows[0].email) : 'Unknown',
      avatar: null,
    };

    userInfoCache.set(userId, info);
    return info;
  } catch (err) {
    console.error('Error fetching user info for cursor:', err.message);
    return { display_name: 'Unknown', avatar: null };
  }
}

/**
 * Handle a cursor movement event from a user.
 * Throttles broadcasts to at most once per 100ms per user.
 *
 * @param {string} userId - The user moving their cursor
 * @param {{ page: string, x: number, y: number }} data - Cursor position data
 */
async function handleCursorMove(userId, data) {
  if (!data || !data.page || data.x === undefined || data.y === undefined) {
    return;
  }

  // Throttle: ignore updates if last update was < 100ms ago for same user
  const now = Date.now();
  const last = lastUpdate.get(userId) || 0;
  if (now - last < THROTTLE_MS) {
    return;
  }
  lastUpdate.set(userId, now);

  // Get user info to include with cursor data
  const userInfo = await getUserInfo(userId);

  // Only broadcast to other users on the same page
  const presence = getPresence();
  const server = getServer();
  const usersOnPage = presence.getUsersOnPage(data.page);

  const cursorData = {
    userId,
    display_name: userInfo.display_name,
    avatar: userInfo.avatar,
    page: data.page,
    x: data.x,
    y: data.y,
  };

  for (const targetUserId of usersOnPage) {
    if (targetUserId === userId) continue; // Don't send cursor back to the same user
    server.sendToUser(targetUserId, 'cursor_move', cursorData);
  }
}

/**
 * Clear the user info cache for a specific user (e.g., after profile update).
 *
 * @param {string} userId
 */
function clearUserInfoCache(userId) {
  userInfoCache.delete(userId);
}

module.exports = { handleCursorMove, clearUserInfoCache };
