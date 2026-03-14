'use strict';

// Track online users: userId -> { pages: Set<string> }
const onlineUsers = new Map();

// Track page membership: page -> Set<userId>
const pageUsers = new Map();

/**
 * Get the broadcast and sendToUser functions lazily to avoid circular requires.
 */
function getServer() {
  return require('./server');
}

/**
 * Called when a user first connects via WebSocket.
 *
 * @param {string} userId
 */
function handleConnect(userId) {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, { pages: new Set() });
  }

  // Broadcast updated presence to all clients
  broadcastPresence();
}

/**
 * Called when a user fully disconnects (no remaining WebSocket connections).
 *
 * @param {string} userId
 */
function handleDisconnect(userId) {
  const userData = onlineUsers.get(userId);
  if (userData) {
    // Remove from all page tracking
    for (const page of userData.pages) {
      const users = pageUsers.get(page);
      if (users) {
        users.delete(userId);
        if (users.size === 0) {
          pageUsers.delete(page);
        }
      }
    }
    onlineUsers.delete(userId);
  }

  // Broadcast updated presence to all clients
  broadcastPresence();
}

/**
 * Record that a user has joined a specific page.
 *
 * @param {string} userId
 * @param {string} page - The page identifier (e.g., route path or document ID)
 */
function handleJoinPage(userId, page) {
  if (!page) return;

  let userData = onlineUsers.get(userId);
  if (!userData) {
    userData = { pages: new Set() };
    onlineUsers.set(userId, userData);
  }

  userData.pages.add(page);

  if (!pageUsers.has(page)) {
    pageUsers.set(page, new Set());
  }
  pageUsers.get(page).add(userId);

  // Broadcast page presence update
  broadcastPagePresence(page);
}

/**
 * Record that a user has left a specific page.
 *
 * @param {string} userId
 * @param {string} page
 */
function handleLeavePage(userId, page) {
  if (!page) return;

  const userData = onlineUsers.get(userId);
  if (userData) {
    userData.pages.delete(page);
  }

  const users = pageUsers.get(page);
  if (users) {
    users.delete(userId);
    if (users.size === 0) {
      pageUsers.delete(page);
    }
  }

  // Broadcast page presence update
  broadcastPagePresence(page);
}

/**
 * Get a list of all online user IDs.
 *
 * @returns {string[]}
 */
function getOnlineUsers() {
  return Array.from(onlineUsers.keys());
}

/**
 * Get a list of user IDs currently viewing a specific page.
 *
 * @param {string} page
 * @returns {string[]}
 */
function getUsersOnPage(page) {
  const users = pageUsers.get(page);
  return users ? Array.from(users) : [];
}

/**
 * Broadcast the full list of online users to all connected clients.
 */
function broadcastPresence() {
  const server = getServer();
  server.broadcast('presence_update', {
    onlineUsers: getOnlineUsers(),
  });
}

/**
 * Broadcast the list of users on a specific page to all users on that page.
 *
 * @param {string} page
 */
function broadcastPagePresence(page) {
  const server = getServer();
  const usersOnPage = getUsersOnPage(page);

  // Send to all users on this page
  for (const userId of usersOnPage) {
    server.sendToUser(userId, 'page_presence', {
      page,
      users: usersOnPage,
    });
  }
}

module.exports = {
  handleConnect,
  handleDisconnect,
  handleJoinPage,
  handleLeavePage,
  getOnlineUsers,
  getUsersOnPage,
};
