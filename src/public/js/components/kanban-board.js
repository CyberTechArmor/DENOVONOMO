/**
 * Kanban board component for De Novo NoMo.
 * Creates a drag-and-drop kanban board with configurable columns.
 */

/**
 * Create a kanban board instance.
 *
 * @param {HTMLElement} container - The DOM element to render into
 * @param {object} config
 * @param {Array<{ id: string, title: string, color?: string }>} config.columns - Column definitions
 * @param {function} [config.onCardMove] - Callback: (cardId, newStatus, oldStatus) => void
 * @param {function} [config.onCardClick] - Callback: (cardId) => void
 * @returns {object} Board API
 */
function createKanbanBoard(container, config) {
  var columns = config.columns || [];
  var onCardMove = config.onCardMove || null;
  var onCardClick = config.onCardClick || null;

  // Internal card registry: cardId -> { data, columnId, element }
  var cards = {};

  // Column element references: columnId -> { listEl }
  var columnRefs = {};

  // -----------------------------------------------------------------------
  // Render the board structure
  // -----------------------------------------------------------------------
  function render() {
    container.innerHTML = '';
    container.classList.add('kanban-board');

    columns.forEach(function (col) {
      var colEl = document.createElement('div');
      colEl.className = 'kanban-column';
      colEl.setAttribute('data-column-id', col.id);

      var headerEl = document.createElement('div');
      headerEl.className = 'kanban-column-header';

      var dotEl = document.createElement('span');
      dotEl.className = 'kanban-column-dot';
      dotEl.style.backgroundColor = col.color || '#6b7280';

      var titleEl = document.createElement('span');
      titleEl.className = 'kanban-column-title';
      titleEl.textContent = col.title;

      var countEl = document.createElement('span');
      countEl.className = 'kanban-column-count';
      countEl.textContent = '0';

      headerEl.appendChild(dotEl);
      headerEl.appendChild(titleEl);
      headerEl.appendChild(countEl);
      colEl.appendChild(headerEl);

      var listEl = document.createElement('div');
      listEl.className = 'kanban-column-cards';
      listEl.setAttribute('data-column-id', col.id);

      // Drag-and-drop: dragover allows drop
      listEl.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        listEl.classList.add('kanban-column-dragover');
      });

      listEl.addEventListener('dragleave', function () {
        listEl.classList.remove('kanban-column-dragover');
      });

      // Drop handler
      listEl.addEventListener('drop', function (e) {
        e.preventDefault();
        listEl.classList.remove('kanban-column-dragover');

        var cardId = e.dataTransfer.getData('text/plain');
        if (!cardId || !cards[cardId]) return;

        var fromColumn = cards[cardId].columnId;
        var toColumn = col.id;

        if (fromColumn === toColumn) return;

        moveCard(cardId, fromColumn, toColumn);
      });

      colEl.appendChild(listEl);
      container.appendChild(colEl);

      columnRefs[col.id] = { listEl: listEl, countEl: countEl };
    });
  }

  // -----------------------------------------------------------------------
  // Render a card element from data
  // -----------------------------------------------------------------------
  function renderCard(data) {
    var cardEl = document.createElement('div');
    cardEl.className = 'kanban-card';
    cardEl.setAttribute('draggable', 'true');
    cardEl.setAttribute('data-card-id', data.id);

    // Build card HTML
    var html = '';

    // Category dot + title row
    html += '<div class="kanban-card-header">';
    if (data.category) {
      html += '<span class="kanban-card-category" style="background-color:' +
        (data.categoryColor || '#6b7280') + '"></span>';
    }
    html += '<span class="kanban-card-title">' + escapeHtml(data.title || '') + '</span>';
    html += '</div>';

    // Description snippet
    if (data.description) {
      html += '<p class="kanban-card-desc">' + escapeHtml(truncate(data.description, 80)) + '</p>';
    }

    // Footer: priority badge, avatar, due date
    html += '<div class="kanban-card-footer">';
    if (data.priority) {
      var priorityClass = 'kanban-priority-' + data.priority.toLowerCase();
      html += '<span class="kanban-card-priority ' + priorityClass + '">' +
        escapeHtml(data.priority) + '</span>';
    }
    if (data.dueDate) {
      html += '<span class="kanban-card-due">' + escapeHtml(data.dueDate) + '</span>';
    }
    if (data.avatar || data.assignee) {
      html += '<span class="kanban-card-avatar" title="' + escapeHtml(data.assignee || '') + '">';
      if (data.avatar) {
        html += '<img src="' + escapeHtml(data.avatar) + '" alt="" />';
      } else {
        html += '<span class="kanban-card-avatar-initial">' +
          escapeHtml((data.assignee || '?').charAt(0).toUpperCase()) + '</span>';
      }
      html += '</span>';
    }
    html += '</div>';

    cardEl.innerHTML = html;

    // Drag start
    cardEl.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/plain', data.id);
      e.dataTransfer.effectAllowed = 'move';
      cardEl.classList.add('kanban-card-dragging');
    });

    cardEl.addEventListener('dragend', function () {
      cardEl.classList.remove('kanban-card-dragging');
    });

    // Click handler
    cardEl.addEventListener('click', function () {
      if (onCardClick) {
        onCardClick(data.id);
      }
    });

    return cardEl;
  }

  // -----------------------------------------------------------------------
  // Public API: addCard
  // -----------------------------------------------------------------------
  function addCard(columnId, cardData) {
    var ref = columnRefs[columnId];
    if (!ref) {
      console.warn('Kanban: unknown column', columnId);
      return;
    }

    var cardEl = renderCard(cardData);
    ref.listEl.appendChild(cardEl);

    cards[cardData.id] = {
      data: cardData,
      columnId: columnId,
      element: cardEl,
    };

    updateCount(columnId);
  }

  // -----------------------------------------------------------------------
  // Public API: moveCard
  // -----------------------------------------------------------------------
  function moveCard(cardId, fromColumn, toColumn) {
    var card = cards[cardId];
    if (!card) return;

    var fromRef = columnRefs[fromColumn];
    var toRef = columnRefs[toColumn];
    if (!fromRef || !toRef) return;

    var cardEl = card.element;

    // Animate: shrink out of old column
    cardEl.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
    cardEl.style.transform = 'scale(0.95)';
    cardEl.style.opacity = '0.5';

    setTimeout(function () {
      // Move DOM node
      if (cardEl.parentNode) {
        cardEl.parentNode.removeChild(cardEl);
      }
      toRef.listEl.appendChild(cardEl);

      // Animate: expand into new column
      cardEl.style.transform = 'scale(1)';
      cardEl.style.opacity = '1';

      setTimeout(function () {
        cardEl.style.transition = '';
        cardEl.style.transform = '';
        cardEl.style.opacity = '';
      }, 200);
    }, 200);

    // Update tracking
    card.columnId = toColumn;
    updateCount(fromColumn);
    updateCount(toColumn);

    // Fire callback
    if (onCardMove) {
      onCardMove(cardId, toColumn, fromColumn);
    }
  }

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------
  function updateCount(columnId) {
    var ref = columnRefs[columnId];
    if (!ref) return;
    var count = ref.listEl.querySelectorAll('.kanban-card').length;
    ref.countEl.textContent = String(count);
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function truncate(str, max) {
    if (str.length <= max) return str;
    return str.substring(0, max) + '...';
  }

  // -----------------------------------------------------------------------
  // Initialize
  // -----------------------------------------------------------------------
  render();

  return {
    addCard: addCard,
    moveCard: moveCard,
    getCards: function () { return cards; },
  };
}

// Export for CommonJS / make globally available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createKanbanBoard: createKanbanBoard };
}
window.KanbanBoard = { create: createKanbanBoard };
