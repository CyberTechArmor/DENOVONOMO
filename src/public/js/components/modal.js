let activeModal = null;

export function openModal(options = {}) {
  // Close any existing modal
  closeModal();

  const {
    title = '',
    body = '',
    footer = null,
    size = 'md',
    onClose = null,
    closable = true
  } = options;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = `modal modal-${size}`;

  // Header
  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `<h3 class="modal-title">${title}</h3>`;
  if (closable) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.addEventListener('click', () => closeModal());
    header.appendChild(closeBtn);
  }
  modal.appendChild(header);

  // Body
  const bodyEl = document.createElement('div');
  bodyEl.className = 'modal-body';
  if (typeof body === 'string') {
    bodyEl.innerHTML = body;
  } else if (body instanceof HTMLElement) {
    bodyEl.appendChild(body);
  }
  modal.appendChild(bodyEl);

  // Footer
  if (footer) {
    const footerEl = document.createElement('div');
    footerEl.className = 'modal-footer';
    if (typeof footer === 'string') {
      footerEl.innerHTML = footer;
    } else if (Array.isArray(footer)) {
      footer.forEach(btnConfig => {
        const btn = document.createElement('button');
        btn.className = `btn ${btnConfig.class || 'btn-secondary'}`;
        btn.textContent = btnConfig.label || 'Button';
        if (btnConfig.onClick) {
          btn.addEventListener('click', btnConfig.onClick);
        }
        footerEl.appendChild(btn);
      });
    } else if (footer instanceof HTMLElement) {
      footerEl.appendChild(footer);
    }
    modal.appendChild(footerEl);
  }

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close on overlay click
  if (closable) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // Close on Escape
  const escHandler = (e) => {
    if (e.key === 'Escape' && closable) closeModal();
  };
  document.addEventListener('keydown', escHandler);

  activeModal = { overlay, modal, onClose, escHandler };

  // Trigger entrance animation
  requestAnimationFrame(() => {
    overlay.classList.add('is-active');
  });

  return { overlay, modal, bodyEl };
}

export function closeModal() {
  if (!activeModal) return;

  const { overlay, onClose, escHandler } = activeModal;
  document.removeEventListener('keydown', escHandler);

  overlay.classList.remove('is-active');

  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }, 300);

  if (onClose) onClose();
  activeModal = null;
}

export function confirmModal(title, message) {
  return new Promise((resolve) => {
    openModal({
      title,
      body: `<p>${message}</p>`,
      closable: true,
      onClose: () => resolve(false),
      footer: [
        {
          label: 'Cancel',
          class: 'btn-secondary',
          onClick: () => {
            closeModal();
            resolve(false);
          }
        },
        {
          label: 'Confirm',
          class: 'btn-primary',
          onClick: () => {
            closeModal();
            resolve(true);
          }
        }
      ]
    });
  });
}
