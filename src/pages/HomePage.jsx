// pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import TaskDetailSidebar from '../components/TaskDetailSidebar';
import { getAllTasks, addTask, updateTask, deleteTask } from '../utils/idb';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeStatus, setActiveStatus] = useState('todo');

  // Load tasks from IndexedDB
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await getAllTasks();
        setTasks(storedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    loadTasks();
  }, []);

  // Update selectedTask when tasks change
  useEffect(() => {
    if (selectedTask) {
      const updatedTask = tasks.find(task => task.id === selectedTask.id);
      if (updatedTask) {
        setSelectedTask(updatedTask);
      } else {
        setSelectedTask(null); // Close sidebar if task no longer exists
      }
    }
  }, [tasks]);

  // Add new task
  const addNewTask = async (taskData) => {
    try {
      const newTask = {
        id: Date.now(),
        ...taskData,
        status: 'todo',
        createdAt: new Date().toISOString()
      };
      await addTask(newTask);
      setTasks(prev => [...prev, newTask]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    }
  };

  // Update task
  const updateExistingTask = async (taskId, updatedData) => {
    try {
      const updatedTask = { ...tasks.find(task => task.id === taskId), ...updatedData };
      await updateTask(updatedTask);
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  // Delete task
  const deleteExistingTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  // Move task between columns
  const moveTask = async (taskId, newStatus) => {
    try {
      const updatedTask = { ...tasks.find(task => task.id === taskId), status: newStatus };
      await updateTask(updatedTask);
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
      setActiveStatus(newStatus); // Switch to the new status column
      setSelectedTask(null); // Close sidebar if open
    } catch (error) {
      console.error('Error moving task:', error);
      alert('Failed to move task');
    }
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
      <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Task Board</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            aria-label="Create new task"
          >
            <span className="text-base sm:text-lg">+</span>
            Create Task
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Kanban Board */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-auto">
          <KanbanBoard
            tasks={tasks}
            activeStatus={activeStatus}
            onTaskClick={setSelectedTask}
            onTaskEdit={openEditModal}
            onTaskDelete={deleteExistingTask}
            onTaskMove={moveTask}
          />
        </div>

        {/* Task Detail Sidebar */}
        {selectedTask && (
          <TaskDetailSidebar
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={updateExistingTask}
            onDelete={deleteExistingTask}
          />
        )}
      </div>

      {/* Mobile Status Navbar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center h-16 shadow-md z-50">
        {[
          { id: 'todo', label: 'To Do', icon: '📋' },
          { id: 'inprogress', label: 'In Progress', icon: '⏳' },
          { id: 'done', label: 'Done', icon: '✅' }
        ].map(status => (
          <button
            key={status.id}
            onClick={() => {
              setActiveStatus(status.id);
              setSelectedTask(null); // Close sidebar
            }}
            className={`flex-1 flex flex-col items-center justify-center h-full text-sm font-semibold transition-colors ${
              activeStatus === status.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={`Show ${status.label} tasks`}
          >
            <span className="text-base">{status.icon}</span>
            <span>{status.label}</span>
          </button>
        ))}
      </nav>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onSave={editingTask ? updateExistingTask : addNewTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default HomePage;