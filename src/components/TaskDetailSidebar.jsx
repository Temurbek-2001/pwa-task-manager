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
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'text-gray-600 bg-gray-100';
      case 'inprogress': return 'text-blue-600 bg-blue-100';
      case 'done': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        
        {/* Task Title */}
        <div className="mb-4">
          {isEditing.title ? (
            <input
              type="text"
              value={task.title}
              onChange={(e) => onUpdate(task.id, { title: e.target.value })}
              onBlur={() => setIsEditing(prev => ({ ...prev, title: false }))}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditing(prev => ({ ...prev, title: false }))}
              className="w-full text-xl font-semibold border-b-2 border-blue-500 focus:outline-none bg-transparent"
              autoFocus
            />
          ) : (
            <h1 
              className="text-xl font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 p-1 rounded"
              onClick={() => setIsEditing(prev => ({ ...prev, title: true }))}
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
            className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
          >
            Delete
          </button>
        </div>

        {/* Task ID */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task ID
          </label>
          <div className="text-gray-600 font-mono text-sm">
            #{task.id}
          </div>
        </div>

        {/* Created Date */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Created
          </label>
          <div className="text-gray-600">
            {formatDate(task.createdAt)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          {isEditing.description ? (
            <textarea
              value={task.description || ''}
              onChange={(e) => onUpdate(task.id, { description: e.target.value })}
              onBlur={() => setIsEditing(prev => ({ ...prev, description: false }))}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              autoFocus
            />
          ) : (
            <div 
              className="min-h-[60px] p-2 border border-transparent rounded cursor-pointer hover:border-gray-300 hover:bg-gray-50"
              onClick={() => setIsEditing(prev => ({ ...prev, description: true }))}
            >
              {task.description || (
                <span className="text-gray-400 italic">Click to add description...</span>
              )}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={task.status}
            onChange={(e) => handleQuickUpdate('status', e.target.value)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)} border-0 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={task.priority || 'medium'}
            onChange={(e) => handleQuickUpdate('priority', e.target.value)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)} border-0 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          {isEditing.dueDate ? (
            <input
              type="date"
              value={task.dueDate || ''}
              onChange={(e) => handleQuickUpdate('dueDate', e.target.value)}
              onBlur={() => setIsEditing(prev => ({ ...prev, dueDate: false }))}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <div 
              className="p-2 border border-transparent rounded cursor-pointer hover:border-gray-300 hover:bg-gray-50"
              onClick={() => setIsEditing(prev => ({ ...prev, dueDate: true }))}
            >
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignee
          </label>
          {isEditing.assignee ? (
            <input
              type="text"
              value={task.assignee || ''}
              onChange={(e) => onUpdate(task.id, { assignee: e.target.value })}
              onBlur={() => setIsEditing(prev => ({ ...prev, assignee: false }))}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditing(prev => ({ ...prev, assignee: false }))}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter assignee name..."
              autoFocus
            />
          ) : (
            <div 
              className="p-2 border border-transparent rounded cursor-pointer hover:border-gray-300 hover:bg-gray-50 flex items-center gap-2"
              onClick={() => setIsEditing(prev => ({ ...prev, assignee: true }))}
            >
              {task.assignee ? (
                <>
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
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

        {/* Progress */}
        {task.progress !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={task.progress || 0}
                onChange={(e) => handleQuickUpdate('progress', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                {task.progress || 0}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetailSidebar;