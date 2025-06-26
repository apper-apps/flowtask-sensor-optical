import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import taskService from '@/services/api/taskService';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import TaskCard from '@/components/molecules/TaskCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Completed = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getAll();
      setTasks(result.filter(task => task.completed));
    } catch (err) {
      setError(err.message || 'Failed to load completed tasks');
      toast.error('Failed to load completed tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    if (!updatedTask.completed) {
      // Task was reopened, remove from completed list
      setTasks(prev => prev.filter(task => task.Id !== updatedTask.Id));
      toast.success('Task reopened');
    } else {
      setTasks(prev => prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      ));
    }
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const handleReopenTask = async (taskId) => {
    try {
      const updatedTask = await taskService.reopenTask(taskId);
      handleTaskUpdate(updatedTask);
    } catch (error) {
      toast.error('Failed to reopen task');
    }
  };

  // Filter tasks based on search and period
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    const completedDate = new Date(task.completedAt);
    
    switch (selectedPeriod) {
      case 'today':
        return isToday(completedDate);
      case 'yesterday':
        return isYesterday(completedDate);
      case 'week':
        return isThisWeek(completedDate);
      case 'month':
        return isThisMonth(completedDate);
      default:
        return true;
    }
  });

  // Group tasks by completion period
  const groupedTasks = {
    today: filteredTasks.filter(task => isToday(new Date(task.completedAt))),
    yesterday: filteredTasks.filter(task => isYesterday(new Date(task.completedAt))),
    thisWeek: filteredTasks.filter(task => 
      isThisWeek(new Date(task.completedAt)) && 
      !isToday(new Date(task.completedAt)) && 
      !isYesterday(new Date(task.completedAt))
    ),
    older: filteredTasks.filter(task => 
      !isThisWeek(new Date(task.completedAt))
    )
  };

  const periodOptions = [
    { value: 'all', label: 'All Time', count: tasks.length },
    { value: 'today', label: 'Today', count: groupedTasks.today.length },
    { value: 'yesterday', label: 'Yesterday', count: groupedTasks.yesterday.length },
    { value: 'week', label: 'This Week', count: groupedTasks.thisWeek.length },
    { value: 'month', label: 'This Month', count: filteredTasks.filter(task => isThisMonth(new Date(task.completedAt))).length }
  ];

  const totalCompleted = tasks.length;
  const completedToday = groupedTasks.today.length;
  const completedThisWeek = tasks.filter(task => isThisWeek(new Date(task.completedAt))).length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded-lg w-64 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-96"></div>
        </div>
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
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
              Completed Tasks
            </h1>
            <p className="text-surface-600">
              Review your accomplishments and track your progress
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              icon="RefreshCw"
              onClick={loadTasks}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Completed</p>
                <p className="text-3xl font-bold">{totalCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
                <ApperIcon name="Trophy" className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Today</p>
                <p className="text-3xl font-bold">{completedToday}</p>
              </div>
              <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center">
                <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold">{completedThisWeek}</p>
              </div>
              <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search completed tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedPeriod(option.value)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${selectedPeriod === option.value
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                  }
                `}
              >
                {option.label}
                <Badge variant={selectedPeriod === option.value ? "primary" : "default"} size="sm">
                  {option.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon="CheckCircle2"
            title="No completed tasks found"
            description={
              searchTerm || selectedPeriod !== 'all'
                ? "Try adjusting your search or filter criteria"
                : "Complete some tasks to see them here"
            }
            actionLabel="View All Tasks"
            onAction={() => window.location.href = '/tasks'}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Today */}
            {groupedTasks.today.length > 0 && (selectedPeriod === 'all' || selectedPeriod === 'today') && (
              <div>
                <h2 className="font-display font-semibold text-xl text-surface-900 mb-4 flex items-center gap-2">
                  <ApperIcon name="Calendar" className="w-5 h-5 text-green-600" />
                  Today
                  <Badge variant="success" size="sm">{groupedTasks.today.length}</Badge>
                </h2>
                <div className="space-y-4">
                  {groupedTasks.today.map((task) => (
                    <CompletedTaskCard
                      key={task.Id}
                      task={task}
                      onReopen={handleReopenTask}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday */}
            {groupedTasks.yesterday.length > 0 && (selectedPeriod === 'all' || selectedPeriod === 'yesterday') && (
              <div>
                <h2 className="font-display font-semibold text-xl text-surface-900 mb-4 flex items-center gap-2">
                  <ApperIcon name="Clock" className="w-5 h-5 text-blue-600" />
                  Yesterday
                  <Badge variant="primary" size="sm">{groupedTasks.yesterday.length}</Badge>
                </h2>
                <div className="space-y-4">
                  {groupedTasks.yesterday.map((task) => (
                    <CompletedTaskCard
                      key={task.Id}
                      task={task}
                      onReopen={handleReopenTask}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Earlier This Week */}
            {groupedTasks.thisWeek.length > 0 && (selectedPeriod === 'all' || selectedPeriod === 'week') && (
              <div>
                <h2 className="font-display font-semibold text-xl text-surface-900 mb-4 flex items-center gap-2">
                  <ApperIcon name="Calendar" className="w-5 h-5 text-purple-600" />
                  Earlier This Week
                  <Badge variant="secondary" size="sm">{groupedTasks.thisWeek.length}</Badge>
                </h2>
                <div className="space-y-4">
                  {groupedTasks.thisWeek.map((task) => (
                    <CompletedTaskCard
                      key={task.Id}
                      task={task}
                      onReopen={handleReopenTask}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Older */}
            {groupedTasks.older.length > 0 && selectedPeriod === 'all' && (
              <div>
                <h2 className="font-display font-semibold text-xl text-surface-900 mb-4 flex items-center gap-2">
                  <ApperIcon name="Archive" className="w-5 h-5 text-surface-600" />
                  Older
                  <Badge variant="default" size="sm">{groupedTasks.older.length}</Badge>
                </h2>
                <div className="space-y-4">
                  {groupedTasks.older.map((task) => (
                    <CompletedTaskCard
                      key={task.Id}
                      task={task}
                      onReopen={handleReopenTask}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Completed Task Card Component
const CompletedTaskCard = ({ task, onReopen, onUpdate, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleReopen = async () => {
    setLoading(true);
    try {
      await onReopen(task.Id);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this completed task?')) {
      setLoading(true);
      try {
        await taskService.delete(task.Id);
        onDelete(task.Id);
        toast.success('Task deleted');
      } catch (error) {
        toast.error('Failed to delete task');
      } finally {
        setLoading(false);
      }
    }
  };

  const priorityConfig = {
    high: { variant: 'high', icon: 'AlertTriangle' },
    medium: { variant: 'medium', icon: 'Clock' },
    low: { variant: 'low', icon: 'ArrowDown' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-surface-200 border-l-4 border-l-green-500"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <ApperIcon name="CheckCircle2" className="w-5 h-5 text-green-600" />
            <h3 className="font-display font-semibold text-lg text-surface-900">
              {task.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-surface-600 mb-3">
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" className="w-4 h-4" />
              Due: {format(new Date(task.dueDate), 'MMM d, h:mm a')}
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Check" className="w-4 h-4" />
              Completed: {format(new Date(task.completedAt), 'MMM d, h:mm a')}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge
              variant={priorityConfig[task.priority].variant}
              icon={priorityConfig[task.priority].icon}
              size="sm"
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            
            {task.checklist && task.checklist.length > 0 && (
              <Badge variant="success" size="sm">
                {task.checklist.length} items completed
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            icon="RotateCcw"
            onClick={handleReopen}
            disabled={loading}
            className="text-blue-600 hover:text-blue-700"
          >
            Reopen
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-700"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Completed;