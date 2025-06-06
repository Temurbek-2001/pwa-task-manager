import React from 'react';
import TaskCard from './TaskCard';

function KanbanColumn({ column, tasks, onTaskClick, onTaskEdit, onTaskDelete, onTaskMove }) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('text/plain'), 10);
    onTaskMove(taskId, column.id);
  };

  return (
    <div 
      className="flex flex-col h-full min-w-[240px] sm:min-w-0"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="region"
      aria-label={`${column.title} column`}
    >
      {/* Column Header */}
      <div className={`${column.color} rounded-lg p-3 sm:p-4 mb-2 sm:mb-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base sm:text-lg text-gray-800">{column.title}</h3>
          <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
            {column.count}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto p-2 hover:bg-gray-50 rounded-lg transition-colors">
        {tasks.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <div className="text-3xl sm:text-4xl mb-2">📋</div>
            <p className="text-xs sm:text-sm">No tasks here</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onEdit={() => onTaskEdit(task)}
              onDelete={() => onTaskDelete(task.id)}
              onMove={onTaskMove}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;