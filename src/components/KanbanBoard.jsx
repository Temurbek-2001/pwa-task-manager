import React from 'react';
import KanbanColumn from './KanbanColumn';

function KanbanBoard({ tasks, activeStatus, onTaskClick, onTaskEdit, onTaskDelete, onTaskMove }) {
  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-200', count: tasks.filter(t => t.status === 'todo').length },
    { id: 'inprogress', title: 'In Progress', color: 'bg-blue-200', count: tasks.filter(t => t.status === 'inprogress').length },
    { id: 'done', title: 'Done', color: 'bg-green-200', count: tasks.filter(t => t.status === 'done').length }
  ];

  // Filter columns for mobile (show only activeStatus)
  const filteredColumns = window.innerWidth < 640
    ? columns.filter(column => column.id === activeStatus)
    : columns;

  return (
    <div className="h-full overflow-x-auto" role="region" aria-label="Kanban board columns">
      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 md:gap-6 h-full min-w-[240px]">
        {filteredColumns.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks.filter(task => task.status === column.id)}
            onTaskClick={onTaskClick}
            onTaskEdit={onTaskEdit}
            onTaskDelete={onTaskDelete}
            onTaskMove={onTaskMove}
          />
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;