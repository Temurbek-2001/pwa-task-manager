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
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusActions = () => {
    const actions = [];
    if (task.status !== 'todo') actions.push({ label: 'Move to To Do', status: 'todo' });
    if (task.status !== 'inprogress') actions.push({ label: 'Move to In Progress', status: 'inprogress' });
    if (task.status !== 'done') actions.push({ label: 'Move to Done', status: 'done' });
    return actions;
  };

  return (
    <div
      className={`bg-white rounded-lg border-2 p-4 cursor-pointer hover:shadow-md transition-all duration-200 relative ${
        isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={onClick}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 flex-1 line-clamp-2">
          {task.title}
        </h4>
        <div className="flex items-center gap-1 ml-2">
          {task.priority && (
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            ⋮
          </button>
        </div>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between text-xs">
        {task.dueDate && (
          <span className={`px-2 py-1 rounded ${
            isOverdue ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
          }`}>
            📅 {formatDueDate(task.dueDate)}
          </span>
        )}
        
        <div className="flex items-center gap-2">
          {task.assignee && (
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {task.assignee.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Actions Dropdown */}
      {showActions && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
                setShowActions(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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