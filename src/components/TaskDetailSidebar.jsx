import React, { useState, useEffect } from 'react';

function TaskDetailSidebar({ task, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState({});

  useEffect(() => setIsEditing({}), [task.id]);

  const handleQuickUpdate = (field, value) => {
    onUpdate(task.id, { [field]: value });
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  const formatDate = (dateString) => 
    dateString 
      ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : 'Not set';

  const colorStyles = {
    priority: {
      high: 'bg-red-100 text-red-700 border-red-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-green-100 text-green-700 border-green-300',
      default: 'bg-gray-100 text-gray-600 border-gray-300'
    },
    status: {
      todo: 'bg-gray-100 text-gray-700 border-gray-300',
      inprogress: 'bg-blue-100 text-blue-700 border-blue-300',
      done: 'bg-green-100 text-green-700 border-green-300',
      default: 'bg-gray-100 text-gray-600 border-gray-300'
    }
  };

  const getColor = (type, value) => colorStyles[type][value] || colorStyles[type].default;

  const renderEditableField = (field, value, Component, props = {}) => (
    isEditing[field] ? (
      <Component
        value={value || ''}
        onChange={(e) => onUpdate(task.id, { [field]: e.target.value })}
        onBlur={() => setIsEditing(prev => ({ ...prev, [field]: false }))}
        onKeyPress={(e) => e.key === 'Enter' && setIsEditing(prev => ({ ...prev, [field]: false }))}
        className={`w-full p-2 text-xs sm:text-sm ${props.inputClass || 'border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
        autoFocus
        aria-label={`Edit ${field}`}
        {...props}
      />
    ) : (
      <div
        className={`p-2 rounded cursor-pointer hover:bg-gray-50 text-xs sm:text-sm ${props.displayClass || ''}`}
        onClick={() => setIsEditing(prev => ({ ...prev, [field]: true }))}
        tabIndex="0"
        role="button"
        aria-label={`Click to edit ${field}`}
      >
        {props.renderValue ? props.renderValue(value) : value || <span className="text-gray-400 italic">Click to set...</span>}
      </div>
    )
  );

  return (
    <div 
      className="fixed top-0 bottom-16 sm:bottom-0 right-0 w-full sm:w-80 md:w-96 bg-white border-l border-gray-200 flex flex-col z-40 sm:z-10 transition-transform duration-300 sm:transform-none"
      role="dialog"
      aria-labelledby="task-detail-title"
    >
      {/* Header */}
      <div className="p-2 sm:p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <h2 id="task-detail-title" className="text-base sm:text-lg font-semibold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
            aria-label="Close task details"
          >
            ×
          </button>
        </div>

        {renderEditableField('title', task.title, 'input', {
          inputClass: 'text-base sm:text-xl font-semibold border-b-2 border-blue-500 bg-transparent focus:outline-none',
          displayClass: 'text-base sm:text-xl font-semibold text-gray-900'
        })}

        <div className="flex gap-2 mt-2 sm:mt-4">
          <button
            onClick={() => window.confirm('Delete this task?') && onDelete(task.id)}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>

        <div className="mt-2 sm:mt-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Task ID</label>
          <div className="text-gray-600 font-mono text-xs sm:text-sm">#{task.id}</div>
        </div>

        <div className="mt-2 sm:mt-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Created</label>
          <div className="text-gray-600 text-xs sm:text-sm">{formatDate(task.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-6">
        {/* Description */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
          {renderEditableField('description', task.description, 'textarea', {
            rows: 3,
            renderValue: (value) => value || <span className="text-gray-400 italic">Click to add...</span>
          })}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'todo', label: 'To Do' },
              { value: 'inprogress', label: 'In Progress' },
              { value: 'done', label: 'Done' }
            ].map(status => (
              <button
                key={status.value}
                onClick={() => handleQuickUpdate('status', status.value)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full border ${
                  task.status === status.value
                    ? getColor('status', status.value)
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
                aria-label={`Set status to ${status.label}`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Priority</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' }
            ].map(priority => (
              <button
                key={priority.value}
                onClick={() => handleQuickUpdate('priority', priority.value)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full border ${
                  task.priority === priority.value
                    ? getColor('priority', priority.value)
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
                aria-label={`Set priority to ${priority.label}`}
              >
                {priority.label}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Due Date</label>
          {renderEditableField('dueDate', task.dueDate, 'input', {
            type: 'date',
            renderValue: formatDate
          })}
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Assignee</label>
          {renderEditableField('assignee', task.assignee, 'input', {
            placeholder: 'Enter assignee name...',
            renderValue: (value) => value ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {value.charAt(0).toUpperCase()}
                </div>
                <span>{value}</span>
              </div>
            ) : <span className="text-gray-400 italic">Click to assign...</span>
          })}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailSidebar;