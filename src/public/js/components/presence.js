import ws from '../websocket.js';

/**
 * Presence component.
 * Shows online status indicators (green dots) and page presence (avatars of users on same page).
 *
 * @param {HTMLElement} container - DOM element to render presence into
 * @param {object} [opts]
 * @param {string} [opts.page] - Current page identifier for page-level presence
 * @param {number} [opts.maxAvatars] - Max avatars to show before +N (default: 5)
 * @returns {object} API: update, destroy
 */
export function createPresence(container, opts = {}) {
  const { page = null, maxAvatars = 5 } = opts;
  let users = [];
  let destroyed = false;

  function onPresence(data) {
    if (destroyed) return;
    if (data.page && page && data.page !== page) return;

    if (data.action === 'join' && data.user) {
      const existing = users.find(u => u.id === data.user.id);
      if (!existing) {
        users.push({ ...data.user, online: true });
      } else {
        existing.online = true;
      }
      render();
    } else if (data.action === 'leave' && data.user) {
      users = users.filter(u => u.id !== data.user.id);
      render();
    } else if (data.users) {
      users = data.users.map(u => ({ ...u, online: true }));
      render();
    }
  }

  ws.on('presence', onPresence);

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function render() {
    if (destroyed) return;

    const onlineUsers = users.filter(u => u.online);
    const visibleUsers = onlineUsers.slice(0, maxAvatars);
    const overflow = onlineUsers.length - maxAvatars;

    container.innerHTML = `
      <div class="presence-bar" style="display:flex;align-items:center;gap:4px">
        ${visibleUsers.map(user => {
          const name = user.display_name || user.name || user.email || 'User';
          const initial = name.charAt(0).toUpperCase();
          return `
            <div class="presence-avatar" title="${escapeHtml(name)}" style="
              position:relative;
              width:28px;height:28px;border-radius:50%;
              background:var(--color-primary-100);color:var(--color-primary-700);
              display:flex;align-items:center;justify-content:center;
              font-size:0.6875rem;font-weight:600;
              border:2px solid var(--color-bg);margin-left:-4px;cursor:default;
            ">
              ${user.avatar_url
                ? `<img src="${escapeHtml(user.avatar_url)}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`
                : escapeHtml(initial)
              }
              <span style="
                position:absolute;bottom:-1px;right:-1px;
                width:8px;height:8px;border-radius:50%;
                background:#27ab83;border:2px solid var(--color-bg);
              "></span>
            </div>`;
        }).join('')}
        ${overflow > 0 ? `
          <div style="
            width:28px;height:28px;border-radius:50%;
            background:var(--color-bg-subtle);color:var(--color-text-muted);
            display:flex;align-items:center;justify-content:center;
            font-size:0.625rem;font-weight:600;
            border:2px solid var(--color-bg);margin-left:-4px;
          ">+${overflow}</div>
        ` : ''}
        ${onlineUsers.length > 0
          ? `<span class="text-xs text-muted" style="margin-left:4px">${onlineUsers.length} online</span>`
          : `<span class="text-xs text-muted">No one else here</span>`
        }
      </div>`;
  }

  function update(newUsers) {
    users = newUsers.map(u => ({ ...u, online: true }));
    render();
  }

  function destroy() {
    destroyed = true;
    ws.off('presence', onPresence);
    container.innerHTML = '';
  }

  render();

  return { update, destroy };
}
