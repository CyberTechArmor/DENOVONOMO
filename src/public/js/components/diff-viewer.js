/**
 * Diff viewer component for De Novo NoMo.
 * Renders side-by-side or unified diff views from structured diff data.
 */

/**
 * Render a diff into the given container.
 *
 * @param {HTMLElement} container - DOM element to render into
 * @param {Array<{ type: 'added'|'removed'|'unchanged', value: string }>} diffData
 * @param {object} [opts]
 * @param {string} [opts.mode] - 'unified' or 'split' (default: 'unified')
 */
function renderDiff(container, diffData, opts) {
  opts = opts || {};
  var mode = opts.mode || 'unified';

  container.innerHTML = '';
  container.classList.add('diff-viewer');

  // Toggle bar
  var toggleBar = document.createElement('div');
  toggleBar.className = 'diff-toggle-bar';

  var unifiedBtn = document.createElement('button');
  unifiedBtn.className = 'diff-toggle-btn' + (mode === 'unified' ? ' diff-toggle-active' : '');
  unifiedBtn.type = 'button';
  unifiedBtn.textContent = 'Unified';

  var splitBtn = document.createElement('button');
  splitBtn.className = 'diff-toggle-btn' + (mode === 'split' ? ' diff-toggle-active' : '');
  splitBtn.type = 'button';
  splitBtn.textContent = 'Split';

  unifiedBtn.addEventListener('click', function () {
    renderDiff(container, diffData, { mode: 'unified' });
  });

  splitBtn.addEventListener('click', function () {
    renderDiff(container, diffData, { mode: 'split' });
  });

  toggleBar.appendChild(unifiedBtn);
  toggleBar.appendChild(splitBtn);
  container.appendChild(toggleBar);

  // Expand diff chunks into individual lines
  var lines = expandLines(diffData);

  if (mode === 'unified') {
    renderUnified(container, lines);
  } else {
    renderSplit(container, lines);
  }
}

/**
 * Expand diff data chunks into individual lines with type annotations.
 *
 * @param {Array} diffData
 * @returns {Array<{ type: string, text: string }>}
 */
function expandLines(diffData) {
  var lines = [];

  diffData.forEach(function (chunk) {
    var rawLines = chunk.value.split('\n');
    // If the value ends with \n, split produces an empty trailing element; remove it
    if (rawLines.length > 0 && rawLines[rawLines.length - 1] === '') {
      rawLines.pop();
    }

    rawLines.forEach(function (text) {
      lines.push({ type: chunk.type, text: text });
    });
  });

  return lines;
}

/**
 * Render unified diff view.
 */
function renderUnified(container, lines) {
  var table = document.createElement('table');
  table.className = 'diff-table diff-unified';

  var thead = document.createElement('thead');
  thead.innerHTML = '<tr><th class="diff-line-num">Old</th><th class="diff-line-num">New</th><th class="diff-line-content">Content</th></tr>';
  table.appendChild(thead);

  var tbody = document.createElement('tbody');
  var oldLineNo = 1;
  var newLineNo = 1;

  lines.forEach(function (line) {
    var tr = document.createElement('tr');
    var prefix = ' ';
    var rowClass = 'diff-unchanged';

    if (line.type === 'added') {
      prefix = '+';
      rowClass = 'diff-added';
      tr.innerHTML =
        '<td class="diff-line-num"></td>' +
        '<td class="diff-line-num">' + newLineNo + '</td>' +
        '<td class="diff-line-content"><span class="diff-prefix">' + prefix + '</span>' + escapeHtml(line.text) + '</td>';
      newLineNo++;
    } else if (line.type === 'removed') {
      prefix = '-';
      rowClass = 'diff-removed';
      tr.innerHTML =
        '<td class="diff-line-num">' + oldLineNo + '</td>' +
        '<td class="diff-line-num"></td>' +
        '<td class="diff-line-content"><span class="diff-prefix">' + prefix + '</span>' + escapeHtml(line.text) + '</td>';
      oldLineNo++;
    } else {
      tr.innerHTML =
        '<td class="diff-line-num">' + oldLineNo + '</td>' +
        '<td class="diff-line-num">' + newLineNo + '</td>' +
        '<td class="diff-line-content"><span class="diff-prefix">' + prefix + '</span>' + escapeHtml(line.text) + '</td>';
      oldLineNo++;
      newLineNo++;
    }

    tr.className = rowClass;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

/**
 * Render side-by-side split diff view.
 */
function renderSplit(container, lines) {
  var table = document.createElement('table');
  table.className = 'diff-table diff-split';

  var thead = document.createElement('thead');
  thead.innerHTML =
    '<tr>' +
    '<th class="diff-line-num">#</th><th class="diff-line-content">Original</th>' +
    '<th class="diff-line-num">#</th><th class="diff-line-content">Modified</th>' +
    '</tr>';
  table.appendChild(thead);

  var tbody = document.createElement('tbody');

  // Build paired rows: unchanged lines go on both sides,
  // removed on left only, added on right only.
  // We pair consecutive removed + added blocks together.
  var i = 0;
  var oldLineNo = 1;
  var newLineNo = 1;

  while (i < lines.length) {
    var line = lines[i];

    if (line.type === 'unchanged') {
      var tr = document.createElement('tr');
      tr.className = 'diff-unchanged';
      tr.innerHTML =
        '<td class="diff-line-num">' + oldLineNo + '</td>' +
        '<td class="diff-line-content">' + escapeHtml(line.text) + '</td>' +
        '<td class="diff-line-num">' + newLineNo + '</td>' +
        '<td class="diff-line-content">' + escapeHtml(line.text) + '</td>';
      tbody.appendChild(tr);
      oldLineNo++;
      newLineNo++;
      i++;
    } else {
      // Collect consecutive removed and added lines for pairing
      var removed = [];
      var added = [];

      while (i < lines.length && lines[i].type === 'removed') {
        removed.push(lines[i]);
        i++;
      }
      while (i < lines.length && lines[i].type === 'added') {
        added.push(lines[i]);
        i++;
      }

      var maxLen = Math.max(removed.length, added.length);
      for (var j = 0; j < maxLen; j++) {
        var tr2 = document.createElement('tr');

        var leftNum = '';
        var leftContent = '';
        var leftClass = '';
        var rightNum = '';
        var rightContent = '';
        var rightClass = '';

        if (j < removed.length) {
          leftNum = String(oldLineNo);
          leftContent = '<span class="diff-prefix">-</span>' + escapeHtml(removed[j].text);
          leftClass = 'diff-removed';
          oldLineNo++;
        }

        if (j < added.length) {
          rightNum = String(newLineNo);
          rightContent = '<span class="diff-prefix">+</span>' + escapeHtml(added[j].text);
          rightClass = 'diff-added';
          newLineNo++;
        }

        tr2.innerHTML =
          '<td class="diff-line-num ' + leftClass + '">' + leftNum + '</td>' +
          '<td class="diff-line-content ' + leftClass + '">' + leftContent + '</td>' +
          '<td class="diff-line-num ' + rightClass + '">' + rightNum + '</td>' +
          '<td class="diff-line-content ' + rightClass + '">' + rightContent + '</td>';
        tbody.appendChild(tr2);
      }
    }
  }

  table.appendChild(tbody);
  container.appendChild(table);
}

/**
 * Escape HTML special characters.
 */
function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Export for CommonJS / make globally available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderDiff: renderDiff };
}
window.DiffViewer = { renderDiff: renderDiff };
