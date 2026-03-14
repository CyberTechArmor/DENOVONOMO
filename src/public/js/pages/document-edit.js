import api from '../api.js';
import { showToast } from '../components/toast.js';
import { confirmModal } from '../components/modal.js';
import auth from '../auth.js';
import ws from '../websocket.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export default function documentEditPage(params) {
  const container = document.getElementById('page-content');
  let doc = null;
  let editor = null;
  let originalContent = '';
  let autoSaveInterval = null;
  let hasUnsavedChanges = false;
  let destroyed = false;
  let previewMode = false;

  const AUTO_SAVE_KEY = `denovonomo-autosave-${params.id}`;

  function renderLoading() {
    container.innerHTML = `
      <div class="p-6">
        <div class="skeleton skeleton-heading mb-4" style="width:30%"></div>
        <div class="card">
          <div class="skeleton skeleton-text mb-2"></div>
          <div class="skeleton skeleton-card" style="height:400px"></div>
        </div>
      </div>`;
  }

  function render() {
    if (destroyed || !doc) return;

    container.innerHTML = `
      <div class="p-6">
        <!-- Top bar -->
        <div class="flex justify-between items-center mb-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <a href="#/documents/${params.id}" class="text-sm text-muted" style="text-decoration:none">&larr; Back to document</a>
            </div>
            <h1 style="margin:0;font-size:1.25rem">Editing: ${escapeHtml(doc.title || 'Untitled')}</h1>
          </div>
          <div class="flex gap-2 items-center">
            <div id="edit-presence" style="margin-right:var(--space-3)"></div>
            <span class="text-xs text-muted" id="edit-autosave-status"></span>
            <button class="btn btn-secondary btn-sm" id="edit-cancel-btn">Cancel</button>
            <button class="btn btn-primary" id="edit-save-btn">Save</button>
          </div>
        </div>

        <!-- Change summary -->
        <div class="mb-4">
          <label class="form-label text-sm">Change Summary</label>
          <input type="text" id="edit-change-summary" class="form-input" placeholder="Describe what you changed..." style="max-width:600px">
        </div>

        <!-- Editor area -->
        <div class="card" style="overflow:hidden">
          <div id="edit-toolbar" style="
            display:flex;gap:4px;padding:var(--space-2) var(--space-3);
            border-bottom:1px solid var(--color-border);
            background:var(--color-bg-subtle);flex-wrap:wrap;align-items:center;
          ">
            <button class="btn btn-sm btn-ghost edit-tb-btn" data-action="bold" title="Bold"><strong>B</strong></button>
            <button class="btn btn-sm btn-ghost edit-tb-btn" data-action="italic" title="Italic"><em>I</em></button>
            <span style="width:1px;height:20px;background:var(--color-border);margin:0 4px"></span>
            <button class="btn btn-sm btn-ghost edit-tb-btn" data-action="h1" title="Heading 1">H1</button>
            <button class="btn btn-sm btn-ghost edit-tb-btn" data-action="h2" title="Heading 2">H2</button>
            <button class="btn btn-sm btn-ghost edit-tb-btn" data-action="h3" title="Heading 3">H3</button>
            <span style="width:1px;height:20px;background:var(--color-border);margin:0 4px"></span>
            <button class="btn btn-sm btn-ghost edit-tb-btn" data-action="link" title="Link">Link</button>
            <button class="btn btn-sm btn-ghost edit-tb-btn" data-action="image" title="Image">Img</button>
            <button class="btn btn-sm btn-ghost edit-tb-btn" data-action="code" title="Code Block">Code</button>
            <button class="btn btn-sm btn-ghost edit-tb-btn" data-action="quote" title="Blockquote">Quote</button>
            <button class="btn btn-sm btn-ghost edit-tb-btn" data-action="ul" title="Unordered List">List</button>
            <button class="btn btn-sm btn-ghost edit-tb-btn" data-action="table" title="Table">Table</button>
            <button class="btn btn-sm btn-ghost edit-tb-btn" data-action="hr" title="Horizontal Rule">HR</button>
            <span style="flex:1"></span>
            <button class="btn btn-sm ${previewMode ? 'btn-primary' : 'btn-ghost'}" id="edit-preview-toggle">Preview</button>
          </div>

          <div id="edit-body" style="display:flex;min-height:500px">
            <div id="edit-editor-pane" style="flex:1;${previewMode ? 'display:none' : ''}">
              <textarea id="edit-textarea" style="
                width:100%;height:100%;min-height:500px;padding:var(--space-4);
                border:none;outline:none;resize:vertical;font-family:monospace;
                font-size:0.875rem;line-height:1.6;background:transparent;
                color:var(--color-text);
              " spellcheck="true" placeholder="Write markdown here...">${escapeHtml(doc.content || '')}</textarea>
            </div>
            <div id="edit-preview-pane" style="flex:1;padding:var(--space-4);overflow-y:auto;line-height:1.8;${previewMode ? '' : 'display:none;'}border-left:1px solid var(--color-border)">
            </div>
          </div>
        </div>
      </div>`;

    bindEvents();
    checkAutoSave();
    startAutoSave();
  }

  function bindEvents() {
    const textarea = container.querySelector('#edit-textarea');
    const saveBtn = container.querySelector('#edit-save-btn');
    const cancelBtn = container.querySelector('#edit-cancel-btn');
    const previewToggle = container.querySelector('#edit-preview-toggle');

    // Track changes
    if (textarea) {
      textarea.addEventListener('input', () => {
        hasUnsavedChanges = textarea.value !== originalContent;
      });

      // Tab key inserts spaces
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 2;
          hasUnsavedChanges = true;
        }
        // Ctrl+S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          handleSave();
        }
      });
    }

    // Toolbar buttons
    container.querySelectorAll('.edit-tb-btn').forEach(btn => {
      btn.addEventListener('click', () => handleToolbarAction(btn.dataset.action));
    });

    if (saveBtn) saveBtn.addEventListener('click', handleSave);
    if (cancelBtn) cancelBtn.addEventListener('click', handleCancel);
    if (previewToggle) previewToggle.addEventListener('click', togglePreview);
  }

  function handleToolbarAction(action) {
    const textarea = container.querySelector('#edit-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);

    const actions = {
      bold: { wrap: '**', text: 'bold text' },
      italic: { wrap: '*', text: 'italic text' },
      h1: { prefix: '# ', text: 'Heading 1' },
      h2: { prefix: '## ', text: 'Heading 2' },
      h3: { prefix: '### ', text: 'Heading 3' },
      link: { template: `[${selected || 'link text'}](url)` },
      image: { template: `![${selected || 'alt text'}](image-url)` },
      code: { wrap: '```\n', wrapEnd: '\n```', text: 'code' },
      quote: { prefix: '> ', text: 'quote' },
      ul: { prefix: '- ', text: 'list item' },
      table: { insert: '| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell     | Cell     | Cell     |' },
      hr: { insert: '\n---\n' }
    };

    const act = actions[action];
    if (!act) return;

    textarea.focus();

    if (act.wrap) {
      const wrapEnd = act.wrapEnd || act.wrap;
      const text = selected || act.text;
      const replacement = act.wrap + text + wrapEnd;
      textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
      textarea.selectionStart = start + act.wrap.length;
      textarea.selectionEnd = start + act.wrap.length + text.length;
    } else if (act.prefix) {
      const text = selected || act.text;
      textarea.value = textarea.value.substring(0, start) + act.prefix + text + textarea.value.substring(end);
      textarea.selectionStart = start + act.prefix.length;
      textarea.selectionEnd = start + act.prefix.length + text.length;
    } else if (act.template) {
      textarea.value = textarea.value.substring(0, start) + act.template + textarea.value.substring(end);
      textarea.selectionStart = start;
      textarea.selectionEnd = start + act.template.length;
    } else if (act.insert) {
      textarea.value = textarea.value.substring(0, start) + act.insert + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + act.insert.length;
    }

    hasUnsavedChanges = true;
  }

  function togglePreview() {
    previewMode = !previewMode;
    const editorPane = container.querySelector('#edit-editor-pane');
    const previewPane = container.querySelector('#edit-preview-pane');
    const toggleBtn = container.querySelector('#edit-preview-toggle');
    const textarea = container.querySelector('#edit-textarea');

    if (previewMode) {
      // Show split view
      if (editorPane) editorPane.style.display = '';
      if (previewPane) {
        previewPane.style.display = '';
        const content = textarea?.value || '';
        if (typeof window.markdownit === 'function') {
          const md = window.markdownit({ html: false, linkify: true, typographer: true });
          previewPane.innerHTML = md.render(content);
        } else {
          previewPane.innerHTML = '<pre>' + escapeHtml(content) + '</pre>';
        }
      }
      if (toggleBtn) toggleBtn.classList.add('btn-primary');
      if (toggleBtn) toggleBtn.classList.remove('btn-ghost');
    } else {
      if (previewPane) previewPane.style.display = 'none';
      if (editorPane) editorPane.style.display = '';
      if (toggleBtn) toggleBtn.classList.remove('btn-primary');
      if (toggleBtn) toggleBtn.classList.add('btn-ghost');
    }
  }

  async function handleSave() {
    const textarea = container.querySelector('#edit-textarea');
    const summaryInput = container.querySelector('#edit-change-summary');
    const saveBtn = container.querySelector('#edit-save-btn');

    if (!textarea) return;

    const content = textarea.value;
    const changeSummary = summaryInput?.value?.trim() || '';

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }

    try {
      const isSuperAdmin = auth.isSuperAdmin();
      const status = isSuperAdmin ? 'approved' : 'pending_review';

      await api.post(`/documents/${params.id}/versions`, {
        content,
        change_summary: changeSummary,
        status
      });

      hasUnsavedChanges = false;
      originalContent = content;
      localStorage.removeItem(AUTO_SAVE_KEY);

      showToast(
        isSuperAdmin ? 'Document saved and approved' : 'Document saved (pending review)',
        'success'
      );

      window.location.hash = `#/documents/${params.id}`;
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
      }
    }
  }

  async function handleCancel() {
    if (hasUnsavedChanges) {
      const confirmed = await confirmModal(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.'
      );
      if (!confirmed) return;
    }
    localStorage.removeItem(AUTO_SAVE_KEY);
    window.location.hash = `#/documents/${params.id}`;
  }

  function startAutoSave() {
    autoSaveInterval = setInterval(() => {
      if (destroyed) return;
      const textarea = container.querySelector('#edit-textarea');
      if (!textarea) return;

      const content = textarea.value;
      if (content !== originalContent) {
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({
          content,
          savedAt: new Date().toISOString()
        }));
        const status = container.querySelector('#edit-autosave-status');
        if (status) {
          status.textContent = 'Auto-saved';
          setTimeout(() => { if (status) status.textContent = ''; }, 2000);
        }
      }
    }, 30000);
  }

  function checkAutoSave() {
    try {
      const saved = localStorage.getItem(AUTO_SAVE_KEY);
      if (!saved) return;

      const { content, savedAt } = JSON.parse(saved);
      if (content && content !== originalContent) {
        showToast('Auto-saved draft found. Restoring...', 'info');
        const textarea = container.querySelector('#edit-textarea');
        if (textarea) {
          textarea.value = content;
          hasUnsavedChanges = true;
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  // beforeunload warning
  function onBeforeUnload(e) {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  }
  window.addEventListener('beforeunload', onBeforeUnload);

  // Join presence for collaboration
  ws.sendPageJoin(`document-${params.id}`);

  async function loadData() {
    renderLoading();
    try {
      const data = await api.get(`/documents/${params.id}`);
      doc = data.document || data;
      originalContent = doc.content || '';
      render();
    } catch (err) {
      container.innerHTML = `
        <div class="p-6">
          <a href="#/documents" class="text-sm text-muted" style="text-decoration:none">&larr; Back to Documents</a>
          <div class="empty-state mt-5">
            <h3>Could Not Load Document</h3>
            <p>${escapeHtml(err.message)}</p>
          </div>
        </div>`;
    }
  }

  loadData();

  return {
    destroy() {
      destroyed = true;
      window.removeEventListener('beforeunload', onBeforeUnload);
      if (autoSaveInterval) clearInterval(autoSaveInterval);
      ws.sendPageLeave(`document-${params.id}`);
    }
  };
}
