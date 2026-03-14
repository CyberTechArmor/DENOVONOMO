/**
 * Markdown WYSIWYG editor component for De Novo NoMo.
 * Creates a toolbar + contenteditable area with preview/split modes.
 * Relies on markdown-it loaded via CDN (available as window.markdownit).
 */

/**
 * Create a markdown editor instance.
 *
 * @param {HTMLElement} container - The DOM element to render into
 * @param {object} [opts]
 * @param {string} [opts.initialContent] - Initial markdown content
 * @param {string} [opts.placeholder] - Placeholder text
 * @returns {object} Editor API
 */
function createMarkdownEditor(container, opts) {
  opts = opts || {};

  var changeCallbacks = [];
  var currentMode = 'edit'; // 'edit' | 'preview' | 'split'
  var md = null;

  // Initialize markdown-it if available
  if (typeof window.markdownit === 'function') {
    md = window.markdownit({ html: false, linkify: true, typographer: true });
  }

  // -----------------------------------------------------------------------
  // Toolbar button definitions
  // -----------------------------------------------------------------------
  var toolbarButtons = [
    { label: 'B', title: 'Bold', action: 'bold', syntax: '**', wrap: true },
    { label: 'I', title: 'Italic', action: 'italic', syntax: '*', wrap: true },
    { label: 'H', title: 'Heading', action: 'heading', syntax: '## ', wrap: false },
    { label: 'Link', title: 'Link', action: 'link', syntax: '[text](url)', wrap: false },
    { label: 'Code', title: 'Code Block', action: 'codeblock', syntax: '```\n', wrap: true, endSyntax: '\n```' },
    { label: '>', title: 'Blockquote', action: 'blockquote', syntax: '> ', wrap: false },
    { label: 'UL', title: 'Unordered List', action: 'ul', syntax: '- ', wrap: false },
    { label: 'OL', title: 'Ordered List', action: 'ol', syntax: '1. ', wrap: false },
    { label: 'HR', title: 'Horizontal Rule', action: 'hr', syntax: '\n---\n', wrap: false },
    { label: 'Table', title: 'Table', action: 'table', syntax: '| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell     | Cell     | Cell     |', wrap: false },
    { type: 'separator' },
    { label: 'Edit', title: 'Edit mode', action: 'mode-edit', mode: true },
    { label: 'Preview', title: 'Preview mode', action: 'mode-preview', mode: true },
    { label: 'Split', title: 'Split view', action: 'mode-split', mode: true },
  ];

  // -----------------------------------------------------------------------
  // Render the editor structure
  // -----------------------------------------------------------------------
  container.innerHTML = '';
  container.classList.add('md-editor');

  // Toolbar
  var toolbarEl = document.createElement('div');
  toolbarEl.className = 'md-editor-toolbar';

  toolbarButtons.forEach(function (btn) {
    if (btn.type === 'separator') {
      var sep = document.createElement('span');
      sep.className = 'md-editor-separator';
      toolbarEl.appendChild(sep);
      return;
    }

    var buttonEl = document.createElement('button');
    buttonEl.className = 'md-editor-btn';
    buttonEl.type = 'button';
    buttonEl.textContent = btn.label;
    buttonEl.title = btn.title;
    buttonEl.setAttribute('data-action', btn.action);

    if (btn.mode) {
      buttonEl.classList.add('md-editor-mode-btn');
      if ((btn.action === 'mode-edit' && currentMode === 'edit') ||
          (btn.action === 'mode-preview' && currentMode === 'preview') ||
          (btn.action === 'mode-split' && currentMode === 'split')) {
        buttonEl.classList.add('md-editor-btn-active');
      }
    }

    buttonEl.addEventListener('click', function () {
      handleToolbarAction(btn);
    });

    toolbarEl.appendChild(buttonEl);
  });
  container.appendChild(toolbarEl);

  // Editor body (holds edit and preview panes)
  var bodyEl = document.createElement('div');
  bodyEl.className = 'md-editor-body md-editor-mode-edit';
  container.appendChild(bodyEl);

  // Edit pane (textarea for raw markdown)
  var editPane = document.createElement('div');
  editPane.className = 'md-editor-pane md-editor-edit-pane';

  var textarea = document.createElement('textarea');
  textarea.className = 'md-editor-textarea';
  textarea.placeholder = opts.placeholder || 'Write markdown here...';
  textarea.spellcheck = true;
  if (opts.initialContent) {
    textarea.value = opts.initialContent;
  }
  editPane.appendChild(textarea);
  bodyEl.appendChild(editPane);

  // Preview pane
  var previewPane = document.createElement('div');
  previewPane.className = 'md-editor-pane md-editor-preview-pane';
  bodyEl.appendChild(previewPane);

  // -----------------------------------------------------------------------
  // Input handling
  // -----------------------------------------------------------------------
  textarea.addEventListener('input', function () {
    fireChange();
    if (currentMode === 'split') {
      renderPreview();
    }
  });

  // Tab key inserts spaces instead of changing focus
  textarea.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertAtCursor('  ');
    }
  });

  // -----------------------------------------------------------------------
  // Toolbar action handler
  // -----------------------------------------------------------------------
  function handleToolbarAction(btn) {
    // Mode buttons
    if (btn.action === 'mode-edit') {
      setMode('edit');
      return;
    }
    if (btn.action === 'mode-preview') {
      setMode('preview');
      return;
    }
    if (btn.action === 'mode-split') {
      setMode('split');
      return;
    }

    // Syntax insertion buttons
    textarea.focus();

    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var selected = textarea.value.substring(start, end);

    if (btn.wrap && selected.length > 0) {
      // Wrap selected text with syntax
      var endSyntax = btn.endSyntax || btn.syntax;
      var replacement = btn.syntax + selected + endSyntax;
      replaceSelection(replacement);
      // Place cursor after the wrapped text
      var newPos = start + replacement.length;
      textarea.setSelectionRange(newPos, newPos);
    } else if (btn.action === 'link') {
      var linkText = selected || 'text';
      var replacement2 = '[' + linkText + '](url)';
      replaceSelection(replacement2);
      // Select "url" for easy replacement
      var urlStart = start + linkText.length + 3;
      textarea.setSelectionRange(urlStart, urlStart + 3);
    } else if (btn.wrap) {
      // No selection: insert syntax pair and place cursor inside
      var endSyntax2 = btn.endSyntax || btn.syntax;
      insertAtCursor(btn.syntax + endSyntax2);
      var cursorPos = start + btn.syntax.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    } else {
      // Line-prefix style: insert at cursor
      insertAtCursor(btn.syntax);
    }

    fireChange();
    if (currentMode === 'split') {
      renderPreview();
    }
  }

  // -----------------------------------------------------------------------
  // Text manipulation helpers
  // -----------------------------------------------------------------------
  function insertAtCursor(text) {
    var start = textarea.selectionStart;
    var before = textarea.value.substring(0, start);
    var after = textarea.value.substring(textarea.selectionEnd);
    textarea.value = before + text + after;
    var newPos = start + text.length;
    textarea.setSelectionRange(newPos, newPos);
  }

  function replaceSelection(text) {
    var start = textarea.selectionStart;
    var before = textarea.value.substring(0, start);
    var after = textarea.value.substring(textarea.selectionEnd);
    textarea.value = before + text + after;
  }

  // -----------------------------------------------------------------------
  // Mode management
  // -----------------------------------------------------------------------
  function setMode(mode) {
    currentMode = mode;

    bodyEl.className = 'md-editor-body md-editor-mode-' + mode;

    // Update active button state
    var modeButtons = toolbarEl.querySelectorAll('.md-editor-mode-btn');
    for (var i = 0; i < modeButtons.length; i++) {
      var b = modeButtons[i];
      if (b.getAttribute('data-action') === 'mode-' + mode) {
        b.classList.add('md-editor-btn-active');
      } else {
        b.classList.remove('md-editor-btn-active');
      }
    }

    if (mode === 'preview' || mode === 'split') {
      renderPreview();
    }
  }

  // -----------------------------------------------------------------------
  // Preview rendering
  // -----------------------------------------------------------------------
  function renderPreview() {
    var content = textarea.value;
    if (md) {
      previewPane.innerHTML = md.render(content);
    } else {
      // Fallback: basic escaping
      previewPane.innerHTML = '<pre>' + escapeHtml(content) + '</pre>';
    }
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // -----------------------------------------------------------------------
  // Change callback
  // -----------------------------------------------------------------------
  function fireChange() {
    var content = textarea.value;
    changeCallbacks.forEach(function (cb) {
      cb(content);
    });
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------
  function getContent() {
    return textarea.value;
  }

  function setContent(mdContent) {
    textarea.value = mdContent || '';
    fireChange();
    if (currentMode === 'preview' || currentMode === 'split') {
      renderPreview();
    }
  }

  function onChange(callback) {
    if (typeof callback === 'function') {
      changeCallbacks.push(callback);
    }
  }

  return {
    getContent: getContent,
    setContent: setContent,
    onChange: onChange,
    setMode: setMode,
  };
}

// Export for CommonJS / make globally available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createMarkdownEditor: createMarkdownEditor };
}
window.MarkdownEditor = { create: createMarkdownEditor };
