import React, { useState, useEffect } from 'react';

function TaskDetailSidebar({ task, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showDesc, setShowDesc] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => setIsEditing(null), [task.id]);

  const startEdit = (field, value) => {
    setIsEditing(field);
    setEditValue(value || '');
  };

  const saveEdit = () => {
    if (isEditing && editValue !== '') {
      onUpdate(task.id, { [isEditing]: editValue });
    }
    setIsEditing(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditValue('');
  };

  const updateField = (field, value) => {
    onUpdate(task.id, { [field]: value });
    setIsEditing(null);
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Not set';

  const statusOptions = [
    { value: 'todo', label: 'To Do', color: 'text-gray-600', bg: 'bg-gray-200', desktopColor: 'border-gray-400' },
    { value: 'inprogress', label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-200', desktopColor: 'border-blue-400' },
    { value: 'done', label: 'Done', color: 'text-green-600', bg: 'bg-green-200', desktopColor: 'border-green-400' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'border-green-600', desktopColor: 'bg-green-200 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'border-yellow-600', desktopColor: 'bg-yellow-200 text-yellow-800' },
    { value: 'high', label: 'High', color: 'border-red-600', desktopColor: 'bg-red-200 text-red-800' }
  ];

  // Mobile Block-Based Layout (<640px)
  const MobileLayout = () => (
    <>
      {/* Header Block */}
      <div className="sticky top-0 bg-white shadow-sm rounded-t-2xl p-4 flex items-center justify-between">
        {isEditing === 'title' ? (
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-lg font-bold text-gray-900 bg-transparent border-b-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            autoFocus
            aria-label="Edit task title"
          />
        ) : (
          <h1
            className="text-lg font-bold text-gray-900 truncate"
            onClick={() => startEdit('title', task.title)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEdit('title', task.title); }}
            tabIndex="0"
            role="button"
            aria-label="Edit task title"
            id="task-detail-title"
          >
            {task.title}
          </h1>
        )}
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Close task details"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Status & Priority Block */}
        <div className="bg-white shadow-sm rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-800">Status</span>
            {isEditing === 'status' ? (
              <div className="flex gap-2">
                {statusOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateField('status', opt.value)}
                    className={`px-3 py-1 text-sm ${opt.color} ${opt.bg} rounded-md hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    aria-label={`Set status to ${opt.label}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => startEdit('status', task.status)}
                className={`px-3 py-1 text-sm ${statusOptions.find(opt => opt.value === task.status)?.color} ${statusOptions.find(opt => opt.value === task.status)?.bg} rounded-md hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                aria-label={`Edit status, current: ${statusOptions.find(opt => opt.value === task.status)?.label || 'Not set'}`}
              >
                {statusOptions.find(opt => opt.value === task.status)?.label || 'Not set'}
              </button>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-800">Priority</span>
            {isEditing === 'priority' ? (
              <div className="flex gap-2">
                {priorityOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateField('priority', opt.value)}
                    className={`w-8 h-8 flex items-center justify-center text-sm border-2 ${opt.color} rounded-full hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    aria-label={`Set priority to ${opt.label}`}
                  >
                    {opt.label[0]}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => startEdit('priority', task.priority)}
                className={`w-8 h-8 flex items-center justify-center text-sm border-2 ${priorityOptions.find(opt => opt.value === task.priority)?.color} rounded-full hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                aria-label={`Edit priority, current: ${priorityOptions.find(opt => opt.value === task.priority)?.label || 'Not set'}`}
              >
                {task.priority ? task.priority[0].toUpperCase() : '-'}
              </button>
            )}
          </div>
        </div>

        {/* Due Date & Assignee Block */}
        <div className="bg-white shadow-sm rounded-lg p-3 flex gap-4">
          <div className="flex-1">
            <span className="text-xs font-medium text-gray-800 mb-1 block">Due Date</span>
            {isEditing === 'dueDate' ? (
              <input
                type="date"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="p-2 text-base border border-gray-200 rounded w-full focus:ring-2 focus:ring-blue-500"
                autoFocus
                aria-label="Edit due date"
              />
            ) : (
              <div
                className="p-2 text-base flex items-center gap-2 hover:bg-gray-50 rounded"
                onClick={() => startEdit('dueDate', task.dueDate)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEdit('dueDate', task.dueDate); }}
                tabIndex="0"
                role="button"
                aria-label={`Edit due date, current: ${formatDate(task.dueDate)}`}
              >
                <span className="text-gray-600">📅</span>
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <span className="text-xs font-medium text-gray-800 mb-1 block">Assignee</span>
            {isEditing === 'assignee' ? (
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="p-2 text-base border border-gray-200 rounded w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Assignee..."
                autoFocus
                aria-label="Edit assignee"
              />
            ) : (
              <div
                className="p-2 text-base flex items-center gap-2 hover:bg-gray-50 rounded"
                onClick={() => startEdit('assignee', task.assignee)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEdit('assignee', task.assignee); }}
                tabIndex="0"
                role="button"
                aria-label={`Edit assignee, current: ${task.assignee || 'Not assigned'}`}
              >
                <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                  {task.assignee ? task.assignee[0].toUpperCase() : '👤'}
                </span>
                {task.assignee || 'Not assigned'}
              </div>
            )}
          </div>
        </div>

        {/* Description Block */}
        <div className="bg-white shadow-sm rounded-lg p-3">
          <span className="text-xs font-medium text-gray-800 mb-1 block">Description</span>
          {isEditing === 'description' ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="p-2 text-base border border-gray-200 rounded w-full focus:ring-2 focus:ring-blue-500"
              rows="3"
              autoFocus
              aria-label="Edit description"
            />
          ) : (
            <div
              className="p-2 text-base cursor-pointer hover:bg-gray-50 rounded"
              onClick={() => startEdit('description', task.description)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEdit('description', task.description); }}
              tabIndex="0"
              role="button"
              aria-label={`Edit description, current: ${task.description || 'No description'}`}
            >
              {task.description ? (
                <span className={showDesc ? '' : 'line-clamp-1'}>{task.description}</span>
              ) : (
                <span className="text-gray-600 italic">No description</span>
              )}
              {task.description && task.description.length > 60 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowDesc(!showDesc); }}
                  className="text-sm text-blue-600 hover:underline mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={showDesc ? 'Show less description' : 'Show more description'}
                >
                  {showDesc ? 'Less' : 'More'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Details Block */}
        <div className="bg-white shadow-sm rounded-lg p-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-sm text-blue-600 hover:underline flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={showDetails ? 'Hide task details' : 'Show task details'}
            aria-expanded={showDetails}
          >
            <span>Details</span>
            <span className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {showDetails && (
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-800">Task ID</span>
                <span className="text-gray-600 font-mono">#{task.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800">Created</span>
                <span className="text-gray-600">{formatDate(task.createdAt)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions Block */}
        <div className="bg-white shadow-sm rounded-lg p-3">
          <button
            onClick={() => window.confirm('Delete this task?') && onDelete(task.id)}
            className="w-full py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-100 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Delete task ${task.title}`}
          >
            Delete Task
          </button>
        </div>
      </div>

      {/* Floating Edit Controls */}
      {isEditing && isEditing !== 'status' && isEditing !== 'priority' && (
        <div className="fixed bottom-20 right-4 flex gap-2 z-50">
          <button
            onClick={saveEdit}
            className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Save edit"
          >
            ✓
          </button>
          <button
            onClick={cancelEdit}
            className="w-12 h-12 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Cancel edit"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );

  // Desktop Jira-Like Layout (≥640px)
  const DesktopLayout = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Close task details"
          >
            ✕
          </button>
        </div>
        {isEditing === 'title' ? (
          <div className="flex flex-col gap-2">
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-base font-bold text-gray-900 border-b-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-gray-50 p-2 rounded"
              autoFocus
              aria-label="Edit task title"
            />
            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Save task title"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-1 text-sm text-gray-800 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Cancel title edit"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <h1
            className="text-base font-bold text-gray-900 cursor-pointer hover:bg-gray-50 p-2 rounded"
            onClick={() => startEdit('title', task.title)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEdit('title', task.title); }}
            tabIndex="0"
            role="button"
            aria-label="Edit task title"
            id="task-detail-title"
          >
            {task.title}
          </h1>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2" htmlFor="description-field">Description</label>
          {isEditing === 'description' ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="p-2 text-base border border-gray-200 rounded w-full bg-gray-50 focus:ring-2 focus:ring-blue-500"
                rows="4"
                autoFocus
                aria-label="Edit description"
                id="description-field"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Save description"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-1 text-sm text-gray-800 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Cancel description edit"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              className="p-2 text-base bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => startEdit('description', task.description)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEdit('description', task.description); }}
              tabIndex="0"
              role="button"
              aria-label={`Edit description, current: ${task.description || 'No description'}`}
              id="description-field"
            >
              {task.description || <span className="text-gray-600 italic">No description</span>}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2" htmlFor="status-field">Status</label>
          {isEditing === 'status' ? (
            <div className="flex gap-2">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateField('status', opt.value)}
                  className={`px-4 py-1 text-base border ${opt.desktopColor} rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  aria-label={`Set status to ${opt.label}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={() => startEdit('status', task.status)}
              className={`px-4 py-1 text-base border ${statusOptions.find(opt => opt.value === task.status)?.desktopColor} rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              aria-label={`Edit status, current: ${statusOptions.find(opt => opt.value === task.status)?.label || 'Not set'}`}
              id="status-field"
            >
              {statusOptions.find(opt => opt.value === task.status)?.label || 'Not set'}
            </button>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2" htmlFor="priority-field">Priority</label>
          {isEditing === 'priority' ? (
            <div className="flex gap-2">
              {priorityOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateField('priority', opt.value)}
                  className={`px-4 py-1 text-base ${opt.desktopColor} rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  aria-label={`Set priority to ${opt.label}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={() => startEdit('priority', task.priority)}
              className={`px-4 py-1 text-base ${priorityOptions.find(opt => opt.value === task.priority)?.desktopColor} rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              aria-label={`Edit priority, current: ${priorityOptions.find(opt => opt.value === task.priority)?.label || 'Not set'}`}
              id="priority-field"
            >
              {priorityOptions.find(opt => opt.value === task.priority)?.label || 'Not set'}
            </button>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2" htmlFor="due-date-field">Due Date</label>
          {isEditing === 'dueDate' ? (
            <div className="flex flex-col gap-2">
              <input
                type="date"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="p-2 text-base border border-gray-200 rounded bg-gray-50 w-full focus:ring-2 focus:ring-blue-500"
                autoFocus
                aria-label="Edit due date"
                id="due-date-field"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Save due date"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-1 text-sm text-gray-800 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Cancel due date edit"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              className="p-2 text-base bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => startEdit('dueDate', task.dueDate)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEdit('dueDate', task.dueDate); }}
              tabIndex="0"
              role="button"
              aria-label={`Edit due date, current: ${formatDate(task.dueDate)}`}
              id="due-date-field"
            >
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2" htmlFor="assignee-field">Assignee</label>
          {isEditing === 'assignee' ? (
            <div className="flex flex-col gap-2">
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="p-2 text-base border border-gray-200 rounded bg-gray-50 w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Assignee..."
                autoFocus
                aria-label="Edit assignee"
                id="assignee-field"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Save assignee"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-1 text-sm text-gray-800 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Cancel assignee edit"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              className="p-2 text-base bg-gray-50 rounded cursor-pointer hover:bg-gray-100 flex items-center gap-2"
              onClick={() => startEdit('assignee', task.assignee)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEdit('assignee', task.assignee); }}
              tabIndex="0"
              role="button"
              aria-label={`Edit assignee, current: ${task.assignee || 'Not assigned'}`}
              id="assignee-field"
            >
              {task.assignee ? (
                <>
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                    {task.assignee[0].toUpperCase()}
                  </span>
                  {task.assignee}
                </>
              ) : (
                <span className="text-gray-600 italic">Not assigned</span>
              )}
            </div>
          )}
        </div>

        {/* Task ID */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Task ID</label>
          <div className="p-2 text-base text-gray-600 font-mono">#{task.id}</div>
        </div>

        {/* Created Date */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Created</label>
          <div className="p-2 text-base text-gray-600">{formatDate(task.createdAt)}</div>
        </div>

        {/* Delete */}
        <button
          onClick={() => window.confirm('Delete this task?') && onDelete(task.id)}
          className="w-full py-2 text-sm text-red-600 border border-red-400 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`Delete task ${task.title}`}
        >
          Delete Task
        </button>
      </div>
    </>
  );

  return (
    <div 
      className="fixed top-0 bottom-16 sm:bottom-0 right-0 w-full sm:w-80 md:w-96 bg-gray-50 sm:bg-white sm:border-l sm:border-gray-200 rounded-t-2xl sm:rounded-none flex flex-col z-40 sm:z-10 transition-all duration-300"
      role="complementary"
      aria-label={`Details for task ${task.title}`}
    >
      {window.innerWidth < 640 ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
}

export default TaskDetailSidebar;