import React, { useState, useEffect } from 'react';

function TaskDetailSidebar({ task, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState({});

  // Reset editing state when task changes
  useEffect(() => {
    setIsEditing({});
  }, [task.id]);

  const handleQuickUpdate = (field, value) => {
    onUpdate(task.id, { [field]: value });
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'inprogress': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'done': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  return (
    <div 
      className="fixed inset-y-0 right-0 w-full sm:w-80 md:w-96 bg-white border-l border-gray-200 flex flex-col z-50 sm:z-10 transform transition-transform duration-300 sm:transform-none"
      role="dialog"
      aria-labelledby="task-detail-title"
    >
      {/* Header */}
      <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 id="task-detail-title" className="text-base sm:text-lg font-semibold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
            aria-label="Close task details"
          >
            ×
          </button>
        </div>
        
        {/* Task Title */}
        <div className="mb-3 sm:mb-4">
          {isEditing.title ? (
            <input
              type="text"
              value={task.title}
              onChange={(e) => onUpdate(task.id, { title: e.target.value })}
              onBlur={() => setIsEditing(prev => ({ ...prev, title: false }))}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditing(prev => ({ ...prev, title: false }))}
              className="w-full text-base sm:text-xl font-semibold border-b-2 border-blue-500 focus:outline-none bg-transparent"
              autoFocus
              aria-label="Edit task title"
            />
          ) : (
            <h1 
              className="text-base sm:text-xl font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 p-1 rounded"
              onClick={() => setIsEditing(prev => ({ ...prev, title: true }))}
              tabIndex="0"
              role="button"
              aria-label="Click to edit task title"
            >
              {task.title}
            </h1>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (window.confirm('Delete this task?')) {
                onDelete(task.id);
              }
            }}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>

        {/* Task ID */}
        <div className="mt-3 sm:mt-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Task ID
          </label>
          <div className="text-gray-600 font-mono text-xs sm:text-sm">
            #{task.id}
          </div>
        </div>

        {/* Created Date */}
        <div className="mt-3 sm:mt-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Created
          </label>
          <div className="text-gray-600 text-xs sm:text-sm">
            {formatDate(task.createdAt)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Description */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          {isEditing.description ? (
            <textarea
              value={task.description || ''}
              onChange={(e) => onUpdate(task.id, { description: e.target.value })}
              onBlur={() => setIsEditing(prev => ({ ...prev, description: false }))}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
              rows="4"
              autoFocus
              aria-label="Edit task description"
            />
          ) : (
            <div 
              className="min-h-[60px] p-2 border border-transparent rounded cursor-pointer hover:border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
              onClick={() => setIsEditing(prev => ({ ...prev, description: true }))}
              tabIndex="0"
              role="button"
              aria-label="Click to edit description"
            >
              {task.description || (
                <span className="text-gray-400 italic">Click to add description...</span>
              )}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'todo', label: 'To Do' },
              { value: 'inprogress', label: 'In Progress' },
              { value: 'done', label: 'Done' }
            ].map(status => (
              <button
                key={status.value}
                onClick={() => handleQuickUpdate('status', status.value)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full border transition-colors ${
                  task.status === status.value
                    ? getStatusColor(status.value)
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
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' }
            ].map(priority => (
              <button
                key={priority.value}
                onClick={() => handleQuickUpdate('priority', priority.value)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full border transition-colors ${
                  task.priority === priority.value
                    ? getPriorityColor(priority.value)
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
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          {isEditing.dueDate ? (
            <input
              type="date"
              value={task.dueDate || ''}
              onChange={(e) => handleQuickUpdate('dueDate', e.target.value)}
              onBlur={() => setIsEditing(prev => ({ ...prev, dueDate: false }))}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
              autoFocus
              aria-label="Edit due date"
            />
          ) : (
            <div 
              className="p-2 border border-transparent rounded cursor-pointer hover:border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
              onClick={() => setIsEditing(prev => ({ ...prev, dueDate: true }))}
              tabIndex="0"
              role="button"
              aria-label="Click to edit due date"
            >
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Assignee
          </label>
          {isEditing.assignee ? (
            <input
              type="text"
              value={task.assignee || ''}
              onChange={(e) => onUpdate(task.id, { assignee: e.target.value })}
              onBlur={() => setIsEditing(prev => ({ ...prev, assignee: false }))}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditing(prev => ({ ...prev, assignee: false }))}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
              placeholder="Enter assignee name..."
              autoFocus
              aria-label="Edit assignee"
            />
          ) : (
            <div 
              className="p-2 border border-transparent rounded cursor-pointer hover:border-gray-300 hover:bg-gray-50 flex items-center gap-2 text-xs sm:text-sm"
              onClick={() => setIsEditing(prev => ({ ...prev, assignee: true }))}
              tabIndex="0"
              role="button"
              aria-label="Click to edit assignee"
            >
              {task.assignee ? (
                <>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {task.assignee.charAt(0).toUpperCase()}
                  </div>
                  <span>{task.assignee}</span>
                </>
              ) : (
                <span className="text-gray-400 italic">Click to assign...</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailSidebar;