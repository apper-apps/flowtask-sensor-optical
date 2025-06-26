import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isYesterday, startOfDay, endOfDay, isPast } from 'date-fns';
import taskService from '@/services/api/taskService';
import ProgressRing from '@/components/atoms/ProgressRing';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import TaskList from '@/components/organisms/TaskList';
import TaskModal from '@/components/organisms/TaskModal';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

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

  // Filter tasks for today
  const today = new Date();
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return isToday(taskDate);
  });

  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate > endOfDay(today) && !task.completed;
  }).slice(0, 3);

  const overdueTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return isPast(taskDate) && !task.completed && !isToday(taskDate);
  });

  // Calculate progress
  const completedToday = todayTasks.filter(task => task.completed).length;
  const totalToday = todayTasks.length;
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const stats = [
    {
      label: "Today's Tasks",
      value: totalToday,
      icon: "Calendar",
      color: "from-blue-500 to-blue-600"
    },
    {
      label: "Completed",
      value: completedToday,
      icon: "CheckCircle",
      color: "from-green-500 to-green-600"
    },
    {
      label: "Overdue",
      value: overdueTasks.length,
      icon: "AlertTriangle",
      color: "from-red-500 to-red-600"
    },
    {
      label: "Upcoming",
      value: upcomingTasks.length,
      icon: "Clock",
      color: "from-purple-500 to-purple-600"
    }
  ];

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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-surface-900 mb-2">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}! 
          </h1>
          <p className="text-surface-600">
            {format(today, 'EEEE, MMMM d, yyyy')} • Let's make today productive
          </p>
        </div>
        
        <Button
          onClick={() => setShowTaskModal(true)}
          icon="Plus"
          className="shadow-lg"
        >
          Add Task
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-xl text-surface-900 mb-2">
              Today's Progress
            </h2>
            <p className="text-surface-600 mb-4">
              {completedToday} of {totalToday} tasks completed
            </p>
            
            {progressPercentage === 100 && totalToday > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-green-600 font-medium"
              >
                <ApperIcon name="Trophy" className="w-5 h-5" />
                Congratulations! All tasks completed!
              </motion.div>
            )}
          </div>
          
          <ProgressRing
            progress={progressPercentage}
            size={80}
            strokeWidth={6}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-surface-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-surface-900">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-surface-900">
              Today's Tasks
            </h2>
            <Badge variant="primary">
              {todayTasks.length} tasks
            </Badge>
          </div>
          
          <TaskList
            tasks={todayTasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onCreateTask={() => setShowTaskModal(true)}
            showDate={false}
            emptyMessage="No tasks for today"
            emptyDescription="Add a task to get started with your day"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-900">Overdue Tasks</h3>
                <Badge variant="danger" size="sm">
                  {overdueTasks.length}
                </Badge>
              </div>
              
              <div className="space-y-3">
                {overdueTasks.slice(0, 3).map((task) => (
                  <div key={task.Id} className="bg-white rounded-lg p-3 border border-red-200">
                    <h4 className="font-medium text-surface-900 text-sm mb-1">
                      {task.title}
                    </h4>
                    <p className="text-red-600 text-xs">
                      Due {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Tasks */}
          {upcomingTasks.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-surface-200">
              <div className="flex items-center gap-2 mb-4">
                <ApperIcon name="Clock" className="w-5 h-5 text-surface-600" />
                <h3 className="font-semibold text-surface-900">Upcoming</h3>
              </div>
              
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.Id} className="border-l-4 border-primary pl-3">
                    <h4 className="font-medium text-surface-900 text-sm mb-1">
                      {task.title}
                    </h4>
                    <p className="text-surface-600 text-xs">
                      {isToday(new Date(task.dueDate)) && 'Today'} 
                      {isTomorrow(new Date(task.dueDate)) && 'Tomorrow'}
                      {!isToday(new Date(task.dueDate)) && !isTomorrow(new Date(task.dueDate)) && 
                        format(new Date(task.dueDate), 'MMM d')} 
                      {' at '} 
                      {format(new Date(task.dueDate), 'h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleTaskCreate}
      />
    </div>
  );
};

export default Dashboard;