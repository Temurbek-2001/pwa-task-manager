import React, { useState, useEffect } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import TaskDetailSidebar from '../components/TaskDetailSidebar';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('pwa-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('pwa-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add new task
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      status: 'todo',
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    setIsModalOpen(false);
  };

  // Update task
  const updateTask = (taskId, updatedData) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, ...updatedData } : task
      )
    );
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setSelectedTask(null);
  };

  // Move task between columns
  const moveTask = (taskId, newStatus) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Open edit modal
  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Create Task
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Kanban Board */}
        <div className="flex-1 p-6">
          <KanbanBoard
            tasks={tasks}
            onTaskClick={setSelectedTask}
            onTaskEdit={openEditModal}
            onTaskDelete={deleteTask}
            onTaskMove={moveTask}
          />
        </div>

        {/* Task Detail Sidebar */}
        {selectedTask && (
          <TaskDetailSidebar
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        )}
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onSave={editingTask ? updateTask : addTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default HomePage;