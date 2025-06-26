import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import taskService from '@/services/api/taskService';
import Button from '@/components/atoms/Button';
import TaskList from '@/components/organisms/TaskList';
import TaskModal from '@/components/organisms/TaskModal';
import FilterBar from '@/components/molecules/FilterBar';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: [],
    dateRange: null
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getAll();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Status filter
    if (filters.status === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filters.status === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filters.status === 'overdue') {
      const now = new Date();
      filtered = filtered.filter(task => 
        !task.completed && new Date(task.dueDate) < now
      );
    }

    // Priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => 
        filters.priority.includes(task.priority)
      );
    }

    // Sort by due date
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    setFilteredTasks(filtered);
  };

  const handleTaskCreate = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      setShowTaskModal(false);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      priority: [],
      dateRange: null
    });
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-surface-200">
          <div className="h-8 bg-surface-200 rounded-lg w-48 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-96"></div>
        </div>
        <div className="flex-1 p-6">
          <SkeletonLoader count={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState 
          message={error}
          onRetry={loadTasks}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-surface-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-surface-900 mb-2">
              All Tasks
            </h1>
            <p className="text-surface-600">
              Manage and organize all your tasks in one place
            </p>
          </div>
          
          <Button
            onClick={() => setShowTaskModal(true)}
            icon="Plus"
            className="shadow-lg"
          >
            New Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total</p>
                <p className="text-2xl font-bold">{taskStats.total}</p>
              </div>
              <ApperIcon name="List" className="w-6 h-6 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-2xl font-bold">{taskStats.completed}</p>
              </div>
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pending</p>
                <p className="text-2xl font-bold">{taskStats.pending}</p>
              </div>
              <ApperIcon name="Clock" className="w-6 h-6 text-yellow-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Overdue</p>
                <p className="text-2xl font-bold">{taskStats.overdue}</p>
              </div>
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <TaskList
            tasks={filteredTasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onCreateTask={() => setShowTaskModal(true)}
            showDate={true}
            emptyMessage="No tasks found"
            emptyDescription="Create your first task or adjust your filters"
          />
        </motion.div>
      </div>

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleTaskCreate}
      />
    </div>
  );
};

export default Tasks;