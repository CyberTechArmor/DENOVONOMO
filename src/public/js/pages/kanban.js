import api from '../api.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { formatDate, formatRelative } from '../utils/dates.js';
import auth from '../auth.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: '#9ca3af' },
  { id: 'todo', title: 'To Do', color: '#3b82f6' },
  { id: 'in_progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'blocked', title: 'Blocked', color: '#ef4444' },
  { id: 'review', title: 'Review', color: '#8b5cf6' },
  { id: 'done', title: 'Done', color: '#10b981' }
];

const PRIORITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#3b82f6',
  none: '#9ca3af'
};

export default function kanbanPage(params) {
  const container = document.getElementById('page-content');
  const locationId = params.id;

  let tasks = [];
  let filteredTasks = [];
  let viewMode = 'board'; // 'board' or 'list'
  let selectedTask = null;
  let detailPanelOpen = false;
  let filters = { category: '', assignee: '', priority: '' };
  let draggedCardId = null;
  let destroyed = false;

  function renderLoading() {
    container.innerHTML = `
      <div class="p-6">
        <div class="skeleton skeleton-heading mb-4" style="width:25%"></div>
        <div style="display:flex;gap:var(--space-3);overflow-x:auto">
          ${Array(6).fill(`
            <div style="min-width:260px;flex:1">
              <div class="card">
                <div class="skeleton skeleton-text mb-3" style="width:60%"></div>
                <div class="skeleton skeleton-card mb-2" style="height:80px"></div>
                <div class="skeleton skeleton-card" style="height:80px"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  function applyFilters() {
    filteredTasks = tasks.filter(t => {
      if (filters.category && t.category !== filters.category) return false;
      if (filters.assignee && t.assignee_id !== filters.assignee) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      return true;
    });
  }

  function getTasksByColumn(columnId) {
    return filteredTasks.filter(t => (t.status || 'backlog') === columnId);
  }

  function getUniqueValues(field) {
    return [...new Set(tasks.map(t => t[field]).filter(Boolean))];
  }

  function render() {
    if (destroyed) return;
    applyFilters();

    const uniqueCategories = getUniqueValues('category');
    const uniqueAssignees = tasks.filter(t => t.assignee_name).map(t => ({ id: t.assignee_id, name: t.assignee_name }));
    const uniqueAssigneeMap = {};
    uniqueAssignees.forEach(a => { if (a.id) uniqueAssigneeMap[a.id] = a.name; });

    container.innerHTML = `
      <div class="p-6" style="display:flex;flex-direction:column;height:calc(100vh - 64px)">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <div>
            <a href="#/locations/${locationId}" class="text-sm text-muted" style="text-decoration:none">&larr; Back to location</a>
            <h1 style="margin:var(--space-2) 0 0">Checklist / Kanban</h1>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-primary" id="kanban-add-btn">+ Add Task</button>
            <button class="btn btn-sm btn-secondary" id="kanban-generate-btn">Generate from Decisions</button>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex gap-3 items-center mb-4">
          <select id="kanban-filter-category" class="form-select" style="width:160px">
            <option value="">All Categories</option>
            ${uniqueCategories.map(c => `<option value="${escapeHtml(c)}" ${filters.category === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
          </select>
          <select id="kanban-filter-assignee" class="form-select" style="width:160px">
            <option value="">All Assignees</option>
            ${Object.entries(uniqueAssigneeMap).map(([id, name]) => `<option value="${id}" ${filters.assignee === id ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')}
          </select>
          <select id="kanban-filter-priority" class="form-select" style="width:140px">
            <option value="">All Priorities</option>
            <option value="critical" ${filters.priority === 'critical' ? 'selected' : ''}>Critical</option>
            <option value="high" ${filters.priority === 'high' ? 'selected' : ''}>High</option>
            <option value="medium" ${filters.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="low" ${filters.priority === 'low' ? 'selected' : ''}>Low</option>
          </select>
          <span style="flex:1"></span>
          <div class="flex gap-1" style="border:1px solid var(--color-border);border-radius:var(--radius-default);overflow:hidden">
            <button class="btn btn-sm ${viewMode === 'board' ? 'btn-primary' : 'btn-ghost'}" id="kanban-view-board">Board</button>
            <button class="btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}" id="kanban-view-list">List</button>
          </div>
        </div>

        ${viewMode === 'board' ? renderBoard() : renderList()}

        <!-- Detail side panel -->
        <div id="kanban-detail-panel" style="
          position:fixed;top:0;right:0;width:440px;height:100vh;
          background:var(--color-bg);border-left:1px solid var(--color-border);
          box-shadow:-4px 0 16px rgba(0,0,0,0.1);z-index:40;
          transform:translateX(${detailPanelOpen ? '0' : '100%'});transition:transform 0.3s ease;
          overflow-y:auto;
        ">
          <div id="kanban-detail-content"></div>
        </div>
      </div>`;

    bindEvents();
  }

  function renderBoard() {
    return `
      <div style="display:flex;gap:var(--space-3);overflow-x:auto;flex:1;padding-bottom:var(--space-3)">
        ${COLUMNS.map(col => {
          const colTasks = getTasksByColumn(col.id);
          return `
            <div class="kanban-col" data-column="${col.id}" style="min-width:240px;flex:1;display:flex;flex-direction:column">
              <div style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2) var(--space-3);margin-bottom:var(--space-2)">
                <span style="width:8px;height:8px;border-radius:50%;background:${col.color}"></span>
                <span class="text-sm font-semibold">${col.title}</span>
                <span class="text-xs text-muted">${colTasks.length}</span>
              </div>
              <div class="kanban-col-cards" data-column="${col.id}" style="
                flex:1;min-height:100px;padding:var(--space-2);
                background:var(--color-bg-subtle);border-radius:var(--radius-default);
                display:flex;flex-direction:column;gap:var(--space-2);
              ">
                ${colTasks.map(task => renderCard(task)).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>`;
  }

  function renderCard(task) {
    const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.none;
    return `
      <div class="kanban-card" draggable="true" data-task-id="${task.id}" style="
        background:var(--color-bg);border:1px solid var(--color-border);
        border-radius:var(--radius-default);padding:var(--space-3);cursor:grab;
        transition:box-shadow 0.15s ease;
      ">
        <div class="flex items-center gap-2 mb-2">
          ${task.category ? `<span style="width:6px;height:6px;border-radius:50%;background:${priorityColor}"></span>` : ''}
          <span class="text-sm font-medium" style="flex:1">${escapeHtml(task.title || '')}</span>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            ${task.priority ? `<span class="text-xs" style="color:${priorityColor};font-weight:600">${escapeHtml(task.priority)}</span>` : ''}
          </div>
          <div class="flex items-center gap-2">
            ${task.due_date ? `<span class="text-xs text-muted">${formatDate(task.due_date)}</span>` : ''}
            ${task.assignee_name ? `
              <span style="width:22px;height:22px;border-radius:50%;background:var(--color-primary-100);color:var(--color-primary-700);display:inline-flex;align-items:center;justify-content:center;font-size:0.625rem;font-weight:600" title="${escapeHtml(task.assignee_name)}">
                ${escapeHtml(task.assignee_name.charAt(0).toUpperCase())}
              </span>
            ` : ''}
          </div>
        </div>
      </div>`;
  }

  function renderList() {
    return `
      <div class="card" style="padding:0;overflow:hidden;flex:1;overflow-y:auto">
        <table class="table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assignee</th>
              <th>Due Date</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTasks.length === 0 ? `
              <tr><td colspan="6" class="text-center text-muted" style="padding:var(--space-5)">No tasks found</td></tr>
            ` : filteredTasks.map(task => `
              <tr class="cursor-pointer kanban-list-row" data-task-id="${task.id}">
                <td class="font-medium">${escapeHtml(task.title || '')}</td>
                <td><span class="badge">${escapeHtml(task.status || 'backlog')}</span></td>
                <td><span style="color:${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.none};font-weight:600;font-size:0.8125rem">${escapeHtml(task.priority || 'none')}</span></td>
                <td>${task.assignee_name ? escapeHtml(task.assignee_name) : '<span class="text-muted">Unassigned</span>'}</td>
                <td class="text-sm text-muted">${task.due_date ? formatDate(task.due_date) : '-'}</td>
                <td>${task.category ? `<span class="badge" style="font-size:0.625rem">${escapeHtml(task.category)}</span>` : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function renderDetailPanel(task) {
    const panelContent = container.querySelector('#kanban-detail-content');
    if (!panelContent) return;

    panelContent.innerHTML = `
      <div style="padding:var(--space-4);border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center">
        <h3 style="margin:0">Task Details</h3>
        <button class="btn btn-ghost btn-sm" id="kanban-detail-close">&times;</button>
      </div>
      <div style="padding:var(--space-4)">
        <div class="form-group mb-4">
          <label class="form-label text-sm">Title</label>
          <input type="text" id="detail-title" class="form-input" value="${escapeHtml(task.title || '')}">
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)" class="mb-4">
          <div class="form-group">
            <label class="form-label text-sm">Status</label>
            <select id="detail-status" class="form-select">
              ${COLUMNS.map(col => `<option value="${col.id}" ${task.status === col.id ? 'selected' : ''}>${col.title}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label text-sm">Priority</label>
            <select id="detail-priority" class="form-select">
              <option value="none" ${task.priority === 'none' ? 'selected' : ''}>None</option>
              <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
              <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
              <option value="critical" ${task.priority === 'critical' ? 'selected' : ''}>Critical</option>
            </select>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)" class="mb-4">
          <div class="form-group">
            <label class="form-label text-sm">Assignee</label>
            <input type="text" id="detail-assignee" class="form-input" value="${escapeHtml(task.assignee_name || '')}" placeholder="Assignee name">
          </div>
          <div class="form-group">
            <label class="form-label text-sm">Due Date</label>
            <input type="date" id="detail-due" class="form-input" value="${task.due_date ? task.due_date.slice(0, 10) : ''}">
          </div>
        </div>

        <div class="form-group mb-4">
          <label class="form-label text-sm">Description</label>
          <textarea id="detail-description" class="form-textarea" rows="4" placeholder="Task description...">${escapeHtml(task.description || '')}</textarea>
        </div>

        ${task.linked_decision_id ? `
          <div class="mb-4" style="padding:var(--space-3);background:var(--color-bg-subtle);border-radius:var(--radius-default)">
            <div class="text-xs font-semibold text-muted mb-1">Linked Decision</div>
            <div class="text-sm">${escapeHtml(task.linked_decision_title || task.linked_decision_id)}</div>
          </div>
        ` : ''}

        <div class="flex gap-2 mb-4">
          <button class="btn btn-primary flex-1" id="detail-save-btn">Save Changes</button>
          <button class="btn btn-danger" id="detail-delete-btn">Delete</button>
        </div>

        <!-- Comments section -->
        <div style="border-top:1px solid var(--color-border);padding-top:var(--space-4)">
          <div class="text-sm font-medium mb-3">Comments</div>
          <div id="detail-comments">
            ${(task.comments || []).map(c => `
              <div style="margin-bottom:var(--space-3);padding-bottom:var(--space-3);border-bottom:1px solid var(--color-border)">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-medium">${escapeHtml(c.author_name || 'Unknown')}</span>
                  <span class="text-xs text-muted">${formatRelative(c.created_at)}</span>
                </div>
                <div class="text-sm">${escapeHtml(c.text || c.content || '')}</div>
              </div>
            `).join('') || '<div class="text-sm text-muted">No comments yet.</div>'}
          </div>
          <div class="flex gap-2 mt-3">
            <input type="text" id="detail-comment-input" class="form-input flex-1" placeholder="Add a comment...">
            <button class="btn btn-sm btn-secondary" id="detail-comment-btn">Post</button>
          </div>
        </div>
      </div>`;

    // Bind detail events
    panelContent.querySelector('#kanban-detail-close')?.addEventListener('click', closeDetail);

    panelContent.querySelector('#detail-save-btn')?.addEventListener('click', () => saveTaskDetail(task.id));
    panelContent.querySelector('#detail-delete-btn')?.addEventListener('click', () => deleteTask(task.id));
    panelContent.querySelector('#detail-comment-btn')?.addEventListener('click', () => addComment(task.id));
    panelContent.querySelector('#detail-comment-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addComment(task.id);
    });
  }

  function openDetail(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    selectedTask = task;
    detailPanelOpen = true;
    const panel = container.querySelector('#kanban-detail-panel');
    if (panel) panel.style.transform = 'translateX(0)';
    renderDetailPanel(task);
  }

  function closeDetail() {
    detailPanelOpen = false;
    selectedTask = null;
    const panel = container.querySelector('#kanban-detail-panel');
    if (panel) panel.style.transform = 'translateX(100%)';
  }

  function bindEvents() {
    // View toggle
    container.querySelector('#kanban-view-board')?.addEventListener('click', () => { viewMode = 'board'; render(); });
    container.querySelector('#kanban-view-list')?.addEventListener('click', () => { viewMode = 'list'; render(); });

    // Filters
    container.querySelector('#kanban-filter-category')?.addEventListener('change', (e) => { filters.category = e.target.value; render(); });
    container.querySelector('#kanban-filter-assignee')?.addEventListener('change', (e) => { filters.assignee = e.target.value; render(); });
    container.querySelector('#kanban-filter-priority')?.addEventListener('change', (e) => { filters.priority = e.target.value; render(); });

    // Add task
    container.querySelector('#kanban-add-btn')?.addEventListener('click', openAddTaskModal);
    container.querySelector('#kanban-generate-btn')?.addEventListener('click', generateFromDecisions);

    // Card click -> open detail (not modal)
    container.querySelectorAll('.kanban-card').forEach(card => {
      card.addEventListener('click', () => openDetail(card.dataset.taskId));
    });
    container.querySelectorAll('.kanban-list-row').forEach(row => {
      row.addEventListener('click', () => openDetail(row.dataset.taskId));
    });

    // HTML5 Drag and Drop
    container.querySelectorAll('.kanban-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        draggedCardId = card.dataset.taskId;
        e.dataTransfer.setData('text/plain', draggedCardId);
        e.dataTransfer.effectAllowed = 'move';
        card.style.opacity = '0.5';
      });
      card.addEventListener('dragend', () => {
        card.style.opacity = '1';
        draggedCardId = null;
      });
    });

    container.querySelectorAll('.kanban-col-cards').forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.style.background = 'var(--color-primary-50)';
      });
      col.addEventListener('dragleave', () => {
        col.style.background = 'var(--color-bg-subtle)';
      });
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.style.background = 'var(--color-bg-subtle)';
        const taskId = e.dataTransfer.getData('text/plain');
        const newStatus = col.dataset.column;
        if (taskId && newStatus) {
          moveTask(taskId, newStatus);
        }
      });
    });
  }

  async function moveTask(taskId, newStatus) {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    const oldStatus = task.status;
    task.status = newStatus;
    render();

    try {
      await api.patch(`/checklists/location/${locationId}/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      task.status = oldStatus;
      render();
      showToast('Failed to move task: ' + err.message, 'error');
    }
  }

  async function saveTaskDetail(taskId) {
    const panel = container.querySelector('#kanban-detail-content');
    if (!panel) return;

    const payload = {
      title: panel.querySelector('#detail-title')?.value?.trim(),
      status: panel.querySelector('#detail-status')?.value,
      priority: panel.querySelector('#detail-priority')?.value,
      assignee_name: panel.querySelector('#detail-assignee')?.value?.trim() || null,
      due_date: panel.querySelector('#detail-due')?.value || null,
      description: panel.querySelector('#detail-description')?.value?.trim() || null
    };

    try {
      await api.patch(`/checklists/location/${locationId}/tasks/${taskId}`, payload);
      const idx = tasks.findIndex(t => t.id === taskId);
      if (idx >= 0) Object.assign(tasks[idx], payload);
      showToast('Task updated', 'success');
      render();
      if (selectedTask) openDetail(taskId);
    } catch (err) {
      showToast('Failed to update task: ' + err.message, 'error');
    }
  }

  async function deleteTask(taskId) {
    try {
      await api.delete(`/checklists/location/${locationId}/tasks/${taskId}`);
      tasks = tasks.filter(t => t.id !== taskId);
      closeDetail();
      showToast('Task deleted', 'success');
      render();
    } catch (err) {
      showToast('Failed to delete task: ' + err.message, 'error');
    }
  }

  async function addComment(taskId) {
    const input = container.querySelector('#detail-comment-input');
    const text = input?.value?.trim();
    if (!text) return;

    try {
      await api.post(`/checklists/location/${locationId}/tasks/${taskId}/comments`, { text });
      if (input) input.value = '';
      // Reload task to get updated comments
      const data = await api.get(`/checklists/location/${locationId}/tasks/${taskId}`);
      const updatedTask = data.task || data;
      const idx = tasks.findIndex(t => t.id === taskId);
      if (idx >= 0) tasks[idx] = { ...tasks[idx], ...updatedTask };
      renderDetailPanel(tasks[idx] || updatedTask);
      showToast('Comment added', 'success');
    } catch (err) {
      showToast('Failed to add comment: ' + err.message, 'error');
    }
  }

  function openAddTaskModal() {
    openModal({
      title: 'Add Task',
      size: 'md',
      body: `
        <div class="form-group mb-3">
          <label class="form-label">Title <span class="required">*</span></label>
          <input type="text" id="add-task-title" class="form-input" placeholder="Task title">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)" class="mb-3">
          <div class="form-group">
            <label class="form-label">Status</label>
            <select id="add-task-status" class="form-select">
              ${COLUMNS.map(col => `<option value="${col.id}">${col.title}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Priority</label>
            <select id="add-task-priority" class="form-select">
              <option value="none">None</option>
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="form-label">Due Date</label>
          <input type="date" id="add-task-due" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea id="add-task-desc" class="form-textarea" rows="3"></textarea>
        </div>
      `,
      footer: [
        { label: 'Cancel', class: 'btn-secondary', onClick: () => closeModal() },
        { label: 'Create Task', class: 'btn-primary', onClick: handleAddTask }
      ]
    });
  }

  async function handleAddTask() {
    const title = document.getElementById('add-task-title')?.value?.trim();
    if (!title) { showToast('Title is required', 'warning'); return; }

    const payload = {
      title,
      status: document.getElementById('add-task-status')?.value || 'backlog',
      priority: document.getElementById('add-task-priority')?.value || 'medium',
      due_date: document.getElementById('add-task-due')?.value || null,
      description: document.getElementById('add-task-desc')?.value?.trim() || null
    };

    try {
      const result = await api.post(`/checklists/location/${locationId}/tasks`, payload);
      const newTask = result.task || result;
      tasks.push(newTask);
      closeModal();
      showToast('Task created', 'success');
      render();
    } catch (err) {
      showToast('Failed to create task: ' + err.message, 'error');
    }
  }

  async function generateFromDecisions() {
    try {
      const btn = container.querySelector('#kanban-generate-btn');
      if (btn) { btn.disabled = true; btn.textContent = 'Generating...'; }

      const result = await api.post(`/checklists/location/${locationId}/generate`, {});
      const newTasks = result.tasks || result || [];
      tasks = tasks.concat(newTasks);
      showToast(`Generated ${newTasks.length} tasks from decisions`, 'success');
      render();
    } catch (err) {
      showToast('Failed to generate tasks: ' + err.message, 'error');
    }
  }

  async function loadData() {
    renderLoading();
    try {
      const data = await api.get(`/checklists/location/${locationId}`);
      tasks = data.tasks || data.items || data || [];
      render();
    } catch (err) {
      container.innerHTML = `
        <div class="p-6">
          <a href="#/locations/${locationId}" class="text-sm text-muted" style="text-decoration:none">&larr; Back to location</a>
          <div class="empty-state mt-5">
            <h3>Unable to Load Checklist</h3>
            <p>${escapeHtml(err.message)}</p>
          </div>
        </div>`;
    }
  }

  loadData();

  return {
    destroy() {
      destroyed = true;
      closeDetail();
    }
  };
}
