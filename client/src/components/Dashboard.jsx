// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import taskService from '../services/taskService.js';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Header from './Header';
import { Plus, Search, Filter } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalTasks: 0
  });

  // Fetch tasks
  const fetchTasks = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        ...filters,
        ...params,
        page: params.page || pagination.current
      };
      
      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) delete queryParams[key];
      });

      const response = await taskService.getTasks(queryParams);
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error('Fetch tasks error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  // Listen for custom create task event from empty state
  useEffect(() => {
    const handleCreateTask = () => {
      setShowTaskForm(true);
    };

    window.addEventListener('createTask', handleCreateTask);
    return () => {
      window.removeEventListener('createTask', handleCreateTask);
    };
  }, []);

  // Handle create task
  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      toast.success('Task created successfully!');
      setShowTaskForm(false);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  // Handle update task
  const handleUpdateTask = async (id, taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      toast.success('Task updated successfully!');
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  // Handle delete task
  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        toast.success('Task deleted successfully!');
        fetchTasks();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    handleFilterChange('search', searchTerm);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Stay on top of your tasks and boost your productivity with our intuitive task management system.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="card-gradient card-hover animate-slide-in">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Total Tasks</p>
                    <p className="text-3xl font-bold text-gray-900">{pagination.totalTasks}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    All time
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-gradient card-hover animate-slide-in" style={{animationDelay: '0.1s'}}>
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {tasks.filter(task => task.status === 'pending').length}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                    Awaiting
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-gradient card-hover animate-slide-in" style={{animationDelay: '0.2s'}}>
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">In Progress</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {tasks.filter(task => task.status === 'in-progress').length}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-gradient card-hover animate-slide-in" style={{animationDelay: '0.3s'}}>
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {tasks.filter(task => task.status === 'completed').length}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    Done ✨
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="card-gradient animate-fade-in mb-8">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                {/* Enhanced Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks by title or description..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="form-input pl-12 py-3.5 text-sm placeholder-gray-400"
                  />
                </div>

                {/* Enhanced Filters */}
                <div className="flex gap-3">
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="form-select py-3.5 text-sm appearance-none bg-white pr-10"
                    >
                      <option value="">📋 All Status</option>
                      <option value="pending">⏳ Pending</option>
                      <option value="in-progress">⚡ In Progress</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                      className="form-select py-3.5 text-sm appearance-none bg-white pr-10"
                    >
                      <option value="">🎯 All Priority</option>
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  {(filters.search || filters.status || filters.priority) && (
                    <button
                      onClick={clearFilters}
                      className="btn-secondary py-3.5 px-4 text-sm border-dashed hover:border-solid transition-all duration-200"
                      title="Clear all filters"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Add Task Button */}
              <button
                onClick={() => setShowTaskForm(true)}
                className="btn-primary py-3.5 px-6 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                <span>Create New Task</span>
              </button>
            </div>
            
            {/* Active Filters Display */}
            {(filters.search || filters.status || filters.priority) && (
              <div className="mt-4 pt-4 border-t border-gray-200/60">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Active filters:</span>
                  {filters.search && (
                    <span className="badge-primary">
                      Search: "{filters.search}"
                    </span>
                  )}
                  {filters.status && (
                    <span className="badge-warning">
                      Status: {filters.status.replace('-', ' ')}
                    </span>
                  )}
                  {filters.priority && (
                    <span className="badge-error">
                      Priority: {filters.priority}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
          pagination={pagination}
          onPageChange={(page) => fetchTasks({ page })}
        />

        {/* Task Form Modal */}
        {(showTaskForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? 
              (data) => handleUpdateTask(editingTask._id, data) : 
              handleCreateTask
            }
            onClose={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;