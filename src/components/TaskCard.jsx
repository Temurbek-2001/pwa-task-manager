import React, { useState } from 'react';

function TaskCard({ task, onClick, onEdit, onDelete, onMove }) {
  const [showActions, setShowActions] = useState(false);

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays > 1) return `${diffDays} days left`;
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusActions = () => {
    const actions = [];
    if (task.status !== 'todo') actions.push({ label: 'Move to To Do', status: 'todo' });
    if (task.status !== 'inprogress') actions.push({ label: 'Move to In Progress', status: 'inprogress' });
    if (task.status !== 'done') actions.push({ label: 'Move to Done', status: 'done' });
    return actions;
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border-2 p-3 sm:p-4 cursor-move touch-none transition-all duration-200 relative ${
        isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-400'
      }`}
      draggable="true"
      onDragStart={handleDragStart}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="listitem"
      aria-label={`Task: ${task.title}`}
      tabIndex={0}
    >
      {/* Task Content */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-base sm:text-lg text-gray-900 flex-1 line-clamp-1 sm:line-clamp-2">
          {task.title}
        </h4>
        <div className="flex items-center gap-1 ml-2">
          {task.priority && (
            <div 
              className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} 
              aria-label={`Priority: ${task.priority}`}
            />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="text-gray-600 hover:text-gray-800 p-1 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Toggle actions for task ${task.title}`}
            aria-expanded={showActions}
          >
            ⋮
          </button>
        </div>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 line-clamp-3 sm:line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        {task.dueDate && (
          <span className={`px-2 py-1 rounded ${
            isOverdue ? 'bg-red-200 text-red-900' : 'bg-gray-100 text-gray-700'
          }`}>
            📅 {formatDueDate(task.dueDate)}
          </span>
        )}
        
        <div className="flex items-center gap-2">
          {task.assignee && (
            <div 
              className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium"
              aria-label={`Assigned to ${task.assignee}`}
            >
              {task.assignee.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Actions Dropdown */}
      {showActions && (
        <div 
          className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40 sm:min-w-48"
          role="menu"
          aria-label={`Actions for task ${task.title}`}
        >
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
                setShowActions(false);
              }}
              className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              role="menuitem"
              aria-label={`Edit task ${task.title}`}
            >
              ✏️ Edit Task
            </button>
            
            {getStatusActions().map(action => (
              <button
                key={action.status}
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(task.id, action.status);
                  setShowActions(false);
                }}
                className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                role="menuitem"
                aria-label={action.label}
              >
                🔄 {action.label}
              </button>
            ))}
            
            <hr className="my-1" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Delete this task?')) {
                  onDelete();
                }
                setShowActions(false);
              }}
              className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              role="menuitem"
              aria-label={`Delete task ${task.title}`}
            >
              🗑️ Delete Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;