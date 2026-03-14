const shortcuts = [];

export function registerShortcut(keys, handler) {
  const combo = parseKeys(keys);
  shortcuts.push({ combo, handler, keys });
}

function parseKeys(keys) {
  const parts = keys.toLowerCase().split('+').map(p => p.trim());
  return {
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    meta: parts.includes('meta') || parts.includes('cmd'),
    key: parts.find(p => !['ctrl', 'control', 'shift', 'alt', 'meta', 'cmd'].includes(p)) || ''
  };
}

function matchesCombo(event, combo) {
  const ctrlOrMeta = combo.ctrl ? (event.ctrlKey || event.metaKey) : (!event.ctrlKey && !event.metaKey);
  const shift = combo.shift ? event.shiftKey : !event.shiftKey;
  const alt = combo.alt ? event.altKey : !event.altKey;

  if (combo.ctrl && !(event.ctrlKey || event.metaKey)) return false;
  if (!combo.ctrl && (event.ctrlKey || event.metaKey)) return false;
  if (combo.shift !== event.shiftKey) return false;
  if (combo.alt !== event.altKey) return false;

  const pressedKey = event.key.toLowerCase();
  return pressedKey === combo.key;
}

document.addEventListener('keydown', (event) => {
  // Don't trigger shortcuts when typing in inputs
  const tag = event.target.tagName;
  const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || event.target.isContentEditable;

  for (const shortcut of shortcuts) {
    if (matchesCombo(event, shortcut.combo)) {
      // Allow certain shortcuts even in inputs (like ctrl+k)
      if (shortcut.combo.ctrl || shortcut.combo.meta || !isInput) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.handler(event);
        return;
      }
    }
  }
});
