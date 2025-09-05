// src/components/TaskList.js
import React from 'react';
import { Edit, Trash2, Calendar, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

const TaskList = ({ tasks, loading, onEdit, onDelete, pagination, onPageChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time to compare dates only
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Loading Header */}
        <div className="card-gradient animate-pulse">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                <div>
                  <div className="h-5 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading Cards */}
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {/* Title and badges */}
                    <div className="flex items-center space-x-3">
                      <div className="h-6 bg-gray-300 rounded w-48"></div>
                      <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                    </div>
                    
                    {/* Priority badge */}
                    <div className="h-5 bg-gray-300 rounded w-24"></div>
                    
                    {/* Description */}
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    
                    {/* Meta info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="h-12 bg-gray-300 rounded-lg"></div>
                      <div className="h-12 bg-gray-300 rounded-lg"></div>
                      <div className="h-12 bg-gray-300 rounded-lg"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-6">
                    <div className="flex space-x-1">
                      <div className="h-8 w-8 bg-gray-300 rounded"></div>
                      <div className="h-8 w-8 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-4 w-12 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="card-gradient max-w-lg mx-auto animate-fade-in">
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No tasks found</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              You're all caught up! Create your first task to get started on your productivity journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('createTask'))}
                className="btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Task
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Enhanced Header */}
      <div className="card-gradient mb-6">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Your Tasks
                </h2>
                <p className="text-sm text-gray-600">
                  {pagination.totalTasks} {pagination.totalTasks === 1 ? 'task' : 'tasks'} total
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-sm text-gray-500">Showing {tasks.length} tasks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Task Cards */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div
            key={task._id}
            className="card-hover animate-fade-in group"
            style={{animationDelay: `${index * 0.05}s`}}
          >
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Enhanced Title and Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                          {task.title}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${getStatusColor(task.status)} shadow-sm`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1.5 capitalize font-medium">{task.status.replace('-', ' ')}</span>
                        </span>
                      </div>
                      
                      {/* Priority Badge */}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(task.priority)} shadow-sm`}>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {task.priority.toUpperCase()} PRIORITY
                        </span>
                        {isOverdue(task.dueDate, task.status) && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-800 border border-red-200 shadow-sm animate-pulse">
                            ⚠️ OVERDUE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Description */}
                  {task.description && (
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                  )}

                  {/* Enhanced Meta Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {/* Due Date */}
                    {task.dueDate && (
                      <div className={`flex items-center space-x-2 p-2 rounded-lg bg-gray-50 ${isOverdue(task.dueDate, task.status) ? 'bg-red-50 text-red-700' : 'text-gray-600'}`}>
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Due Date</div>
                          <div className="text-xs">
                            {formatDate(task.dueDate)}
                            {isOverdue(task.dueDate, task.status) && ' (Overdue)'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Created Date */}
                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 text-gray-600">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Created</div>
                        <div className="text-xs">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Updated Date */}
                    {task.updatedAt && task.updatedAt !== task.createdAt && (
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 text-gray-600">
                        <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <div>
                          <div className="font-medium">Updated</div>
                          <div className="text-xs">
                            {new Date(task.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Actions */}
                <div className="flex flex-col items-end space-y-2 ml-6">
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button
                      onClick={() => onEdit(task)}
                      className="btn-secondary btn-sm p-2.5 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 group/edit"
                      title="Edit task"
                    >
                      <Edit className="h-4 w-4 group-hover/edit:scale-110 transition-transform duration-200" />
                    </button>
                    <button
                      onClick={() => onDelete(task._id)}
                      className="btn-secondary btn-sm p-2.5 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 group/delete"
                      title="Delete task"
                    >
                      <Trash2 className="h-4 w-4 group-hover/delete:scale-110 transition-transform duration-200" />
                    </button>
                  </div>
                  
                  {/* Task ID */}
                  <div className="text-xs text-gray-400 font-mono">
                    #{task._id.slice(-6).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.current - 1) * 10) + 1} to {Math.min(pagination.current * 10, pagination.totalTasks)} of {pagination.totalTasks} tasks
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(Math.min(pagination.total, 5))].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === pagination.current;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        isCurrentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => onPageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.total}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;