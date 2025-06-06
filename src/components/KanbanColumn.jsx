import React from 'react';
import TaskCard from './TaskCard';

function KanbanColumn({ column, tasks, onTaskClick, onTaskEdit, onTaskDelete, onTaskMove }) {
  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`${column.color} rounded-lg p-4 mb-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{column.title}</h3>
          <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
            {column.count}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">No tasks here</p>
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