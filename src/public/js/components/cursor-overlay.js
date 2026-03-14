/**
 * Cursor Overlay component.
 * Shows collaborative cursors with colored arrows and name labels.
 *
 * @param {HTMLElement} parentEl - The element to overlay cursors on
 * @returns {object} API: addCursor, updateCursor, removeCursor, destroy
 */
export function createCursorOverlay(parentEl) {
  const cursors = new Map();
  let destroyed = false;

  const COLORS = [
    '#e12d39', '#2680c2', '#27ab83', '#e9b949',
    '#8b5cf6', '#ec4899', '#f97316', '#14b8a6'
  ];

  // Create overlay container
  const overlay = document.createElement('div');
  overlay.className = 'cursor-overlay';
  overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;overflow:hidden';

  // Ensure parent is positioned
  const parentPos = getComputedStyle(parentEl).position;
  if (parentPos === 'static') {
    parentEl.style.position = 'relative';
  }
  parentEl.appendChild(overlay);

  function getColor(userId) {
    let hash = 0;
    const str = String(userId);
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function createCursorEl(userId, name, color) {
    const el = document.createElement('div');
    el.className = 'cursor-remote';
    el.style.cssText = 'position:absolute;transition:left 0.15s ease,top 0.15s ease;pointer-events:none;z-index:51';
    el.setAttribute('data-user-id', userId);

    el.innerHTML = `
      <svg width="16" height="20" viewBox="0 0 16 20" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3))">
        <path d="M0 0L16 12L8 12L4 20L0 0Z" fill="${color}" stroke="#fff" stroke-width="1"/>
      </svg>
      <span style="
        display:inline-block;
        margin-left:12px;
        margin-top:-4px;
        background:${color};
        color:#fff;
        font-size:0.6875rem;
        font-weight:600;
        padding:1px 6px;
        border-radius:3px;
        white-space:nowrap;
        box-shadow:0 1px 3px rgba(0,0,0,0.2);
        max-width:120px;
        overflow:hidden;
        text-overflow:ellipsis;
      ">${escapeHtml(name || 'Anonymous')}</span>
    `;

    return el;
  }

  /**
   * Add or update a remote cursor.
   * @param {string} userId
   * @param {string} name - Display name
   * @param {number} x - X position (px relative to parent)
   * @param {number} y - Y position (px relative to parent)
   */
  function addCursor(userId, name, x, y) {
    if (destroyed) return;

    let cursor = cursors.get(userId);
    if (!cursor) {
      const color = getColor(userId);
      const el = createCursorEl(userId, name, color);
      overlay.appendChild(el);
      cursor = { el, name, color, timeout: null };
      cursors.set(userId, cursor);
    }

    cursor.el.style.left = x + 'px';
    cursor.el.style.top = y + 'px';
    cursor.el.style.opacity = '1';

    // Auto-fade after 10s of inactivity
    clearTimeout(cursor.timeout);
    cursor.timeout = setTimeout(() => {
      if (cursor.el) cursor.el.style.opacity = '0.3';
    }, 10000);
  }

  /** Alias for addCursor. */
  function updateCursor(userId, name, x, y) {
    addCursor(userId, name, x, y);
  }

  /**
   * Remove a cursor.
   * @param {string} userId
   */
  function removeCursor(userId) {
    const cursor = cursors.get(userId);
    if (!cursor) return;

    clearTimeout(cursor.timeout);
    cursor.el.style.opacity = '0';
    setTimeout(() => {
      if (cursor.el && cursor.el.parentNode) {
        cursor.el.parentNode.removeChild(cursor.el);
      }
      cursors.delete(userId);
    }, 300);
  }

  /** Destroy all cursors and remove overlay. */
  function destroy() {
    destroyed = true;
    cursors.forEach((cursor) => {
      clearTimeout(cursor.timeout);
      if (cursor.el && cursor.el.parentNode) {
        cursor.el.parentNode.removeChild(cursor.el);
      }
    });
    cursors.clear();
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  return { addCursor, updateCursor, removeCursor, destroy };
}
