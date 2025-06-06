import React from 'react';
import KanbanColumn from './KanbanColumn';

function KanbanBoard({ tasks, onTaskClick, onTaskEdit, onTaskDelete, onTaskMove }) {
  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-200', count: tasks.filter(t => t.status === 'todo').length },
    { id: 'inprogress', title: 'In Progress', color: 'bg-blue-100', count: tasks.filter(t => t.status === 'inprogress').length },
    { id: 'done', title: 'Done', color: 'bg-green-100', count: tasks.filter(t => t.status === 'done').length }
  ];

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map(column => (
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